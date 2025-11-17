(() => {
  const TOWN_INFO = {
    1: {
      name: 'School',
      range: 'Levels 1–5',
      image: 'images/School.png',
      desc: 'Principal Gerold is heading to School Town to open the school for a brand new semester. But when he arrives, everything’s in disarray! Help Principal Gerold get everything ready before the students arrive!'
    },
    2: {
      name: 'Garden',
      range: 'Levels 1–5',
      image: 'images/Garden.png',
      desc: 'Gardener Haroldene’s flowers were destroyed after heavy rain fall, but they can still be saved! Help Haroldene plant the flowers back in the correct spot before it’s too late!'
    },
    3: {
      name: 'Barn',
      range: 'Levels 1–5',
      image: 'images/Barn.PNG',
      desc: 'Farmer Jerrold is getting ready for the growing season, but he has more things than time! Help Jerrold to organize his farm and prepare for planting.'
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    ensureTownIntroDialog();
    wireTownCards();
  });

  function wireTownCards() {
    document.querySelectorAll('.towns-grid .townCard').forEach(card => {
      card.addEventListener('click', (e) => {
        // Intercept and show intro
        e.preventDefault();

        // Play SFX for town selection (uses global playSfx defined in soundfx.js)
        const DEFAULT_TOWN_SFX = 'audio/SoundFX/pen-click-3-411630.mp3';
        const sfxPath = card.getAttribute('data-sfx') || DEFAULT_TOWN_SFX;
        if (window.playSfx) {
          try { window.playSfx(sfxPath); } catch (_) { /* ignore */ }
        }
        
        const url = new URL(card.getAttribute('href'), window.location.href);
        const town = parseInt(url.searchParams.get('town') || card.dataset.town, 10) || 1;
        openTownIntro(town, url.toString());
      });
    });
  }

  function ensureTownIntroDialog() {
    if (document.getElementById('townIntroDialog')) return;

    const dlg = document.createElement('dialog');
    dlg.id = 'townIntroDialog';
    dlg.setAttribute('aria-labelledby', 'townIntroTitle');
    dlg.innerHTML = `
      <form method="dialog" class="town-intro-form">
        <div class="content">
          <img class="town-image" alt="" width="50%" height="50%" style="object-fit: contain; border-radius: 12px;">
          <div class="text">
            <h2 id="townIntroTitle" class="town-title">Town</h2>
            <div class="town-range">Levels</div>
            <p class="town-desc" style="max-width: 540px; line-height: 1.4;"></p>
          </div>
        </div>
        <div class="dialog-buttons" style="margin-top:0px; display:flex; gap:12px; justify-content:flex-end;">
          <button type="button" id="cancelTownBtn">Cancel</button>
          <button type="button" id="startTownBtn">Start Town</button>
        </div>
      </form>
    `;

    // Basic styling
    const style = document.createElement('style');
    style.textContent = `
      #townIntroDialog::backdrop { background: rgba(0,0,0,0.45); }
      #townIntroDialog { border: none; border-radius: 16px; padding: 20px 22px; max-width: 820px; width: calc(100% - 40px); }
      #townIntroDialog .content { display: flex; gap: 16px; align-items: center; }
      #townIntroDialog h2 { margin: 0 0 4px 0; font-family: 'Arial Rounded MT Bold', sans-serif; }
      #townIntroDialog button { font-family: 'Arial Rounded MT Bold', sans-serif; }
    `;
    document.head.appendChild(style);
    document.body.appendChild(dlg);

    const cancelBtn = dlg.querySelector('#cancelTownBtn');
    const startBtn = dlg.querySelector('#startTownBtn');

    cancelBtn.addEventListener('click', () => closeDialog(dlg));
    startBtn.addEventListener('click', () => {
      const target = dlg.dataset.targetHref;
      if (target) window.location.href = target;
    });
  }

  function openTownIntro(town, targetHref) {
    const info = TOWN_INFO[town] || TOWN_INFO[1];
    const dlg = document.getElementById('townIntroDialog');
    dlg.dataset.targetHref = targetHref;

    dlg.classList.remove('town-1', 'town-2', 'town-3');
    dlg.classList.add(`town-${town}`);

    dlg.querySelector('.town-title').textContent = info.name;
    dlg.querySelector('.town-range').textContent = info.range;
    dlg.querySelector('.town-desc').textContent = info.desc;

    const img = dlg.querySelector('.town-image');
    img.src = info.image;
    img.alt = info.name;

    try { dlg.showModal(); } catch { dlg.setAttribute('open', ''); }
  }

  function closeDialog(dlg) {
    try { dlg.close(); } catch { dlg.removeAttribute('open'); }
  }
})();