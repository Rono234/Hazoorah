//game.js - Main game logic for the Hazoorah Puzzle game
// =========================
// 🎮 Global Variables
// =========================
let draggedItem = null;
let attemptsLeft = 3;
let correctOrder = [];
let currentPuzzleIndex = 0;

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
    clues: ['The dog is somewhere to the left of the mouse.',
       "The cat sits between the other two animals."] ,

    items: [
      { id: 'cat', img: 'images/cat.png' },
      { id: 'dog', img: 'images/dog.png' },
      { id: 'mouse', img: 'images/mouse.png' }
    ],
    correctOrder: ['dog', 'cat', 'mouse']
  },
  {
    level: 'medium',
    clues: ['The lizard is at the far left and the bird sits between the fish and the rabbit.',
      'The fish stands immediately to the right of the lizard.',
      'The turtle stands immediately to the right of the rabbit, '
    ],
    items: [
      { id: 'bird', img: 'images/bird.png' },
      { id: 'rabbit', img: 'images/rabbit.png' },
      { id: 'turtle', img: 'images/turtle.png' },
      { id: 'fish', img: 'images/fish.png' },
      { id: 'hamster', img: 'images/hamster.png' },
      { id: 'lizard', img: 'images/lizard.png' }
    ],
    correctOrder: ['lizard','fish' ,'bird', 'rabbit', 'turtle','hamster']
  },
  {
    level: 'hard',
    clues: ['The dog stands immediately to the right of the cat, and the mouse stands immediately to the right of the dog.'
      ,'The bird stands immediately left of the fish, and the fish is somewhere to the left of the hamster.',
      'The hamster stands immediately left of the rabbit, and the rabbit stands immediately left of the turtle.'
],
    items: [
      { id: 'cat', img: 'images/cat.png' },
      { id: 'dog', img: 'images/dog.png' },
      { id: 'mouse', img: 'images/mouse.png' },
      { id: 'bird', img: 'images/bird.png' },
      { id: 'fish', img: 'images/fish.png' },
      { id: 'hamster', img: 'images/hamster.png' },
      { id: 'rabbit', img: 'images/rabbit.png' },
      { id: 'turtle', img: 'images/turtle.png' },
      { id: 'lizard', img: 'images/lizard.png' }
    ],
    correctOrder: [
      'cat', 'dog', 'mouse', 'bird', 'fish',
      'hamster', 'rabbit', 'turtle', 'lizard'
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
    'Check box #{index}, it might need #{correct}',
    'I think box #{index} should have #{correct}',
    'Maybe the #{correct} belongs in box #{index}',
    'The item in box #{index} doesn’t look correct - what about #{correct}'
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
      // Play ding sound effect for correct answer, respecting user SFX settings
      if (typeof playSfx === 'function') {
        playSfx('Audio/Sound FX/ding.mp3');
      }
      submitBtn.disabled = hintBtn.disabled = shufBtn.disabled = true;
    } else {
      attemptsLeft--;
      attemptCount.textContent = attemptsLeft;

      if (attemptsLeft > 0) setFeedback('❌ Not quite right! Try again.', 'red');
      else {
        setFeedback('❌ Out of attempts!', 'darkred');
        submitBtn.disabled = hintBtn.disabled = shufBtn.disabled = true;
      }
    }
  };

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

  hintBtn.onclick = () => {
    const userOrder = Array.from(slots).map(slot =>
      slot.firstChild ? slot.firstChild.dataset.color : null
    );
    const hint = getHint(userOrder, correctOrder);
    feedback.textContent = `💡 Hint: ${hint}`;
    feedback.style.color = '#0077cc';
  };

  shufBtn.onclick = () => updatePuzzleDisplay();

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


