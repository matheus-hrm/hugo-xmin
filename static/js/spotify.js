(function () {
  var widget = document.getElementById('spotify-widget');
  if (!widget) return;

  var endpoint = widget.dataset.endpoint || '/spotify.json';
  var cover = document.getElementById('spotify-album-cover');
  var title = document.getElementById('spotify-title');
  var artist = document.getElementById('spotify-artist');
  var songLink = document.getElementById('spotify-song-link');
  var refreshMs = 29999;

  function setHidden(hidden) {
    widget.hidden = hidden;
  }

  function setText(node, value) {
    node.textContent = value || '';
  }

  function updateWidget(data) {
    if (!data || !data.isPlaying) {
      setHidden(true);
      return;
    }

    var songUrl = data.songUrl || '#';
    var albumImageUrl = data.albumImageUrl || '';

    cover.src = albumImageUrl;
    cover.alt = data.album ? data.album + ' album cover' : 'Album cover';
    title.href = songUrl;
    songLink.href = songUrl;
    setText(title, data.title || 'Unknown track');
    setText(artist, data.artist || 'Unknown artist');
    setHidden(false);
  }

  async function fetchSpotifyData() {
    try {
      var response = await fetch(endpoint, { cache: 'no-store' });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      updateWidget(await response.json());
    } catch (error) {
      console.error('Error fetching spotify data', error);
      setHidden(true);
    }
  }

  fetchSpotifyData();
  window.setInterval(fetchSpotifyData, refreshMs);
})();
