//game.js - Main game logic for the Hazoorah Puzzle game
// =========================
// 🎮 Global Variables
// =========================
let draggedItem = null;
let attemptsLeft = 3;
let correctOrder = [];
let currentPuzzleIndex = 0;

let hour = 0;
let minute = 0;
let second = 0;
let timer = false;
let timerInterval = null;

// =========================
// 🧩 Puzzle Data
// =========================

const hintLimits = {
  easy: 1,
  medium: 2,
  hard: 3
};

const puzzles = [
  {
    level: 'easy',
    clues: ['The purple dahlias should be planted far away from the white daisies.',
       "The white daisies are on the left."] ,

    items: [
      { id: 'purple dahlias', img: 'images/purple-dahlias.jpg' },
      { id: 'white daisies', img: 'images/white-daisies.jpg' },
      { id: 'orange hibiscuses', img: 'images/orange-hibiscuses.png' }
    ],
    correctOrder: ['white daisies', 'orange hibiscuses', 'purple dahlias']
  },

  {
    level: 'easy',
    clues: ['The green hydrangeas are not in the second box.',
       "The red roses are next to the yellow tulips.", "The yellow tulips are on the right."] ,

    items: [
      { id: 'green hydrangeas', img: 'images/green-hydrangeas.png' },
      { id: 'red roses', img: 'images/red-roses.jpg' },
      { id: 'yellow tulips', img: 'images/yellow-tulips.png' }
    ],
    correctOrder: ['green hydrangeas', 'red roses', 'yellow tulips']
  },

  {
    level: 'medium',
    clues: ['The colors of the first two boxes combined make the color in the third box.',
      'The red dahlias are furthest away from the blue dahlias.',
      'The white roses are on top of all other types of roses.'
    ],
    items: [
      { id: 'purple roses', img: 'images/purple-roses.png' },
      { id: 'white roses', img: 'images/white-roses.png' },
      { id: 'pink daisies', img: 'images/pink-daisies.jpg' },
      { id: 'orange daisies', img: 'images/orange-daisies.png' },
      { id: 'red dahlias', img: 'images/red-dahlias.png' },
      { id: 'blue dahlias', img: 'images/blue-dahlias.png' }
    ],
    correctOrder: ['red dahlias','white roses' ,'pink daisies', 'orange daisies', 'purple roses','blue dahlias']
  },

  {
    level: 'medium',
    clues: ['The hydrangeas are directly next to each other with the reddish color first.',
      'There are no tulips in the first row.',
      'The black hibiscuses are on the right and diagonally adjacent with the other hibiscuses.', 
      'The green tulips are not on the left.'
    ],
    items: [
      { id: 'pink hydrangeas', img: 'images/pink-hydrangeas.png' },
      { id: 'blue hydrangeas', img: 'images/blue-hydrangeas.jpg' },
      { id: 'black hibiscuses', img: 'images/black-hibiscuses.png' },
      { id: 'yellow hibiscuses', img: 'images/yellow-hibiscuses.jpg' },
      { id: 'orange tulips', img: 'images/orange-tulips.png' },
      { id: 'green tulips', img: 'images/green-tulips.png' }
    ],
    correctOrder: ['pink hydrangeas', 'blue hydrangeas', 'black hibiscuses', 'orange tulips', 'yellow hibiscuses', 'green tulips']
  },

  {
    level: 'hard',
    clues: ['The red roses are in the middle of the grid.',
      'The neighbors of the purple and green hydrangeas are never the roses.',
      'All the roses are near each other on the top left with the black ones away from the corner.',
      'The daisies are never in the corner.',
      'The white hydrangeas are on the corner on the right next to the orange daisies.',
      'The purple hydrangeas are on the bottom right, near the yellow daisies.'
],
    items: [
      { id: 'red roses', img: 'images/red-roses.jpg' },
      { id: 'green hydrangeas', img: 'images/green-hydrangeas.png' },
      { id: 'blue daisies', img: 'images/blue-daisies.jpg' },
      { id: 'gray roses', img: 'images/gray-roses.jpg' },
      { id: 'orange daisies', img: 'images/orange-daisies.png' },
      { id: 'yellow daisies', img: 'images/yellow-daisies.png' },
      { id: 'white hydrangeas', img: 'images/white-hydrangeas.png' },
      { id: 'black roses', img: 'images/black-roses.jpg' },
      { id: 'purple hydrangeas', img: 'images/purple-hydrangeas.png' }
    ],
    correctOrder: [
      'gray roses', 'black roses', 'white hydrangeas', 'blue daisies', 'red roses',
      'orange daisies', 'green hydrangeas', 'yellow daisies', 'purple hydrangeas'
    ]
  }
];

