// game.js

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
const puzzles = [
  {
    level: 'easy',
    // title: 'Level 1 - level title',
    clues: ['clues will go here', 'commas will separate them'],
    items: [
      { id: 'cat', img: 'images/cat.png' },
      { id: 'dog', img: 'images/dog.png' },
      { id: 'mouse', img: 'images/mouse.png' }
    ],
    correctOrder: ['dog', 'mouse', 'cat']
  },
  {
    level: 'medium',
    // title: 'Level 2',
    clues: ['clues will go here', 'commas will separate them'],
    items: [
      { id: 'bird', img: 'images/bird.png' },
      { id: 'rabbit', img: 'images/rabbit.png' },
      { id: 'turtle', img: 'images/turtle.png' },
      { id: 'fish', img: 'images/fish.png' },
      { id: 'hamster', img: 'images/hamster.png' },
      { id: 'lizard', img: 'images/lizard.png' }
    ],
    correctOrder: ['bird', 'rabbit', 'turtle', 'fish', 'hamster', 'lizard']
  },
  {
    level: 'hard',
    // title: 'Level 3',
    clues: ['clues will go here', 'commas will separate them'],
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
    correctOrder: ['cat', 'dog', 'mouse', 'bird', 'fish', 'hamster', 'rabbit', 'turtle', 'lizard']
  }
];

function getHint(userArray , solutionArray){

    // Function to generate the position name based on the puzzle size 
    function generatePositionNames(totalBoxes) {
    const posNames = [];

    for (let i = 1; i <= totalBoxes; i++) {
        let suffix = "th";

        // handle exceptions for 1st, 2nd, 3rd 
        if (i % 10 === 1 && i % 100 !== 11) suffix = "st";
        else if (i % 10 === 2 && i % 100 !== 12) suffix = "nd";
        else if (i % 10 === 3 && i % 100 !== 13) suffix = "rd";

        posNames.push(`${i}${suffix}`);
    }

    return posNames;
    }
    
    const templates  = [
        "Hmm... something seems off with box #{index}" , 
        "Take another look at the #{index} position - it doesn't seems right" ,
        "Maybe the #{correct} belongs in box #{index}",
        "The item in box #{index} doesn't look correct - what about #{correct}"
    ];
    
    // find the first mismatch 
    let misMatchIndex = -1 ; 

    for (let i = 0 ; i < userArray.length ; i++){
        if (userArray[i] !== solutionArray[i] ) {
            misMatchIndex = i ;
            break ; 
        }
    }

    const correct = solutionArray[misMatchIndex];
    const posNames = generatePositionNames(userArray.length)
    const indexLabel = posNames[misMatchIndex];

    const randomHintTemplate = templates[ Math.floor(Math.random() * templates.length)]

    return randomHintTemplate
    .replace("#{index}", indexLabel)
    .replace("#{correct}", correct);  
}

//Logic for shuffle button

