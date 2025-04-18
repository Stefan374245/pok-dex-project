/**
 * Toggles the playback of background music or skips to the next track.
 *
 * @param {boolean} [skip=false] - If true, skips to the next track instead of toggling play/pause.
 */
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
  
  /**
   * Initializes the music controls for the application.
   * 
   * This function sets up event listeners for music playback and control:
   * - Plays music on the first click anywhere on the document.
   * - Toggles music playback when the "music-toggle" button is clicked.
   * - Skips to the next track when the "skip-track" button is clicked.
   * - Automatically plays the next track when the current track ends.
   * 
   * Dependencies:
   * - Requires an `AUDIO_backgroundMusic` object to handle audio playback.
   */
  function setupMusicControls() {
    document.addEventListener("click", playMusic, { once: true });
    document.getElementById("music-toggle").addEventListener("click", () => playMusic());
    document.getElementById("skip-track").addEventListener("click", () => playMusic(true));
    AUDIO_backgroundMusic.addEventListener("ended", nextTrack);
  }
  
  /**
   * Advances to the next track in the playlist and starts playing it.
   * Updates the `AUDIO_backgroundMusic` source to the next track in the `soundtracks` array.
   * Loops back to the first track if the end of the playlist is reached.
   */
  function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % soundtracks.length;
    AUDIO_backgroundMusic.src = soundtracks[currentTrackIndex];
    AUDIO_backgroundMusic.play();
  }