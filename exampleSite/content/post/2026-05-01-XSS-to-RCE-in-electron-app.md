---
title: "XSS to RCE in Electron App"
date: 2026-05-01
categories: ["example"]
tags: ["electron", "rce", "xss"]
---

  # Remote Code Execution via SoundCloud Track Title in Electron App

  ## Summary

  The application exposes a preload API (`window.soundcloudAPI.sendTrackUpdate`) to
  the remote SoundCloud page. Track metadata from SoundCloud is trusted and forwarded
  through IPC into the Electron main process. The app later renders that metadata as
  raw HTML inside privileged Electron views that have Node.js integration enabled.

  I confirmed this with a real SoundCloud upload: a track title containing an HTML
  payload executed locally in the Electron app. This means attacker-controlled
  SoundCloud track metadata can lead to local command execution on the user's
  machine.

  ## Severity

  Critical

  ## Affected Components

  - `src/preload.ts`
  - `src/main.ts`
  - `src/settings/settingsManager.ts`
  - Electron `BrowserView` configuration with:
    - `nodeIntegration: true`
    - `contextIsolation: false`
    - `sandbox: false`

  ## Vulnerable Code

  The preload exposes a callable API to the SoundCloud page:

  ```js
  contextBridge.exposeInMainWorld('soundcloudAPI', {
      sendTrackUpdate: (data, reason) => {
          ipcRenderer.send('soundcloud:track-update', {
              data,
              reason,
          });
      },
  });

  The main process accepts the message without origin or schema validation:

  ipcMain.on('soundcloud:track-update', async (_event, { data: result, reason }) => {
      lastTrackInfo = result;
      settingsManager.getView()?.webContents.send('presence-preview-update', result);
  });

  The settings view runs with Node.js enabled:

  webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
  }

  The track metadata is inserted into HTML using innerHTML:

  activityContent.innerHTML = `
      <div class="activity-name-preview">${trackInfo.title || 'Unknown Track'}</div>
      <div class="activity-details-text-preview">by ${trackInfo.author || 'Unknown
  Artist'}</div>
  `;
  
```

  ## Proof of Concept

  I uploaded a SoundCloud track with the following title:
  
```js
</div><img src=x onerror="require('child_process').exec('touch /tmp/1337')"><div>
```
  

  Then I opened the application normally and played/viewed the track through the
  embedded SoundCloud page.

  The payload executed locally and created this file:

  /tmp/1337

  This proves attacker-controlled SoundCloud metadata can reach a Node-enabled
  Electron context and execute OS commands.

  ## Attack Scenario

  1. Attacker uploads a SoundCloud track with a malicious title.
  2. Victim opens the Electron app normally.
  3. Victim plays or views the attacker-controlled track.
  4. The app reads the malicious track title from the SoundCloud page.
  5. The preload sends the title to the main process through soundcloud:track-update.
  6. The app renders the title with innerHTML inside a privileged BrowserView.
  7. The injected HTML event handler executes with access to require.
  8. The attacker gets local command execution as the victim user.

  ## Impact

  An attacker can execute arbitrary commands on the victim's machine.

  Examples of possible impact:

  - Read local files accessible to the user
  - Execute malware or persistence commands
  - Steal tokens, browser data, SSH keys, or app configuration
  - Modify files
  - Launch external processes

  ## Root Cause

  The vulnerability is caused by three issues chained together:

  1. Remote SoundCloud content can provide untrusted track metadata.
  2. The preload bridge forwards that metadata to privileged app code without
     validation.
  3. The app renders the metadata with innerHTML inside a Node-enabled Electron view.

  ## Recommended Fix

  ### 1. Never render track metadata with innerHTML

  Use safe DOM APIs:

  const title = document.createElement('div');
  title.className = 'activity-name-preview';
  title.textContent = trackInfo.title || 'Unknown Track';

  const author = document.createElement('div');
  author.className = 'activity-details-text-preview';
  author.textContent = `by ${trackInfo.author || 'Unknown Artist'}`;

  ### 2. Disable Node.js in all UI BrowserViews

  Use:

  webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
  }

  ### 3. Validate IPC sender

  Only accept soundcloud:track-update from the expected SoundCloud BrowserView:

  ipcMain.on('soundcloud:track-update', (event, payload) => {
      if (event.sender.id !== contentView.webContents.id) return;
      const url = event.senderFrame?.url || event.sender.getURL();
      if (!url.startsWith('https://soundcloud.com/')) return;

      // validate payload here
  });

  ### 4. Validate and limit metadata

  Reject non-string values, oversized values, non-HTTPS URLs, and unexpected object
  shapes.

  ### 5. Add a strict CSP to local privileged views

  The app should block inline scripts and event handlers where possible.

  ## CWE

  - CWE-79: Improper Neutralization of Input During Web Page Generation
  - CWE-94: Improper Control of Generation of Code
  - CWE-20: Improper Input Validation
  - CWE-862: Missing Authorization / Sender Validation for IPC-style trust boundary

  ## Conclusion

  A real SoundCloud track
  title containing an HTML payload executed locally in the Electron application.
  Because the execution occurs inside a Node-enabled Electron view, the issue
  escalates from HTML injection to local command execution.
