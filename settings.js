document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const settBtn = document.getElementById('settBtn');
  const dialog = document.getElementById('settingsDialog');
  const closeBtn = document.getElementById('closeSettingsBtn');
  const saveBtn = document.getElementById('saveSettingsBtn');
  const soundToggle = document.getElementById('soundToggle');
  const soundVolume = document.getElementById('soundVolume');
  const musicToggle = document.getElementById('musicToggle');
  const musicVolume = document.getElementById('musicVolume');
  const enableSoundBtn = document.getElementById('enableSoundBtn');
  const bgAudio = document.getElementById('bgMusic');

  if (!dialog || !settBtn) return;

  // Helper: convert 0..100 slider value to 0..1
  const sliderToVolume = v => Math.max(0, Math.min(1, v / 100));

  // Load settings from localStorage
  const loadSettings = () => {
    const settings = JSON.parse(localStorage.getItem('gameSettings') || '{}');
    soundToggle.checked = settings.soundEnabled ?? true;
    soundVolume.value = settings.soundVolume ?? 100;
    soundVolume.disabled = !soundToggle.checked;
    musicToggle.checked = settings.musicEnabled ?? true;
    musicVolume.value = settings.musicVolume ?? 100;
    musicVolume.disabled = !musicToggle.checked;
    return settings;
  };

  // Save settings to localStorage
  const saveSettings = () => {
    const prev = JSON.parse(localStorage.getItem('gameSettings') || '{}');
    localStorage.setItem('gameSettings', JSON.stringify({
      ...prev,
      soundEnabled: soundToggle.checked,
      soundVolume: soundVolume.value,
      musicEnabled: musicToggle.checked,
      musicVolume: musicVolume.value
    }));
  };

  // Enable Sound CTA helpers
  const showEnableSoundCTA = () => enableSoundBtn && (enableSoundBtn.hidden = false);
  const hideEnableSoundCTA = () => enableSoundBtn && (enableSoundBtn.hidden = true);

  // Dialog open/close
  const openDialog = () => {
    loadSettings();
    if (typeof dialog.showModal === 'function') {
      try {
        dialog.showModal();
      } catch {
        dialog.setAttribute('open', '');
      }
    } else {
      dialog.setAttribute('open', '');
    }
  };

  const closeDialog = () => {
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
  };

  // Toggle volume slider enable/disable
  soundToggle.addEventListener('change', () => {
    soundVolume.disabled = !soundToggle.checked;
  });

  musicToggle.addEventListener('change', () => {
    musicVolume.disabled = !musicToggle.checked;
    if (!musicToggle.checked) {
      bgAudio && bgAudio.pause();
    } else {
      bgAudio && bgAudio.play().catch(() => {});
    }
  });

  // Dialog buttons
  saveBtn.addEventListener('click', () => {
    saveSettings();
    closeDialog();
  });

  closeBtn.addEventListener('click', closeDialog);

  // Settings button opens dialog
  settBtn.addEventListener('click', () => {
    openDialog();
    // Try to play music if enabled when settings opened
    if (musicToggle.checked && bgAudio) {
      bgAudio.play().catch(() => {});
    }
  });

  // Music volume slider
  musicVolume.addEventListener('input', () => {
    if (bgAudio) bgAudio.volume = sliderToVolume(musicVolume.value);
  });

  // Enable Sound button handler
  if (enableSoundBtn) {
    enableSoundBtn.addEventListener('click', () => {
      if (!musicToggle.checked) {
        musicToggle.checked = true;
        musicVolume.disabled = false;
      }
      bgAudio && bgAudio.play().then(() => {
        hideEnableSoundCTA();
      }).catch(() => {});
    });
  }

  // Initialize: load settings and try to play music
  loadSettings();
  if (bgAudio && musicToggle.checked) {
    bgAudio.volume = sliderToVolume(musicVolume.value);
    bgAudio.play().then(() => {
      hideEnableSoundCTA();
    }).catch(() => {
      // Autoplay blocked - show Enable Sound button and install fallback
      showEnableSoundCTA();
      installGestureFallback();
    });
  }

  // Install one-time gesture fallback to play music on any user interaction
  function installGestureFallback() {
    const tryPlay = () => {
      if (musicToggle.checked && bgAudio) {
        bgAudio.play().then(() => {
          hideEnableSoundCTA();
        }).catch(() => {});
      }
    };
    const opts = { once: true, passive: true };
    window.addEventListener('click', tryPlay, opts);
    window.addEventListener('keydown', tryPlay, opts);
    window.addEventListener('touchstart', tryPlay, opts);
    window.addEventListener('dragstart', tryPlay, opts);
  }

});//end DOMContentLoaded

//TO ADD AUTOPLAY TO EDGE BROWSER: EDGE SETTINGS > SITE PERMISSIONS > MEDIA AUTOPLAY > ALLOW (OR SPECIFIC SITES)
// FOR GOOOGLE CHROME: GO TO chrome://settings/content/autoplay AND ALLOW SITES TO AUTOMATICALLY PLAY MEDIA 