// =========================
// ♻️ Initialize Game
// =========================
function initializeGame() {
  draggedItem = null;
  attemptsLeft = 3;

  const feedback = document.getElementById('feedback');
  const hintBox = document.getElementById('hintBox');
  const attemptCount = document.getElementById('attemptCount');
  const buttons = ['submitBtn', 'hintBtn', 'shufBtn', 'clearBtn'];

  if (feedback) feedback.textContent = '';
  if (hintBox) hintBox.textContent = '';
  if (attemptCount) attemptCount.textContent = attemptsLeft;

  buttons.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.disabled = false;
  });
}

// =========================
// 💡 Hint Function
// =========================

  // Track how many hints the player has used for the current puzzle
let usedHints = 0;
let maxHints = 0;

// function that Initialize the hint system based on the current level.
 
function initHintSystem(level) {
  usedHints = 0;
  maxHints = hintLimits[level] || 1;
}

function getHint(userArray, solutionArray) {
  if (usedHints >= maxHints) {
    return `🚫 No more hints left for this level! (${maxHints} used)`;
  }

  function generatePositionNames(total) {
    const names = [];
    for (let i = 1; i <= total; i++) {
      let suffix = 'th';
      if (i % 10 === 1 && i % 100 !== 11) suffix = 'st';
      else if (i % 10 === 2 && i % 100 !== 12) suffix = 'nd';
      else if (i % 10 === 3 && i % 100 !== 13) suffix = 'rd';
      names.push(`${i}${suffix}`);
    }
    return names;
  }

  const templates = [
    'Check again! The #{index} box might need the #{correct}.',
    'Hmmm... I think the #{index} box should have the #{correct}.',
    'Maybe the #{correct} belong in the #{index} box?',
    'The item in the #{index} box doesn’t look correct. How about the #{correct}?',
    'Something seems off with the #{index} box. Could it be the #{correct}?',
    'If I were you, I would put the #{correct} in the #{index} box.'
  ];

  let misMatchIndex = -1;
  for (let i = 0; i < userArray.length; i++) {
    if (userArray[i] !== solutionArray[i]) {
      misMatchIndex = i;
      break;
    }
  }

  if (misMatchIndex === -1) {
    return "Everything looks good — no hints needed!";
  }

  usedHints++;

  const correct = solutionArray[misMatchIndex];
  const posNames = generatePositionNames(userArray.length);
  const indexLabel = posNames[misMatchIndex];
  const randomHintTemplate = templates[Math.floor(Math.random() * templates.length)];

  return randomHintTemplate
    .replace('#{index}', indexLabel)
    .replace('#{correct}', correct);
}

