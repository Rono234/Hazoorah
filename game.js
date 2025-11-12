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
let timerFeatureEnabled = true; // reflects settings timer toggle
window.levelDialogOpen = false;

const max_levels = 15;
const params = new URLSearchParams(window.location.search);
const currentTown = parseInt(params.get('town')) || 1;
const currentLevel = parseInt(params.get('level')) || 1;

function markTownLevelComplete(town, level) {
  const townProgress = JSON.parse(localStorage.getItem('townProgress') || '{}');

  if (!townProgress[`town${town}`]) {
   townProgress[`town${town}`] = [];
  }

  if (!townProgress[`town${town}`].includes(level)) {
   townProgress[`town${town}`].push(level);
  }

  localStorage.setItem('townProgress', JSON.stringify(townProgress));
}

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
    story: 'All the supplies in the art room are scattered! Gerold needs to place them neatly back on the shelf in the correct order before the students come to class.',
    clues: ['The crayons should be on the far left.',
       "The colored pencils are not next to the crayons."],

    items: [
      { id: 'crayons', img: 'images/purple-dahlias.PNG' },
      { id: 'paint brushes', img: 'images/white-daisies.PNG' },
      { id: 'colored pencils', img: 'images/orange-hibiscuses.PNG' }
    ],
    correctOrder: ['crayons', 'paint brushes', 'colored pencils']
  },

  {
    level: 'easy',
    story: 'Help Gerold set the experiment materials correctly before the science teacher arrives.',
    clues: ['The microscopes should be on the far right.',
       "The beakers are between the other two items."],

    items: [
      { id: 'test tubes', img: 'images/green-hydrangeas.PNG' },
      { id: 'beakers', img: 'images/red-roses.PNG' },
      { id: 'microscopes', img: 'images/yellow-tulips.PNG' }
    ],
    correctOrder: ['test tubes', 'beakers', 'microscopes']
  },

  {
    level: 'medium',
    story: 'When Gerold checks the library, he finds that all the books are misplaced! Help him return them to their proper shelves before the librarian arrives.',
    clues: ['The math books should be before the science books.',
      'The story books are between science and art books.',
      'The geography books belong at the far right.'
    ],
    items: [
      { id: 'math books', img: 'images/purple-roses.PNG' },
      { id: 'science books', img: 'images/white-roses.PNG' },
      { id: 'story books', img: 'images/pink-daisies.PNG' },
      { id: 'art books', img: 'images/orange-daisies.PNG' },
      { id: 'history books', img: 'images/red-dahlias.PNG' },
      { id: 'geography books', img: 'images/blue-dahlias.PNG' }
    ],
    correctOrder: ['math books','science books' ,'story books', 'art books', 'history books','geography books']
  },

  {
    level: 'medium',
    story: 'Gerold opens the supply closet and finds everything mixed up! He needs to organize the school essentials before the teachers get there.',
    clues: ['The chalks are between the erasers and the pieces of paper.',
      'The glues are at the far right.',
      'The notebooks come before the markers.'
    ],
    items: [
      { id: 'erasers', img: 'images/pink-hydrangeas.PNG' },
      { id: 'chalks', img: 'images/blue-hydrangeas.PNG' },
      { id: 'pieces of paper', img: 'images/black-hibiscuses.PNG' },
      { id: 'notebooks', img: 'images/yellow-hibiscuses.PNG' },
      { id: 'markers', img: 'images/orange-tulips.PNG' },
      { id: 'glues', img: 'images/purple-tulips.png' }
    ],
    correctOrder: ['erasers', 'chalks', 'pieces of paper', 'notebooks', 'markers', 'glues']
  },

  {
    level: 'hard',
    story: "Principal Gerold finally reaches the school doors, but they’re locked! The keypad to open them isn’t broken… it's just missing the right code.To open the school and begin the new semester, help him solve the math puzzle that reveals the secret 3×3 code!",
    clues: ["The number in the center of all codes are 5's",
      "The sum of each row, column, and diagonal are the same",
      "The number in the bottom-left of all codes are 8's",
      "The number above the bottom-right corner of all codes are 7's",
      "The bottom-left number is double the top-left number."
    ],

    items: [
      { id: "4's", img: 'images/red-roses.PNG' },
      { id: "9's", img: 'images/green-hydrangeas.PNG' },
      { id: "2's", img: 'images/blue-daisies.PNG' },
      { id: "3's", img: 'images/gray-roses.PNG' },
      { id: "5's", img: 'images/orange-daisies.PNG' },
      { id: "7's", img: 'images/yellow-daisies.PNG' },
      { id: "8's", img: 'images/white-hydrangeas.PNG' },
      { id: "1's", img: 'images/black-roses.PNG' },
      { id: "6's", img: 'images/purple-hydrangeas.PNG' }
    ],
    correctOrder: [
      "4's", "9's", "2's", "3's", "5's",
      "7's", "8's", "1's", "6's"
    ]
  },

  {
    level: 'easy',
    story: "These are some of Haroldene’s rarest flowers. Ease her mind by planting them in order!",
    clues: ['The purple dahlias should be planted far away from the white daisies.',
       "The white daisies are on the left."] ,

    items: [
      { id: 'purple dahlias', img: 'images/purple-dahlias.PNG' },
      { id: 'white daisies', img: 'images/white-daisies.PNG' },
      { id: 'orange hibiscuses', img: 'images/orange-hibiscuses.PNG' }
    ],
    correctOrder: ['white daisies', 'orange hibiscuses', 'purple dahlias']
  },

  {
    level: 'easy',
    story: 'Help Haroldene arrange her favorite flowers!',
    clues: ['The green hydrangeas are not in the second box.',
       "The red roses are next to the yellow tulips.", "The yellow tulips are on the right."] ,

    items: [
      { id: 'green hydrangeas', img: 'images/green-hydrangeas.PNG' },
      { id: 'red roses', img: 'images/red-roses.PNG' },
      { id: 'yellow tulips', img: 'images/yellow-tulips.PNG' }
    ],
    correctOrder: ['green hydrangeas', 'red roses', 'yellow tulips']
  },

  {
    level: 'medium',
    story: 'Roses are red, violets are blue, these flowers are messed up, but at least Haroldene has you!',
    clues: ['The colors of the first two boxes combined make the color in the third box.',
      'The red dahlias are furthest away from the blue dahlias.',
      'The white roses are on top of all other types of roses.'
    ],
    items: [
      { id: 'purple roses', img: 'images/purple-roses.PNG' },
      { id: 'white roses', img: 'images/white-roses.PNG' },
      { id: 'pink daisies', img: 'images/pink-daisies.PNG' },
      { id: 'orange daisies', img: 'images/orange-daisies.PNG' },
      { id: 'red dahlias', img: 'images/red-dahlias.PNG' },
      { id: 'blue dahlias', img: 'images/blue-dahlias.PNG' }
    ],
    correctOrder: ['red dahlias','white roses' ,'pink daisies', 'orange daisies', 'purple roses','blue dahlias']
  },

  {
    level: 'medium',
    story: 'These flowers were gifted to Haroldene by her grandmother. Please help her put them in the correct spots!',
    clues: ['The hydrangeas are directly next to each other with the reddish color first.',
      'There are no tulips in the first row.',
      'The black hibiscuses are on the right and diagonally adjacent with the other hibiscuses.', 
      'The purple tulips are not on the left.'
    ],
    items: [
      { id: 'pink hydrangeas', img: 'images/pink-hydrangeas.PNG' },
      { id: 'blue hydrangeas', img: 'images/blue-hydrangeas.PNG' },
      { id: 'black hibiscuses', img: 'images/black-hibiscuses.PNG' },
      { id: 'yellow hibiscuses', img: 'images/yellow-hibiscuses.PNG' },
      { id: 'orange tulips', img: 'images/orange-tulips.PNG' },
      { id: 'purple tulips', img: 'images/purple-tulips.png' }
    ],
    correctOrder: ['pink hydrangeas', 'blue hydrangeas', 'black hibiscuses', 'orange tulips', 'yellow hibiscuses', 'purple tulips']
  },

  {
    level: 'hard',
    story: 'Oh no..! Midnight is approaching soon, quick, finish arranging the last bit of flowers!',
    clues: ['The red roses are in the middle of the grid.',
      'The neighbors of the purple and green hydrangeas are never the roses.',
      'All the roses are near each other on the top left with the black ones away from the corner.',
      'The daisies are never in the corner.',
      'The white hydrangeas are on the corner on the right next to the orange daisies.',
      'The purple hydrangeas are on the bottom right, near the yellow daisies.'
],
    items: [
      { id: 'red roses', img: 'images/red-roses.PNG' },
      { id: 'green hydrangeas', img: 'images/green-hydrangeas.PNG' },
      { id: 'blue daisies', img: 'images/blue-daisies.PNG' },
      { id: 'gray roses', img: 'images/gray-roses.PNG' },
      { id: 'orange daisies', img: 'images/orange-daisies.PNG' },
      { id: 'yellow daisies', img: 'images/yellow-daisies.PNG' },
      { id: 'white hydrangeas', img: 'images/white-hydrangeas.PNG' },
      { id: 'black roses', img: 'images/black-roses.PNG' },
      { id: 'purple hydrangeas', img: 'images/purple-hydrangeas.PNG' }
    ],
    correctOrder: [
      'gray roses', 'black roses', 'white hydrangeas', 'blue daisies', 'red roses',
      'orange daisies', 'green hydrangeas', 'yellow daisies', 'purple hydrangeas'
    ]
  },

  {
    level: 'easy',
    story:'Jerrold needs to feed his farm animals. Put them in order from first fed to last fed.',
    clues: ['The cows eat after the chicken.',
       "The pigs are always fed last."] ,

    items: [
      { id: 'cows', img: 'images/Cow.PNG' },
      { id: 'pigs', img: 'images/Pig.PNG' },
      { id: 'chickens', img: 'images/Chicken.PNG' }
    ],
    correctOrder: ['chickens', 'cows', 'pigs']
  },

  {
    level: 'easy',
    story:'Jerrold is creating harvest baskets for his friends. Order the veggies from lightest to heaviest basket.',
    clues: ['The carrot basket weighs more than the apples.',
       "The corn basket is not the lightest.", "The apples are lighter than both other baskets."] ,

    items: [
      { id: 'carrots', img: 'images/Carrot.PNG' },
      { id: 'apples', img: 'images/Apple.PNG' },
      { id: 'corns', img: 'images/Corn.PNG' }
    ],
    correctOrder: ['apples', 'carrots', 'corns']
  },

  {
    level: 'medium',
    story:'Jerrold needs to fix his tractor for plowing! Order the parts based on how they fit in the tractor.',
    clues: ['The engine is in the middle of the setup.',
      'The wheel must come before the axle.',
      'The lever is right before the exhaust.',
      'The seat comes immediately after the engine.',
      'The axle and lever are not next to each other.'
    ],
    items: [
      { id: 'wheels', img: 'images/purple-roses.PNG' },
      { id: 'axles', img: 'images/white-roses.PNG' },
      { id: 'engines', img: 'images/pink-daisies.PNG' },
      { id: 'seats', img: 'images/orange-daisies.PNG' },
      { id: 'levers', img: 'images/red-dahlias.PNG' },
      { id: 'exhausts', img: 'images/blue-dahlias.PNG' }
    ],
    correctOrder: ['wheels','axles' ,'engines', 'seats', 'levers','exhausts']
  },

  {
    level: 'medium',
    story:'Jerrold is arranging his sheep for a farm show. Arrange them from left to right based on the clues.',
    clues: ['The yellow sheeps stand between the blue sheeps and the black sheeps.',
      'The brown sheeps are furthest to the right.',
      'The red sheeps are left of the blue sheeps.',
      'The white sheeps are next to the brown sheeps.',
      'The black sheeps are right of the yellow sheeps.'
    ],
    items: [
      { id: 'red sheeps', img: 'images/SheepRed.PNG' },
      { id: 'blue sheeps', img: 'images/SheepBlue.PNG' },
      { id: 'yellow sheeps', img: 'images/SheepYellow.PNG' },
      { id: 'black sheeps', img: 'images/SheepBlack.PNG' },
      { id: 'white sheeps', img: 'images/SheepWhite.PNG' },
      { id: 'brown sheeps', img: 'images/SheepBrown.PNG' }
    ],
    correctOrder: ['red sheeps', 'blue sheeps', 'yellow sheeps', 'black sheeps', 'white sheeps', 'brown sheeps']
  },

  {
    level: 'hard',
    story:'Jerrold is planting his crops on a 3x3 grid. Arrange the crops based on the clues provided.',
    clues: ['The wheats are directly above the rices.',
      'Cabbages grows earlier than the peanuts and wheats.',
      'Peas are planted to the right of the tomatoes.',
      'Potatoes are in the bottom-right corner.',
      'Corn cobs grows below the peanuts.',
      'Beans are right of the wheats.'
],
    items: [
      { id: 'cabbages', img: 'images/Cabbage.PNG' },
      { id: 'tomatoes', img: 'images/Tomatoes.PNG' },
      { id: 'peas', img: 'images/Peas.PNG' },
      { id: 'peanuts', img: 'images/Peanuts.PNG' },
      { id: 'wheats', img: 'images/Wheat.PNG' },
      { id: 'beans', img: 'images/Beans.PNG' },
      { id: 'corn cobs', img: 'images/Corn.PNG' },
      { id: 'rices', img: 'images/Rice.PNG' },
      { id: 'potatoes', img: 'images/Potatoes.PNG' }
    ],
    correctOrder: [
      'cabbages', 'tomatoes', 'peas', 'peanuts', 'wheats',
      'beans', 'corn cobs', 'rices', 'potatoes'
    ]
  }
];

