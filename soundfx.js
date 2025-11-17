// 🔊 SFX: Item Pickup
// =========================
// Lightweight helper to respect the Sound toggle and volume stored in localStorage
function getGameSettings() {
  try {
    return JSON.parse(localStorage.getItem('gameSettings') || '{}');
  } catch (_) {
    return {};
  }
}

function playSfx(path) {
  // Prefer live values from the settings UI if present, otherwise fall back to saved settings
  const settings = getGameSettings();
  const liveToggle = document.getElementById('soundToggle');
  const liveVolumeEl = document.getElementById('soundVolume');

  const soundEnabled =
    (liveToggle ? !!liveToggle.checked : (settings.soundEnabled ?? true));

  const rawVol = liveVolumeEl ? liveVolumeEl.value : (settings.soundVolume ?? 100);
  const soundVolume = Math.max(0, Math.min(100, Number(rawVol) || 0)); // clamp 0..100

  if (!soundEnabled) return;
  try {
    const sfx = new Audio(path);
    sfx.volume = Math.max(0, Math.min(1, (Number(soundVolume) || 0) / 100));
    const p = sfx.play();
    if (p && p.catch) p.catch(() => {});
  } catch (_) {
    // ignore errors to avoid breaking gameplay
  }
}
window.playSfx = playSfx;

// Initialize sound effects immediately (don't wait for DOMContentLoaded)
(function initSoundEffects() {

  // 🔊 Play fail sound
  function playFailSound() {
    playSfx('audio/SoundFX/failAudio2.wav');
  }
  window.playFailSound = playFailSound;

  // Play a pickup sound whenever a puzzle item starts being dragged
  const PICKUP_SFX_PATH = 'audio/SoundFX/PickUpItem.mp3';
  document.addEventListener('dragstart', (e) => {
    const item = e.target && (e.target.closest ? e.target.closest('.item') : null);
    if (item) {
      playSfx(PICKUP_SFX_PATH);
    }
  });

  // 🔊 Simple button click SFX — minimal version
  // Plays bubble.mp3 whenever any <button> is pressed/clicked
  // Play on pointerdown so it's audible even if navigation happens on click
  document.addEventListener('pointerdown', (e) => {
    const btn = e.target && e.target.closest ? e.target.closest('button') : null;
    if (!btn) return;
    if (btn.disabled) return;
    if (btn.id === 'submitBtn') return;
    // mark to avoid double-playing again on click
    btn.__sfxLastDown = Date.now();
    playSfx('audio/SoundFX/Bubble.mp3');
  }, { passive: true });

  // Fallback for keyboard activation (Enter/Space fires click)
  document.addEventListener('click', (e) => {
    const btn = e.target && e.target.closest ? e.target.closest('button') : null;
    if (!btn) return;
    if (btn.disabled) return;
    if (btn.id === 'submitBtn') return;
    // if pointerdown already played within the last 800ms, skip
    if (btn.__sfxLastDown && (Date.now() - btn.__sfxLastDown) < 800) return;
    playSfx('audio/SoundFX/Bubble.mp3');
  });
})();