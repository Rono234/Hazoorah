document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const settBtn = document.getElementById('settBtn');
  const dialog = document.getElementById('settingsDialog');
  const closeBtn = document.getElementById('closeSettingsBtn');
  const saveBtn = document.getElementById('saveSettingsBtn');
  const soundToggle = document.getElementById('soundToggle');
  const soundVolume = document.getElementById('soundVolume');
  /* BG MUSIC DISABLED
  const musicToggle = document.getElementById('musicToggle');
  const musicVolume = document.getElementById('musicVolume');
  const enableSoundBtn = document.getElementById('enableSoundBtn');
  const bgAudio = document.getElementById('bgMusic');
  */
  const hintToggle = document.getElementById('hintToggle');
  const timerToggle = document.getElementById('timerToggle');

  if (!dialog || !settBtn) return;

  // Helper: convert 0..100 slider value to 0..1
  const sliderToVolume = v => Math.max(0, Math.min(1, v / 100));

  // Load settings from localStorage
  const loadSettings = () => {
    const settings = JSON.parse(localStorage.getItem('gameSettings') || '{}');
    soundToggle.checked = settings.soundEnabled ?? true;
    soundVolume.value = settings.soundVolume ?? 100;
    soundVolume.disabled = !soundToggle.checked;

    /* BG MUSIC DISABLED
    musicToggle.checked = settings.musicEnabled ?? true;
    musicVolume.value = settings.musicVolume ?? 100;
    musicVolume.disabled = !musicToggle.checked;
    */

    // Default hints OFF until user enables (per requirement)
    if (hintToggle) hintToggle.checked = settings.hintEnabled ?? false;
    applyHintSetting();
    // Default timer ON to preserve current behavior
    if (timerToggle) timerToggle.checked = settings.timerEnabled ?? true;
    applyTimerSetting();
    return settings;
  };

  // Save settings to localStorage
  const saveSettings = () => {
    const prev = JSON.parse(localStorage.getItem('gameSettings') || '{}');
    localStorage.setItem('gameSettings', JSON.stringify({
      ...prev,
      soundEnabled: soundToggle.checked,
      soundVolume: soundVolume.value,
      /* BG MUSIC DISABLED
      musicEnabled: musicToggle.checked,
      musicVolume: musicVolume.value,
      */
      hintEnabled: hintToggle ? hintToggle.checked : false,
      timerEnabled: timerToggle ? timerToggle.checked : true
    }));
    applyHintSetting();
    applyTimerSetting();
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

  /* BG MUSIC DISABLED
  musicToggle.addEventListener('change', () => {
    musicVolume.disabled = !musicToggle.checked;
    if (!musicToggle.checked) {
      bgAudio && bgAudio.pause();
    } else {
      bgAudio && bgAudio.play().catch(() => {});
    }
  });
  */

  // Hint toggle gating
  function applyHintSetting() {
    const hintBtn = document.getElementById('hintBtn');
    if (!hintBtn) return;
    const enabled = hintToggle ? !!hintToggle.checked : (JSON.parse(localStorage.getItem('gameSettings') || '{}').hintEnabled ?? false);
    // Let the game logic decide final state based on timer, attempts, and puzzle status
    window.dispatchEvent(new CustomEvent('settings:hint', { detail: { enabled } }));
  }

  if (hintToggle) {
    hintToggle.addEventListener('change', () => {
      applyHintSetting();
    });
  }

  // Timer toggle show/hide
  function applyTimerSetting() {
    const enabled = timerToggle ? !!timerToggle.checked : (JSON.parse(localStorage.getItem('gameSettings') || '{}').timerEnabled ?? true);
    const stopwatch = document.querySelector('.stopwatch');
    if (stopwatch) stopwatch.style.display = enabled ? '' : 'none';
    // Inform game logic to stop timer/clear overlay if disabled
    window.dispatchEvent(new CustomEvent('settings:timer', { detail: { enabled } }));
  }

  if (timerToggle) {
    timerToggle.addEventListener('change', () => {
      applyTimerSetting();
    });
  }

  // Settings button opens dialog
  settBtn.addEventListener('click', () => {
    openDialog();
    // Dispatch settings opened event to pause timer
    window.dispatchEvent(new CustomEvent('settings:opened'));
    /* BG MUSIC DISABLED
    // Try to play music if enabled when settings opened
    if (musicToggle.checked && bgAudio) {
      bgAudio.play().catch(() => {});
    }
    */
  });

// Music volume slider
/* BG MUSIC DISABLED
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
*/
  // Dialog buttons
  saveBtn.addEventListener('click', () => {
    saveSettings();
    closeDialog();
    // Dispatch settings closed event to resume timer
    window.dispatchEvent(new CustomEvent('settings:closed'));
  });

  closeBtn.addEventListener('click', () => {
    closeDialog();
    // Dispatch settings closed event to resume timer
    window.dispatchEvent(new CustomEvent('settings:closed'));
  });
  
  // Initialize: load settings and try to play music
  loadSettings();

  /* BG MUSIC DISABLED
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
  */

  // Ensure hint gating applies on load (after initial puzzle render).
  applyHintSetting();
  // Ensure timer visibility applies on load
  applyTimerSetting();

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

(function initGlobalSettingsUI() {
  document.addEventListener('DOMContentLoaded', () => {
    ensureSettingsUI();
    wireSettingsEvents();
    restoreSettingsFromStorage();
  });

  function ensureSettingsUI() {
    // Inject settings dialog if missing
    if (!document.getElementById('settingsDialog')) {
      const dialog = document.createElement('dialog');
      dialog.id = 'settingsDialog';
      dialog.innerHTML = `
        <form method="dialog">
          <h3>Settings</h3>
          <div class="settings-content">
            <div class="settings-group">
              <label for="soundToggle">Sound Effects</label>
              <div class="volume-control">
                <input type="checkbox" id="soundToggle">
                <input type="range" id="soundVolume" min="0" max="100" value="100">
              </div>
            </div>
            <!-- BG MUSIC DISABLED
            <div class="settings-group">
              <label for="musicToggle">Background Music</label>
              <div class="volume-control">
                <input type="checkbox" id="musicToggle">
                <input type="range" id="musicVolume" min="0" max="100" value="100">
              </div>
            </div>
            -->
            <div class="settings-group">
              <label for="hintToggle">Hints</label>
              <div class="volume-control">
                <input type="checkbox" id="hintToggle">
              </div>
            </div>
            <div class="settings-group">
              <label for="timerToggle">Timer</label>
              <div class="volume-control">
                <input type="checkbox" id="timerToggle" checked>
              </div>
            </div>
            <h4>*Adjust volume bar after turning audio on</h4>
          </div>
          <div class="dialog-buttons">
            <button type="button" id="saveSettingsBtn">Save</button>
            <button type="button" id="closeSettingsBtn">Close</button>
          </div>
        </form>
      `;
      document.body.appendChild(dialog);
    }

    /* BG MUSIC DISABLED
    // Inject bg music if missing
    if (!document.getElementById('bgMusic')) {
      const audio = document.createElement('audio');
      audio.id = 'bgMusic';
      audio.loop = true;
      audio.preload = 'auto';
      audio.setAttribute('playsinline', '');
      audio.setAttribute('webkit-playsinline', '');
      audio.style.display = 'none';

      const src = document.createElement('source');
      src.src = 'audio/BGMusic/forest.mp3';
      src.type = 'audio/mpeg';
      audio.appendChild(src);

      document.body.appendChild(audio);
    }*/

  }

  function wireSettingsEvents() {
    const dialog = document.getElementById('settingsDialog');
    const settBtn = document.getElementById('settBtn');
    const closeBtn = dialog?.querySelector('#closeSettingsBtn');
    const saveBtn = dialog?.querySelector('#saveSettingsBtn');
    const enableBtn = document.getElementById('enableSoundBtn');

    if (settBtn && dialog) {
      settBtn.addEventListener('click', () => {
        try {
          dialog.showModal();
        } catch {
          // Fallback if <dialog> not supported
          dialog.setAttribute('open', '');
        }
      });
    }
    closeBtn?.addEventListener('click', () => closeDialog(dialog));
    saveBtn?.addEventListener('click', () => {
      saveSettingsToStorage();
      applyAudioSettings();
      closeDialog(dialog);
    });

    /* BG MUSIC DISABLED
    // Optional CTA to kickstart audio on browsers blocking autoplay
    enableBtn?.addEventListener('click', async () => {
      const bg = document.getElementById('bgMusic');
      if (bg) {
        try { await bg.play(); enableBtn.hidden = true; } catch {}
      }
    });
    */

    /* BG MUSIC DISABLED
    // Apply audio settings on page load (after wiring)
    applyAudioSettings();
    */
  }

  function closeDialog(dialog) {
    try { dialog.close(); } catch { dialog.removeAttribute('open'); }
  }

  function saveSettingsToStorage() {
    const prev = JSON.parse(localStorage.getItem('gameSettings') || '{}');
    const settings = {
      ...prev,
      soundEnabled: !!document.getElementById('soundToggle')?.checked,
      soundVolume: Number(document.getElementById('soundVolume')?.value ?? 100),
      /* BG MUSIC DISABLED
      musicEnabled: !!document.getElementById('musicToggle')?.checked,
      musicVolume: Number(document.getElementById('musicVolume')?.value ?? 100),
      */
      hintEnabled: !!document.getElementById('hintToggle')?.checked,
      timerEnabled: !!document.getElementById('timerToggle')?.checked,
    };
    localStorage.setItem('gameSettings', JSON.stringify(settings));
  }

  function restoreSettingsFromStorage() {
    const raw = localStorage.getItem('gameSettings');
    if (!raw) return;
    try {
      const s = JSON.parse(raw);
      setIfPresent('soundToggle', 'checked', s.soundEnabled ?? true);
      setIfPresent('soundVolume', 'value', s.soundVolume ?? 100);
      /* BG MUSIC DISABLED
      setIfPresent('musicToggle', 'checked', s.musicEnabled ?? false);
      setIfPresent('musicVolume', 'value', s.musicVolume ?? 100);
      */
      setIfPresent('hintToggle', 'checked', s.hintEnabled ?? false);
      setIfPresent('timerToggle', 'checked', s.timerEnabled ?? true);
    } catch {}
  }

  function setIfPresent(id, prop, val) {
    const el = document.getElementById(id);
    if (el) el[prop] = val;
  }

  /* BG MUSIC DISABLED
  function applyAudioSettings() {
    const bg = document.getElementById('bgMusic');
    const musicEnabled = !!document.getElementById('musicToggle')?.checked;
    const musicVolume = Number(document.getElementById('musicVolume')?.value ?? 100) / 100;

    if (!bg) return;
    bg.volume = Math.max(0, Math.min(1, musicVolume));

    if (musicEnabled) {
      // Attempt play; user gesture may still be required
      bg.play().catch(() => {
        const enableBtn = document.getElementById('enableSoundBtn');
        if (enableBtn) enableBtn.hidden = false;
      });
    } else {
      bg.pause();
    }
  }*/
 
})();