//Read the level from URL parameters
function loadPuzzleURL() {
  const params = new URLSearchParams(window.location.search);
  let urlTown = parseInt(params.get('town'), 10);
  let urlLevel = parseInt(params.get('level'), 10);

  if (isNaN(urlTown)) urlTown = 1;
  if (isNaN(urlLevel)) urlLevel = 1;

  const totalPuzzles = puzzles.length;
  const levelsPerTown = Math.ceil(totalPuzzles / 3);

  const safeTown = Math.max(1, Math.min(urlTown, 3));
  const safeLevel = Math.max (1, Math.min(urlLevel, levelsPerTown));

  currentPuzzleIndex = (safeTown - 1) * levelsPerTown + (safeLevel - 1);

  if (currentPuzzleIndex >= totalPuzzles) {
    currentPuzzleIndex = totalPuzzles - 1;
  }

  if (currentPuzzleIndex < 0 || currentPuzzleIndex >= puzzles.length) {
  currentPuzzleIndex = 0;
  }

  const newURL =  new URL(window.location);
  newURL.searchParams.set('town', safeTown)
  newURL.searchParams.set('level', safeLevel);
  window.history.replaceState({}, '', newURL);

  loadPuzzle(currentPuzzleIndex);
  
  const banner = document.getElementById('banner');
  if (banner) {
    banner.textContent = `LEVEL: ${safeLevel}`;
  }
}

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
  
  // Apply global hint gating (default off until user enables)
  const hintBtn = document.getElementById('hintBtn');
  if (hintBtn) {
    const settings = JSON.parse(localStorage.getItem('gameSettings') || '{}');
    const enabled = settings.hintEnabled ?? false;
    if (!enabled) {
      hintBtn.disabled = true;
      hintBtn.dataset.forceDisabled = 'hint-off';
    } else {
      delete hintBtn.dataset.forceDisabled;
    }
  }

  // Stop any running timer if feature disabled
  if (!timerFeatureEnabled && timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// React to settings changes (e.g., hint toggle) without overriding end-of-puzzle disables
window.addEventListener('settings:hint', (e) => {
  const hintBtn = document.getElementById('hintBtn');
  if (!hintBtn) return;
  // If puzzle already ended or timer paused, don't re-enable.
  const puzzleEnded = hintBtn.disabled && !hintBtn.dataset.forceDisabled && document.getElementById('submitBtn')?.disabled;
  if (puzzleEnded) return;
  const enabled = e.detail.enabled;
  if (enabled) {
    // Only enable if not paused and timer started (clearBtn is proxy for active play)
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn && !clearBtn.disabled) {
      hintBtn.disabled = false;
      delete hintBtn.dataset.forceDisabled;
    }
  } else {
    hintBtn.disabled = true;
    hintBtn.dataset.forceDisabled = 'hint-off';
  }
});

