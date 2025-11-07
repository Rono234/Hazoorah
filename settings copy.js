document.addEventListener('DOMContentLoaded', () => {
    const settBtn = document.getElementById('settBtn');
    const dialog = document.getElementById('settingsDialog');
    const closeBtn = document.getElementById('closeSettingsBtn');
    const saveBtn = document.getElementById('saveSettingsBtn');
    const soundToggle = document.getElementById('soundToggle');
    const soundVolume = document.getElementById('soundVolume');
    const musicToggle = document.getElementById('musicToggle');
    const musicVolume = document.getElementById('musicVolume');
    const enableSoundBtn = document.getElementById('enableSoundBtn');

    if (!dialog || !settBtn) return;

  // Default low volume (percent) used when enabling music or when volume is 0
  const LOW_DEFAULT_VOLUME = 25;

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

    // Save all settings
  const saveSettings = () => {
    const prev = JSON.parse(localStorage.getItem('gameSettings') || '{}');
    const settings = {
      ...prev,
      soundEnabled: soundToggle.checked,
      soundVolume: soundVolume.value,
      musicEnabled: musicToggle.checked,
      musicVolume: musicVolume.value
    };
    localStorage.setItem('gameSettings', JSON.stringify(settings));
  };

  const markAudioConsentGranted = () => {
    const prev = JSON.parse(localStorage.getItem('gameSettings') || '{}');
    prev.audioConsentGranted = true;
    localStorage.setItem('gameSettings', JSON.stringify(prev));
  };

  const showEnableSoundCTA = () => {
    if (enableSoundBtn) enableSoundBtn.hidden = false;
  };

  const hideEnableSoundCTA = () => {
    if (enableSoundBtn) enableSoundBtn.hidden = true;
  };

    // Toggle volume controls based on checkboxes
    soundToggle.addEventListener('change', () => {
        soundVolume.disabled = !soundToggle.checked;
        if (!soundToggle.checked) {
            soundVolume.value = 0;
        } else {
            soundVolume.value = 100;
        }
    });

    musicToggle.addEventListener('change', () => {
        musicVolume.disabled = !musicToggle.checked;
        if (!musicToggle.checked) {
            musicVolume.value = 0;
        } else {
            musicVolume.value = 100;
        }
    });

    // Show dialog when settings button is clicked (with fallback for browsers
    // that don't support HTMLDialogElement.showModal)
    const openDialog = () => {
        loadSettings();
        if (typeof dialog.showModal === 'function') {
            try {
                dialog.showModal();
            } catch (err) {
                // some browsers may throw if already open; fallback below
                dialog.setAttribute('open', '');
                dialog.classList.add('polyfill-open');
                document.body.classList.add('dialog-open');
            }
        } else {
            // simple polyfill: make dialog act as a centered block and add backdrop
            dialog.setAttribute('open', '');
            dialog.classList.add('polyfill-open');
            document.body.classList.add('dialog-open');
        }
    };
    /*settBtn.addEventListener('click', openDialog);*/

    // Handle save button
    saveBtn.addEventListener('click', () => {
        saveSettings();
        // close using native API if available
        if (typeof dialog.close === 'function') {
            dialog.close();
        } else {
            dialog.removeAttribute('open');
            dialog.classList.remove('polyfill-open');
            document.body.classList.remove('dialog-open');
        }
    });

    // Handle close button
    closeBtn.addEventListener('click', () => {
        if (typeof dialog.close === 'function') {
            dialog.close();
        } else {
            dialog.removeAttribute('open');
            dialog.classList.remove('polyfill-open');
            document.body.classList.remove('dialog-open');
        }
    });

    // If browser supports dialog 'cancel' event (Escape key), ensure settings are closed
    dialog.addEventListener && dialog.addEventListener('cancel', (e) => {
        // prevent default to allow our close flow if needed
        // nothing else required here because dialog.close() will run automatically
    });

    // Fallback: close polyfilled dialog on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dialog.hasAttribute('open') && !document.body.classList.contains('dialog-open')) return;
        if (e.key === 'Escape' && dialog.hasAttribute('open') && document.body.classList.contains('dialog-open')) {
            dialog.removeAttribute('open');
            dialog.classList.remove('polyfill-open');
            document.body.classList.remove('dialog-open');
        }
    });

    // Load initial settings
    //loadSettings();

    // after DOMContentLoaded and after you've loaded settings variables:
const bgAudio = document.getElementById('bgMusic');

// helper: convert 0..100 slider value to 0..1
const sliderToVolume = v => Math.max(0, Math.min(1, v / 100));