// =========================
// 🔀 Shuffle Utility
// =========================
function shuffArr(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// =========================
// 🔄 Update Puzzle Display
// =========================
function updatePuzzleDisplay() {
  const slots = document.querySelectorAll('.slot');
  const itemsContainer = document.getElementById('items');

  const slotItems = Array.from(slots).map(slot => slot.firstChild).filter(Boolean);
  const trayItems = Array.from(itemsContainer.children);
  const allItems = [...slotItems, ...trayItems];

  slots.forEach(slot => (slot.innerHTML = ''));
  itemsContainer.innerHTML = '';

  shuffArr(allItems);

  allItems.forEach((item, index) => {
    if (index < slots.length) slots[index].appendChild(item);
    else itemsContainer.appendChild(item);
  });
}

// =========================
// ⚙️ Puzzle Generation
// =========================
function generatePuzzle(level, itemsData, order, title, clues) {
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
  const h1 = document.querySelector('h1');
  const cluesDiv = document.getElementById('clues');
  const itemTray = document.getElementById('itemTray');
  const startTimer = document.getElementById('startTimer');
  const pauseBtn = document.getElementById('pauseBtn'); 

  startTimer.onclick = () => {
    timer = true;
    clearBtn.disabled = false;
    hintBtn.disabled = false;
    shufBtn.disabled = false;
    pauseBtn.disabled = false;

    const overlay = document.querySelector('.overlay');
    if (overlay) {
      overlay.remove();
    }

    if(!timerInterval) {
      timerInterval = setInterval(stopwatch, 1000);
    }
  };

  pauseBtn.onclick = () => {
    timer = false;
    clearBtn.disabled = true;
    hintBtn.disabled = true;
    shufBtn.disabled = true;
    pauseBtn.disabled = true;

    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    if(timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  };

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

  h1.textContent = title;
  cluesDiv.innerHTML = `
    <p><strong>Clues:</strong></p>
    <ul>${clues.map(c => `<li>${c}</li>`).join('')}</ul>
  `;

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
      submitBtn.disabled = pauseBtn.disabled = clearBtn.disabled = hintBtn.disabled = shufBtn.disabled = true;
      if(timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    } else {
      attemptsLeft--;
      attemptCount.textContent = attemptsLeft;

      if (attemptsLeft > 0) setFeedback('❌ Not quite right! Try again.', 'red');
      else {
        setFeedback('❌ Out of attempts!', 'darkred');
        submitBtn.disabled = pauseBtn.disabled = clearBtn.disabled = hintBtn.disabled = shufBtn.disabled = true;
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

// =========================
// 🧭 Navigation
// =========================
function loadPuzzle(index) {
  const logo = document.querySelector('h1 img');
  if (logo) {
    logo.src = 'images/titleLogo.PNG';
    logo.alt = puzzles[index].title || 'Hazoorah';
  }

  const level = document.querySelector('.level');
  if (level) level.textContent = `LEVEL: ${index + 1}`;

  const indicator = document.getElementById('puzzleIndicator');
  if (indicator) indicator.textContent = `Puzzle ${index + 1} of ${puzzles.length}`;

  const puzzle = puzzles[index];
  generatePuzzle(puzzle.level, puzzle.items, puzzle.correctOrder, puzzle.title, puzzle.clues);

  hour = 0;
  minute = 0;
  second = 0;

  const hourElement = document.getElementById('hours');
  const minuteElement = document.getElementById('minutes');
  const secondElement = document.getElementById('seconds');

  if (hourElement) {
    hourElement.textContent = '00';
  }

  if (minuteElement) {
    minuteElement.textContent = '00';
  }

  if (secondElement) {
    secondElement.textContent = '00';
  }

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  document.getElementById('prevBtn').disabled = index === 0;
  document.getElementById('nextBtn').disabled = index === puzzles.length - 1;
}

document.getElementById('prevBtn').addEventListener('click', () => {
  if (currentPuzzleIndex > 0) loadPuzzle(--currentPuzzleIndex);
});

document.getElementById('nextBtn').addEventListener('click', () => {
  if (currentPuzzleIndex < puzzles.length - 1) loadPuzzle(++currentPuzzleIndex);
});

// =========================
// 🚀 Initialize First Puzzle
// =========================
loadPuzzle(currentPuzzleIndex);