// React to timer feature enable/disable
window.addEventListener('settings:timer', (e) => {
  timerFeatureEnabled = e.detail.enabled;
  const startBtn = document.getElementById('startTimer');
  const pauseBtn = document.getElementById('pauseBtn');
  const hintBtn = document.getElementById('hintBtn');
  if (!timerFeatureEnabled) {
    // Stop timer and reset values
    timer = false;
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    hour = minute = second = 0;
    const h = document.getElementById('hours');
    const m = document.getElementById('minutes');
    const s = document.getElementById('seconds');
    if (h) h.textContent = '00';
    if (m) m.textContent = '00';
    if (s) s.textContent = '00';
    if (startBtn) startBtn.disabled = true;
    if (pauseBtn) pauseBtn.disabled = true;
    // Remove overlay if it was shown via pause
    const overlay = document.querySelector('.overlay');
    if (overlay) overlay.remove();
    // Re-enable non-timer controls if puzzle still active
    const submitBtn = document.getElementById('submitBtn');
    const shufBtn = document.getElementById('shufBtn');
    const clearBtn = document.getElementById('clearBtn');
    if (submitBtn && !submitBtn.disabled) {
      if (shufBtn) shufBtn.disabled = false;
      if (clearBtn) clearBtn.disabled = false;
      // Hint respects its own setting
      const settings = JSON.parse(localStorage.getItem('gameSettings') || '{}');
      const hintEnabled = settings.hintEnabled ?? false;
      if (hintBtn && hintEnabled && !hintBtn.dataset.forceDisabled) hintBtn.disabled = false;
    }
  } else {
    if (startBtn) startBtn.disabled = false;
    if (pauseBtn) pauseBtn.disabled = false;
    // Leave others as-is; they'll be managed on Start/Pause
  }
});

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