// apply current settings to the audio element
function applyMusicSettings(settings) {
  if (!bgAudio) return;
  bgAudio.volume = sliderToVolume(settings.musicVolume ?? 100);
  if (settings.musicEnabled) {
    // try to play (may be blocked until a user gesture)
    const p = bgAudio.play();
    if (p && p.catch) p.catch(err => {
      // play blocked (autoplay policy) - OK, we'll play after a gesture
      // optionally show a muted/unmuted UI hint
      console.debug('bgAudio.play() blocked; will wait for user gesture.');
      showEnableSoundCTA();
    });
  } else {
    bgAudio.pause();
    bgAudio.currentTime = 0;
  }
}

// ensure initial apply after loadSettings()
loadSettings();

applyMusicSettings({
  musicEnabled: musicToggle.checked,
  musicVolume: musicVolume.value
});

// Install one-time gesture listeners to attempt playback after user interaction.
// Only uses activation events that browsers recognize for autoplay (click, tap, keypress).
function setupInteractionPlayOnce() {
  if (!bgAudio) return;

  const tryPlay = (eventType) => {
    console.log(`[DEBUG] ${eventType} event fired!`);
    if (!musicToggle.checked) {
      console.log('[DEBUG] Music toggle is unchecked, skipping play.');
      return;
    }
    console.log('Attempting playback from user gesture...');
    const p = bgAudio.play();
    if (p) {
      p.then(() => {
        console.log('Background music started (gesture).');
        hideEnableSoundCTA();
        markAudioConsentGranted();
      }).catch((err) => {
        console.log('Playback still blocked after gesture:', err);
      });
    }
  };

  const opts = { once: true, passive: true };
  window.addEventListener('pointerdown', () => tryPlay('pointerdown'), opts);
  window.addEventListener('touchstart', () => tryPlay('touchstart'), opts);
  window.addEventListener('click', () => tryPlay('click'), opts);
  window.addEventListener('keydown', () => tryPlay('keydown'), opts);
  
  console.log('[DEBUG] Gesture listeners installed (pointerdown, touchstart, click, keydown)');
}

// Try to play music automatically on page load
if (musicToggle.checked && bgAudio) {
  console.log('Attempting to play music on load...');

  // Try to play immediately
  const playPromise = bgAudio.play();
  if (playPromise) {
    playPromise.then(() => {
      console.log('Music started on load.');
      hideEnableSoundCTA();
      markAudioConsentGranted();
    }).catch((error) => {
      console.log('Initial play blocked:', error);
      // autoplay blocked — install gesture listeners
      setupInteractionPlayOnce();
      showEnableSoundCTA();
    });
  }
}

// respond to UI changes
musicToggle.addEventListener('change', () => {
  musicVolume.disabled = !musicToggle.checked;
  if (!musicToggle.checked) {
    bgAudio && bgAudio.pause();
  } else {
    const p = bgAudio && bgAudio.play();
    if (p && p.catch) p.catch(() => {/*still waiting for gesture*/});
  }
});

// Enable Sound button click handler
if (enableSoundBtn) {
  enableSoundBtn.addEventListener('click', () => {
    // ensure music is enabled
    if (!musicToggle.checked) {
      musicToggle.checked = true;
      musicVolume.disabled = false;
    }
    const p = bgAudio && bgAudio.play();
    if (p && p.then) {
      p.then(() => {
        hideEnableSoundCTA();
        markAudioConsentGranted();
      }).catch(err => {
        console.debug('Enable Sound click failed:', err);
      });
    }
  });
}

musicVolume.addEventListener('input', () => {
  if (bgAudio) bgAudio.volume = sliderToVolume(musicVolume.value);
});
// Attempt plays already done above; install a one-time gesture fallback:
function enablePlaybackOnGestureIfNeeded() {
  if (!bgAudio) return;
  const tryPlay = () => {
    const p = bgAudio.play();
    if (p && p.catch) p.catch(() => {/* still blocked, wait more */});
    // remove the event listeners after first gesture
    window.removeEventListener('pointerdown', tryPlay);
    window.removeEventListener('keydown', tryPlay);
  };
  window.addEventListener('pointerdown', tryPlay, { once: true });
  window.addEventListener('keydown', tryPlay, { once: true });
}

settBtn.addEventListener('click', ()=> {
    loadSettings();
    openDialog();
    enablePlaybackOnGestureIfNeeded();
    // Try to play if music is enabled
    if (musicToggle.checked) {
        const p = bgAudio.play();
        if (p && p.catch) p.catch(err => console.debug('Play failed:', err));
    }
});


});//end DOMContentLoaded

//TO ADD AUTOPLAY TO EDGE BROWSER: EDGE SETTINGS > SITE PERMISSIONS > MEDIA AUTOPLAY > ALLOW (OR SPECIFIC SITES)
// FOR GOOOGLE CHROME: GO TO chrome://settings/content/autoplay AND ALLOW SITES TO AUTOMATICALLY PLAY MEDIA 