// =========================
// ⚙️ Puzzle Generation
// =========================
function generatePuzzle(level, itemsData, order, title, clues, story) {
  initializeGame();
  initHintSystem(level);

  const board = document.getElementById('board');
  const itemsContainer = document.getElementById('items');
  const feedback = document.getElementById('feedback');
  const submitBtn = document.getElementById('submitBtn');
  const hintBtn = document.getElementById('hintBtn');
  const hintBox = document.getElementById('hintBox');
  const clearBtn = document.getElementById('clearBtn');
  const shufBtn = document.getElementById('shufBtn');
  const attemptCount = document.getElementById('attemptCount');
  const storyDiv = document.getElementById('storySentence');
  const cluesContentDiv = document.getElementById('cluesContent');
  const h1 = document.querySelector('h1');
  const cluesDiv = document.getElementById('clues');
  const itemTray = document.getElementById('itemTray');
  const pauseBtn = document.getElementById('pauseBtn');
  let gamePaused = false;

  pauseBtn.disabled = false;

  // pauseBtn.onclick = () => {
  //   if (gamePaused) {
  //       gamePaused = false;
  //       pauseBtn.querySelector('img').src = 'images/pauseBtn.png';
  //       timer = true;
  //       timerInterval = setInterval(stopwatch,1000);
  //       document.querySelector('.overlay')?.remove();
  //       enableButtons();
  //   } else {
  //       gamePaused = true;
  //       pauseBtn.querySelector('img').src = 'images/pauseBtn.png';
  //       timer = false;
  //       clearInterval(timerInterval);
  //       disableButtons();
  //       const overlay = document.createElement('div');
  //       overlay.className = 'overlay';
  //       document.body.appendChild(overlay);
  //   }
  // }

  function enableButtons() {
    ['submitBtn', 'clearBtn', 'hintBtn', 'shufBtn'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.disabled = false;
    })
  }

  function disableButtons() {
    ['submitBtn', 'clearBtn', 'hintBtn', 'shufBtn'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.disabled = true;
    })
  }

  function updateTimerDisplay() {
    const hrStr = hour.toString().padStart(2, '0');
    const minStr = minute.toString().padStart(2, '0');
    const secStr = second.toString().padStart(2, '0');

    document.getElementById('hours').textContent = hrStr;
    document.getElementById('minutes').textContent = minStr;
    document.getElementById('seconds').textContent = secStr;
  }

  function stopwatch() {
    second++;

    if (second == 60) {
      minute++;
      second = 0;
    }

    if (minute == 60) {
      hour++;
      minute = 0;
    }

    updateTimerDisplay();
  }

  board.innerHTML = '';
  itemsContainer.innerHTML = '';
  feedback.textContent = '';
  attemptsLeft = 3;
  attemptCount.textContent = attemptsLeft;
  submitBtn.disabled = false;
  correctOrder = order;
  itemTray.scrollLeft = 0;

  // h1.textContent = title;

  if (storyDiv) {
    storyDiv.innerHTML = story
      ? `<p><strong></strong></p><p style="font-style: italic; margin: 6px 0 12px;">${story}</p>`
      : '<p><strong>Story Sentence:</strong></p>';
  }
  if (cluesContentDiv) {
    cluesContentDiv.innerHTML = `
      <p><strong>Clues:</strong></p>
      <ul>${clues.map(c => `<li>${c}</li>`).join('')}</ul>
    `;
  }

  const gridSizes = { easy: [1, 3], medium: [2, 3], hard: [3, 3] };
  const [rows, cols] = gridSizes[level] || [1, 3];

  board.style.display = 'grid';
  board.style.gridTemplateRows = `repeat(${rows}, 100px)`;
  board.style.gridTemplateColumns = `repeat(${cols}, 100px)`;
  board.style.gap = '10px';

  for (let i = 0; i < rows * cols; i++) {
    const slot = document.createElement('div');
    slot.className = 'slot';
    board.appendChild(slot);
  }

  const shuffledItems = [...itemsData].sort(() => Math.random() - 0.5);
  shuffledItems.forEach(({ id, img }) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';
    itemDiv.draggable = true;
    itemDiv.dataset.color = id;

    const image = document.createElement('img');
    Object.assign(image, {
      src: img,
      alt: id,
      style: 'width: 100%; height: 100%; object-fit: contain;'
    });

    itemDiv.appendChild(image);
    itemsContainer.appendChild(itemDiv);
  });

  const items = document.querySelectorAll('.item');
  const slots = document.querySelectorAll('.slot');

  items.forEach(item => {
    item.addEventListener('dragstart', () => {
      draggedItem = item;
      setTimeout(() => (item.style.display = 'none'), 0);
    });

    item.addEventListener('dragend', () => {
      setTimeout(() => {
        item.style.display = 'flex';
        draggedItem = null;
      }, 0);
    });
  });

  slots.forEach(slot => {
    slot.addEventListener('dragover', e => e.preventDefault());
    slot.addEventListener('drop', e => {
      e.preventDefault();
      if (!draggedItem) return;
      if (slot.firstChild) itemsContainer.appendChild(slot.firstChild);
      slot.appendChild(draggedItem);
    });
  });

  submitBtn.onclick = () => {
    const userOrder = Array.from(slots).map(slot =>
      slot.firstChild ? slot.firstChild.dataset.color : null
    );

    if (userOrder.includes(null)) return setFeedback('⚠️ Fill all slots before submitting!', 'orange');

    if (JSON.stringify(userOrder) === JSON.stringify(correctOrder)) {
      setFeedback('✅ Correct! You solved the puzzle!', 'green');
      if (window.playSfx) {
        window.playSfx('audio/SoundFX/success2.mp3');
      }

      if(timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      submitBtn.disabled = pauseBtn.disabled = clearBtn.disabled = hintBtn.disabled = shufBtn.disabled = true;
      
      const puzzleNumber = currentPuzzleIndex + 1;
      const levelsPerTown = 5;
      const actualTown = Math.ceil(puzzleNumber / levelsPerTown); // 1,2,3
      const levelInTown = puzzleNumber - (actualTown - 1) * levelsPerTown; // 1-5

      showLevelEndMessage(true, { town: actualTown, level: levelInTown }, attemptsLeft);


    } else {
      if(window.playSfx){
        window.playSfx('audio/SoundFX/Bubble.mp3');
      }

      attemptsLeft--;
      attemptCount.textContent = attemptsLeft;

      if (attemptsLeft > 0) {
        setFeedback('❌ Not quite right! Try again.', 'red');
      } else {
        // Play fail sound using playSfx directly
        if (window.playSfx) {
          window.playSfx('audio/SoundFX/failAudio.wav');
        }
        
        if(timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        
        setFeedback('❌ Out of attempts!', 'darkred');
        submitBtn.disabled = pauseBtn.disabled = clearBtn.disabled = hintBtn.disabled = shufBtn.disabled = true;
        
        const currentLevel = currentPuzzleIndex + 1;
        showLevelEndMessage(false, currentLevel, attemptsLeft);
      }
    }
  };

  // Clear Button Logic
  clearBtn.onclick = () => {
    const slots = document.querySelectorAll('.slot');
    const itemContainer = document.getElementById('items');
    slots.forEach(slot => {
      const item = slot.querySelector('.item');
      if (item) itemContainer.appendChild(item);
    });
    feedback.textContent = '';
    hintBox.textContent = '';
  };

  // Hint Button Logic
  hintBtn.onclick = () => {
    const userOrder = Array.from(slots).map(slot =>
      slot.firstChild ? slot.firstChild.dataset.color : null
    );
    const hint = getHint(userOrder, correctOrder);
    feedback.textContent = `💡 Hint: ${hint}`;
    feedback.style.color = '#0077cc';
  };

  // Shuffle Button Logic
  shufBtn.onclick = () => {
    updatePuzzleDisplay();
  };

  function setFeedback(message, color) {
    feedback.textContent = message;
    feedback.style.color = color;
  }
}