function showLevelEndMessage(success, currentLevel, attemptsLeft) {
  const screen = document.getElementById('levelEndDialog');
  const title = document.getElementById('levelEndTitle')
  const message = document.getElementById('levelEndMessage');
  const endBtn = document.getElementById('endBtn');
  const retryBtn = document.getElementById('retryBtn');
  const nextLevelBtn = document.getElementById('nextLevelBtn');

  // if (attemptCount) attemptCount.textContent = attemptsLeft;

  if (!screen) { 
    console.log("❌ Couldn't find #levelEndDialog in HTML");
    return;
  }

  function ordinal(n){
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  const tries = 4 - attemptsLeft;
  const tryTxt = ordinal(tries);
  // const lvl = parseInt(level, 10) || 1;
  // const maxLevel = max_levels

  if (success) {
    title.textContent = '🎉 LEVEL COMPLETE 🎉';
    message.textContent = `Congratulations! You completed the level on your ${tryTxt} try.`;
    markTownLevelComplete(currentTown, currentLevel);

    endBtn.style.display = 'inline-block';
    retryBtn.style.display = "none";

    if (currentPuzzleIndex + 1 >= max_levels) {
      nextLevelBtn.style.display = 'none';
    } else {
      nextLevelBtn.style.display = 'inline-block';
    }
  } else {
    title.textContent = '❌ LEVEL FAILED ❌';
    message.textContent = "Try Again! You ran out of attempts.";

    endBtn.style.display = 'inline-block';
    retryBtn.style.display = 'inline-block';
    nextLevelBtn.style.display = "none";
  }

  try {
    screen.showModal();
  } catch {
    screen.setAttribute('open', '')
  }

  window.levelDialogOpen = true;

  document.querySelectorAll('button').forEach(btn => {
    if (!["endBtn", 'retryBtn', 'nextLevelBtn', 'settBtn'].includes(btn.id)){
      btn.disabled = true;
    }
  });

  retryBtn.onclick = () => {
    screen.close();
    window.levelDialogOpen = false;
    loadPuzzle(currentPuzzleIndex);
  };

  nextLevelBtn.onclick = () => {
    screen.close();
    window.levelDialogOpen = false;

    if (currentPuzzleIndex < puzzles.length - 1) {
      currentPuzzleIndex++;

      const nextTown = Math.floor(currentPuzzleIndex / 5) + 1;
      const nextLevel = (currentPuzzleIndex % 5) + 1;

      //Saving the level Progress
      const nextLevelNum = currentPuzzleIndex + 1;
      const saved = parseInt(localStorage.getItem('lastLevel'), 10) || 0;
      
      if (nextLevelNum > saved) {
        localStorage.setItem('lastLevel', nextLevelNum);
      }

      markTownLevelComplete(nextTown, nextLevel);

      window.location.href = `index.html?town=${nextTown}&level=${nextLevel}`;
    }
  };

  endBtn.onclick = () => {
    screen.close();
    window.levelDialogOpen = false;
    window.location.href = 'levels.html';
  };
}

// =========================
// 🧭 Navigation
// =========================
function loadPuzzle(index) {
  const logo = document.querySelector('.title img');
  if (logo) {
    logo.src = 'images/titleLogo.PNG';
    logo.alt = 'Hazoorah Logo';
  }

  const totalLevels = puzzles.length;
  const town = Math.floor(index / 5) + 1;
  const levelInTown = (index % 5) + 1;

  const indicator = document.getElementById('puzzleIndicator');
  console.log('DEBUG levelInTown:', levelInTown);
  console.log('DEBUG puzzles:', puzzles);
  if (indicator) indicator.textContent = `Puzzle ${levelInTown} of ${puzzles.length / 3}`;

  const puzzle = puzzles[index];
  console.log('puzzles:', puzzles);
  console.log('currentPuzzleIndex:', currentPuzzleIndex);
  console.log('puzzle:', puzzles ? puzzles[currentPuzzleIndex] : 'no puzzles loaded');
  
  if (!puzzle) {
    console.error("❌ Puzzle not found for index:", index);
    return;
  }

  generatePuzzle(puzzle.level, puzzle.items, puzzle.correctOrder, puzzle.title, puzzle.clues, puzzle.story);

  currentPuzzleIndex = index;

  localStorage.setItem('lastLevel', currentPuzzleIndex + 1);

  const newURL = new URL(window.location);
  newURL.searchParams.set('town', town);
  newURL.searchParams.set("level", levelInTown);
  window.history.replaceState({}, "", newURL);

  const banner = document.getElementById('banner');
  if (banner) {
    banner.textContent = `LEVEL: ${levelInTown}`;
  }

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
document.addEventListener('DOMContentLoaded', () => {
  loadPuzzleURL();
});