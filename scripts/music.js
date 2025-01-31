function playMusic(skip = false) {
    if (skip) {
      nextTrack();
    } else {
      if (AUDIO_backgroundMusic.paused) {
        AUDIO_backgroundMusic.play();
      } else {
        AUDIO_backgroundMusic.pause();
      }
    }
  }
  
  function setupMusicControls() {
    document.addEventListener("click", playMusic, { once: true });
    document.getElementById("music-toggle").addEventListener("click", () => playMusic());
    document.getElementById("skip-track").addEventListener("click", () => playMusic(true));
    AUDIO_backgroundMusic.addEventListener("ended", nextTrack);
  }
  
  function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % soundtracks.length;
    AUDIO_backgroundMusic.src = soundtracks[currentTrackIndex];
    AUDIO_backgroundMusic.play();
  }