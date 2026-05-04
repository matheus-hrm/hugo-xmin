---
title: Home
---
<div class="home-profile">
  <img class="home-avatar" src="https://avatars.githubusercontent.com/u/49960367?v=4" alt="Profile photo">
</div>

# blog

hi, im a 22 years old developer, cybersec analyst, computer science student 

<div
  id="spotify-widget"
  class="spotify-widget"
  data-endpoint="https://api.mhrm.dev/spotify"
  hidden
>
  <svg class="spotify-eq" width="24" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="2" width="1.5" height="1.5" rx="0.75" fill="currentColor">
      <animate attributeName="width" values="-1.5;12;1.5" dur="1.2s" repeatCount="indefinite" begin="0s"></animate>
      <animate attributeName="x" values="10;6;12" dur="1.2s" repeatCount="indefinite" begin="0s"></animate>
    </rect>
    <rect x="12" y="6" width="1.5" height="1.5" rx="0.75" fill="currentColor">
      <animate attributeName="width" values="-1.5;12;1.5" dur="1.2s" repeatCount="indefinite" begin="0.2s"></animate>
      <animate attributeName="x" values="10;6;12" dur="1.2s" repeatCount="indefinite" begin="0.2s"></animate>
    </rect>
    <rect x="12" y="10" width="1.5" height="1.5" rx="0.75" fill="currentColor">
      <animate attributeName="width" values="-1.5;12;1.5" dur="1.2s" repeatCount="indefinite" begin="0.4s"></animate>
      <animate attributeName="x" values="10;6;12" dur="1.2s" repeatCount="indefinite" begin="0.4s"></animate>
    </rect>
    <rect x="12" y="14" width="1.5" height="1.5" rx="0.75" fill="currentColor">
      <animate attributeName="width" values="-1.5;12;1.5" dur="1.2s" repeatCount="indefinite" begin="0.6s"></animate>
      <animate attributeName="x" values="10;6;12" dur="1.2s" repeatCount="indefinite" begin="0.6s"></animate>
    </rect>
    <rect x="12" y="18" width="1.5" height="1.5" rx="0.75" fill="currentColor">
      <animate attributeName="width" values="-1.5;12;1.5" dur="1.2s" repeatCount="indefinite" begin="0.8s"></animate>
      <animate attributeName="x" values="10;6;12" dur="1.2s" repeatCount="indefinite" begin="0.8s"></animate>
    </rect>
  </svg>
  <a id="spotify-song-link" class="spotify-cover-link" href="#" aria-label="Open song on Spotify">
    <img id="spotify-album-cover" class="spotify-cover" src="" alt="">
  </a>
  <div class="spotify-track">
    <span class="spotify-label">listening to</span>
    <a id="spotify-title" class="spotify-title" href="#"></a>
    <span id="spotify-artist" class="spotify-artist"></span>
  </div>
</div>

<script src="/js/spotify.js" defer></script>