//Fisher-yates shuffle algorithm (can be used by other files)
function shuffArr(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function updatePuzzleDisplay() {
  const slots = document.querySelectorAll('.slot');
  const itemsContainer = document.getElementById('items');
  
  
  // Get all items currently in slots
  const slotItems = Array.from(slots)
    .map(slot => slot.firstChild)
    .filter(item => item !== null);
  
  // Get all items in the tray
  const trayItems = Array.from(itemsContainer.children);
  
  // Combine all items
  const allItems = [...slotItems, ...trayItems];
  
  // Clear all slots and items container
  slots.forEach(slot => slot.innerHTML = '');
  itemsContainer.innerHTML = '';
  
  // Shuffle all items
  shuffArr(allItems);
  
  // Redistribute items - first to slots, then remaining to tray
  allItems.forEach((item, index) => {
    if (index < slots.length) {
      slots[index].appendChild(item);
    } else {
      itemsContainer.appendChild(item);
    }
  });
}

// =========================
// ⚙️ Puzzle Generation
// =========================
function generatePuzzle(level, itemsData, order, title, clues) {
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

  // --- Reset UI ---
  board.innerHTML = '';
  itemsContainer.innerHTML = '';
  feedback.textContent = '';
  attemptsLeft = 3;
  attemptCount.textContent = attemptsLeft;
  submitBtn.disabled = false;
  correctOrder = order;
  itemTray.scrollLeft = 0;

  // --- Update Title and Clues ---
  h1.textContent = title;
  cluesDiv.innerHTML = `
    <p><strong>Clues:</strong></p>
    <ul>${clues.map(c => `<li>${c}</li>`).join('')}</ul>
  `;

  // --- Grid Layout ---
  const gridSizes = { easy: [1, 3], medium: [2, 3], hard: [3, 3] };
  const [rows, cols] = gridSizes[level] || [1, 3];

  board.style.display = 'grid';
  board.style.gridTemplateRows = `repeat(${rows}, 100px)`;
  board.style.gridTemplateColumns = `repeat(${cols}, 100px)`;
  board.style.gap = '10px';

  // --- Create Slots ---
  for (let i = 0; i < rows * cols; i++) {
    const slot = document.createElement('div');
    slot.className = 'slot';
    board.appendChild(slot);
  }

  // --- Create Items (shuffled) ---
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

  // --- Drag and Drop Logic ---
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

      // Swap item if slot is occupied
      if (slot.firstChild) itemsContainer.appendChild(slot.firstChild);
      slot.appendChild(draggedItem);
    });
  });

  // --- Submit Button Logic ---
  submitBtn.onclick = () => {
    const userOrder = Array.from(slots).map(slot =>
      slot.firstChild ? slot.firstChild.dataset.color : null
    );

    if (userOrder.includes(null)) {
      setFeedback("⚠️ Fill all slots before submitting!", "orange");
      return;
    }

    if (JSON.stringify(userOrder) === JSON.stringify(correctOrder)) {
      setFeedback("✅ Correct! You solved the puzzle!", "green");
      submitBtn.disabled = true;
    } else {
      attemptsLeft--;
      attemptCount.textContent = attemptsLeft;

      if (attemptsLeft > 0) {
        setFeedback("❌ Not quite right! Try again.", "red");
      } else {
        setFeedback("❌ Out of attempts!", "darkred");
        submitBtn.disabled = true;
      }

      if (attemptsLeft === 0) submitBtn.disabled = true; hintBtn.disabled = true; shufBtn.disabled = true;
    }
  };

  clearBtn.onclick = () => {
    const slots = document.querySelectorAll(".slot");
    const itemContainer = document.getElementById("items");
    slots.forEach(slot => {
        const item = slot.querySelector(".item");
        if (item) {
            item.style.display = "flex";
            itemContainer.appendChild(item);
        }
    });
    feedback.textContent = "";
    hintBox.textContent = "";
  };

  hintBtn.onclick = () => {
    const userOrder = Array.from(slots).map(slot =>
        slot.firstChild ? slot.firstChild.dataset.color : null
    );

    const hint = getHint(userOrder, correctOrder);
    feedback.textContent = `💡 Hint: ${hint}`;
    feedback.style.color = "#0077cc";
  };

  shufBtn.onclick = () => {
    updatePuzzleDisplay();
  };

  // Helper function for feedback
  function setFeedback(message, color) {
    feedback.textContent = message;
    feedback.style.color = color;
  }
}

// =========================
// 🧭 Navigation
// =========================
function loadPuzzle(index) {
    const logo = document.querySelector('h1 img')
    if (logo) {
        logo.src = 'images/titleLogo.PNG';
        logo.alt = puzzles[index].title || 'Hazoorah';
    }

    const level = document.querySelector('.level');
    if (level) level.textContent = `LEVEL: ${index+1}`;

    const indicator = document.getElementById('puzzleIndicator');
    if (indicator) indicator.textContent = `Puzzle ${index + 1} of ${puzzles.length}`;

    const puzzle = puzzles[index];
    generatePuzzle(
    puzzle.level,
    puzzle.items,
    puzzle.correctOrder,
    puzzle.title,
    puzzle.clues
    );

    document.getElementById('puzzleIndicator').textContent =
    `Puzzle ${index + 1} of ${puzzles.length}`;

    document.getElementById('prevBtn').disabled = index === 0;
    document.getElementById('nextBtn').disabled = index === puzzles.length - 1;
    }

    // --- Navigation Buttons ---
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