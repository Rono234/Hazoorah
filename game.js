//================================================================================
// 🎮 HAZOORAH PUZZLE GAME - Main Game Logic
//================================================================================
// This file manages the core gameplay mechanics including puzzle loading,
// drag-and-drop interactions, hints, timer, attempts, and level progression.
//================================================================================

//================================================================================
// 📦 GLOBAL STATE VARIABLES
//================================================================================
// Core game state that persists across puzzle interactions
//================================================================================

// Drag & Drop State
let draggedItem = null;

// Attempts System
let attemptsLeft = 3;

// Puzzle Data
let correctOrder = [];
let currentPuzzleIndex = 0;

// Timer System
let hour = 0;
let minute = 0;
let second = 0;
let timer = false;
let timerInterval = null;
let timerFeatureEnabled = true; // Reflects settings timer toggle

// UI State
window.levelDialogOpen = false;

// Configuration
const max_levels = 15;

// URL Parameters
const params = new URLSearchParams(window.location.search);
const currentTown = parseInt(params.get('town')) || 1;
const currentLevel = parseInt(params.get('level')) || 1;

//================================================================================
// 💾 LOCAL STORAGE & PROGRESS TRACKING
//================================================================================
// Manages player progress persistence across sessions
//================================================================================

/**
 * Marks a specific level as complete in localStorage
 * @param {number} town - Town number (1-3)
 * @param {number} level - Level number within the town
 */
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

//================================================================================
// 🔗 URL PARAMETER HANDLING
//================================================================================
// Loads puzzle based on URL parameters (town & level)
//================================================================================

/**
 * Reads town and level from URL, validates them, and loads the appropriate puzzle
 * Updates URL if parameters are invalid
 */
function loadPuzzleURL() {
  const params = new URLSearchParams(window.location.search);
  let urlTown = parseInt(params.get('town'), 10);
  let urlLevel = parseInt(params.get('level'), 10);

  // Default to town 1, level 1 if invalid
  if (isNaN(urlTown)) urlTown = 1;
  if (isNaN(urlLevel)) urlLevel = 1;

  // Calculate puzzle distribution
  const totalPuzzles = puzzles.length;
  const levelsPerTown = Math.ceil(totalPuzzles / 3);

  // Validate and clamp values
  const safeTown = Math.max(1, Math.min(urlTown, 3));
  const safeLevel = Math.max(1, Math.min(urlLevel, levelsPerTown));

  // Calculate puzzle index
  currentPuzzleIndex = (safeTown - 1) * levelsPerTown + (safeLevel - 1);

  // Boundary checks
  if (currentPuzzleIndex >= totalPuzzles) {
    currentPuzzleIndex = totalPuzzles - 1;
  }

  if (currentPuzzleIndex < 0 || currentPuzzleIndex >= puzzles.length) {
    currentPuzzleIndex = 0;
  }

  // Update URL with validated parameters
  const newURL = new URL(window.location);
  newURL.searchParams.set('town', safeTown);
  newURL.searchParams.set('level', safeLevel);
  window.history.replaceState({}, '', newURL);

  // Load the puzzle
  loadPuzzle(currentPuzzleIndex);
  
  // Update UI banner
  const banner = document.getElementById('banner');
  if (banner) {
    banner.textContent = `LEVEL: ${safeLevel}`;
  }
}

//================================================================================
// 🎬 GAME INITIALIZATION
//================================================================================
// Resets game state and UI for a fresh puzzle attempt
//================================================================================

/**
 * Initializes/resets the game state for a new puzzle attempt
 * Resets attempts, feedback, buttons, and applies settings
 */
function initializeGame() {
  // Reset drag state
  draggedItem = null;
  
  // Reset attempts
  attemptsLeft = 3;

  // Get UI elements
  const feedback = document.getElementById('feedback');
  const hintBox = document.getElementById('hintBox');
  const attemptCount = document.getElementById('attemptCount');
  const buttons = ['submitBtn', 'hintBtn', 'shufBtn', 'clearBtn'];

  // Clear feedback messages
  if (feedback) feedback.textContent = '';
  if (hintBox) hintBox.textContent = '';
  if (attemptCount) attemptCount.textContent = attemptsLeft;

  // Enable all game buttons
  buttons.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.disabled = false;
  });
  
  // Apply hint setting from localStorage
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

  // Stop timer if feature is disabled
  if (!timerFeatureEnabled && timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

//================================================================================
// ⚙️ SETTINGS EVENT HANDLERS
//================================================================================
// Responds to changes in game settings (hint toggle, timer toggle)
//================================================================================

/**
 * Pauses timer when settings dialog opens
 */
window.addEventListener('settings:opened', () => {
  if (timerFeatureEnabled && timer) {
    timer = false;
  }
});

/**
 * Resumes timer when settings dialog closes (if timer feature is enabled)
 * Only resume if not paused via pause button
 */
window.addEventListener('settings:closed', () => {
  // Only resume if pause dialog is not open
  const pauseDialogOpen = pauseDialog && pauseDialog.open;
  if (timerFeatureEnabled && timerInterval && !timer && !pauseDialogOpen) {
    timer = true;
  }
});

/**
 * Handles hint feature enable/disable from settings
 * Respects puzzle end state and timer pause state
 */
window.addEventListener('settings:hint', (e) => {
  const hintBtn = document.getElementById('hintBtn');
  if (!hintBtn) return;
  
  // Don't re-enable if puzzle has ended
  const puzzleEnded = hintBtn.disabled && !hintBtn.dataset.forceDisabled && document.getElementById('submitBtn')?.disabled;
  if (puzzleEnded) return;
  
  const enabled = e.detail.enabled;
  if (enabled) {
    // Only enable if puzzle is actively being played
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

/**
 * Handles timer feature enable/disable from settings
 * Stops timer, resets display, manages UI states
 */
window.addEventListener('settings:timer', (e) => {
  timerFeatureEnabled = e.detail.enabled;
  const pauseBtn = document.getElementById('pauseBtn');
  const hintBtn = document.getElementById('hintBtn');
  
  if (!timerFeatureEnabled) {
    // Stop and reset timer
    timer = false;
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    hour = minute = second = 0;
    
    // Reset timer display
    const h = document.getElementById('hours');
    const m = document.getElementById('minutes');
    const s = document.getElementById('seconds');
    if (h) h.textContent = '00';
    if (m) m.textContent = '00';
    if (s) s.textContent = '00';
    
    // Disable pause button
    if (pauseBtn) pauseBtn.disabled = true;
    
    // Remove pause overlay
    const overlay = document.querySelector('.overlay');
    if (overlay) overlay.remove();
    
    // Re-enable game controls if puzzle is still active
    const submitBtn = document.getElementById('submitBtn');
    const shufBtn = document.getElementById('shufBtn');
    const clearBtn = document.getElementById('clearBtn');
    if (submitBtn && !submitBtn.disabled) {
      if (shufBtn) shufBtn.disabled = false;
      if (clearBtn) clearBtn.disabled = false;
      
      // Respect hint setting
      const settings = JSON.parse(localStorage.getItem('gameSettings') || '{}');
      const hintEnabled = settings.hintEnabled ?? false;
      if (hintBtn && hintEnabled && !hintBtn.dataset.forceDisabled) {
        hintBtn.disabled = false;
      }
    }
  } else {
    // Enable pause button
    if (pauseBtn) pauseBtn.disabled = false;
  }
});

//================================================================================
// 💡 HINT SYSTEM
//================================================================================
// Provides contextual hints based on player's current arrangement
//================================================================================

// Hint tracking variables
let usedHints = 0;
let maxHints = 0;

/**
 * Initializes hint system for the current level
 * @param {number} level - Current level number
 */
function initHintSystem(level) {
  usedHints = 0;
  maxHints = hintLimits[level] || 1;
}

/**
 * Generates a helpful hint by comparing user's arrangement to solution
 * @param {Array} userArray - Current player arrangement
 * @param {Array} solutionArray - Correct arrangement
 * @returns {string} Hint message
 */
function getHint(userArray, solutionArray) {
  // Check if hints are exhausted
  if (usedHints >= maxHints) {
    return `🚫 No more hints left for this level! (${maxHints} used)`;
  }

  /**
   * Generates ordinal position names (1st, 2nd, 3rd, etc.)
   */
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

  // Hint message templates
  const templates = [
    'Check again! The #{index} box might need the #{correct}.',
    'Hmmm... I think the #{index} box should have the #{correct}.',
    'Maybe the #{correct} belong in the #{index} box?',
    'The item in the #{index} box doesn’t look correct. How about the #{correct}?',
    'Something seems off with the #{index} box. Could it be the #{correct}?',
    'If I were you, I would put the #{correct} in the #{index} box.'
  ];

  // Find first mismatch
  let misMatchIndex = -1;
  for (let i = 0; i < userArray.length; i++) {
    if (userArray[i] !== solutionArray[i]) {
      misMatchIndex = i;
      break;
    }
  }

  // No errors found
  if (misMatchIndex === -1) {
    return "Everything looks good — no hints needed!";
  }

  // Increment hint counter
  usedHints++;

  // Generate hint message
  const correct = solutionArray[misMatchIndex];
  const posNames = generatePositionNames(userArray.length);
  const indexLabel = posNames[misMatchIndex];
  const randomHintTemplate = templates[Math.floor(Math.random() * templates.length)];

  return randomHintTemplate
    .replace('#{index}', indexLabel)
    .replace('#{correct}', correct);
}

//================================================================================
// 🔀 UTILITY FUNCTIONS
//================================================================================
// Helper functions for array manipulation and randomization
//================================================================================

/**
 * Fisher-Yates shuffle algorithm
 * @param {Array} arr - Array to shuffle
 * @returns {Array} Shuffled array
 */
function shuffArr(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

//================================================================================
// 🔄 PUZZLE DISPLAY UPDATE
//================================================================================
// Shuffles and redistributes puzzle items between slots and tray
//================================================================================

/**
 * Collects all puzzle items and randomly redistributes them
 * between answer slots and the item tray
 */
function updatePuzzleDisplay() {
  const slots = document.querySelectorAll('.slot');
  const itemsContainer = document.getElementById('items');

  // Collect all items from slots and tray
  const slotItems = Array.from(slots).map(slot => slot.firstChild).filter(Boolean);
  const trayItems = Array.from(itemsContainer.children);
  const allItems = [...slotItems, ...trayItems];

  // Clear current positions
  slots.forEach(slot => (slot.innerHTML = ''));
  itemsContainer.innerHTML = '';

  // Shuffle items
  shuffArr(allItems);

  // Redistribute: fill slots first, rest go to tray
  allItems.forEach((item, index) => {
    if (index < slots.length) slots[index].appendChild(item);
    else itemsContainer.appendChild(item);
  });
}

//================================================================================
// 🏆 LEVEL END DIALOG
//================================================================================
// Displays success/failure modal with appropriate options
//================================================================================

/**
 * Shows level completion or failure dialog
 * @param {boolean} success - Whether level was completed successfully
 * @param {number} currentLevel - Current level number
 * @param {number} attemptsLeft - Remaining attempts
 */
function showLevelEndMessage(success, currentLevel, attemptsLeft) {
  const screen = document.getElementById('levelEndDialog');
  const title = document.getElementById('levelEndTitle');
  const message = document.getElementById('levelEndMessage');
  const endBtn = document.getElementById('endBtn');
  const retryBtn = document.getElementById('retryBtn');
  const nextLevelBtn = document.getElementById('nextLevelBtn');

  if (!screen) { 
    console.log("❌ Couldn't find #levelEndDialog in HTML");
    return;
  }

  /**
   * Converts number to ordinal string (1st, 2nd, 3rd, etc.)
   */
  function ordinal(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  const tries = 4 - attemptsLeft;
  const tryTxt = ordinal(tries);

  if (success) {
    // Success state
    title.textContent = '🎉 LEVEL COMPLETE 🎉';
    message.textContent = `Congratulations! You completed the level on your ${tryTxt} try.`;
    markTownLevelComplete(currentTown, currentLevel);

    endBtn.style.display = 'inline-block';
    retryBtn.style.display = "none";

    // Hide next button if at max level
    if (currentPuzzleIndex + 1 >= max_levels) {
      nextLevelBtn.style.display = 'none';
    } else {
      nextLevelBtn.style.display = 'inline-block';
    }
  } else {
    // Failure state
    title.textContent = '❌ LEVEL FAILED ❌';
    message.textContent = "Try Again! You ran out of attempts.";

    endBtn.style.display = 'inline-block';
    retryBtn.style.display = 'inline-block';
    nextLevelBtn.style.display = "none";
  }

  // Show modal
  try {
    screen.showModal();
  } catch {
    screen.setAttribute('open', '');
  }

  window.levelDialogOpen = true;

  // Disable all game buttons except dialog buttons
  document.querySelectorAll('button').forEach(btn => {
    if (!["endBtn", 'retryBtn', 'nextLevelBtn', 'settBtn'].includes(btn.id)) {
      btn.disabled = true;
    }
  });

  // Retry button: reload current puzzle
  retryBtn.onclick = () => {
    screen.close();
    window.levelDialogOpen = false;
    loadPuzzle(currentPuzzleIndex);
  };

  // Next level button: advance to next puzzle
  nextLevelBtn.onclick = () => {
    screen.close();
    window.levelDialogOpen = false;

    if (currentPuzzleIndex < puzzles.length - 1) {
      currentPuzzleIndex++;

      const nextTown = Math.floor(currentPuzzleIndex / 5) + 1;
      const nextLevel = (currentPuzzleIndex % 5) + 1;

      // Save progress
      const nextLevelNum = currentPuzzleIndex + 1;
      const saved = parseInt(localStorage.getItem('lastLevel'), 10) || 0;
      
      if (nextLevelNum > saved) {
        localStorage.setItem('lastLevel', nextLevelNum);
      }

      markTownLevelComplete(nextTown, nextLevel);

      window.location.href = `index.html?town=${nextTown}&level=${nextLevel}`;
    }
  };

  // End button: return to level select
  endBtn.onclick = () => {
    screen.close();
    window.levelDialogOpen = false;
    window.location.href = 'levels.html';
  };
}

//================================================================================
// 🧭 PUZZLE LOADING & NAVIGATION
//================================================================================
// Loads puzzle data, updates UI, manages prev/next navigation
//================================================================================

/**
 * Loads a specific puzzle by index
 * Updates UI, resets timer, saves progress, updates URL
 * @param {number} index - Puzzle index to load
 */
function loadPuzzle(index) {
  // Reset logo
  const logo = document.querySelector('.title img');
  if (logo) {
    logo.src = 'images/titleLogo.PNG';
    logo.alt = 'Hazoorah Logo';
  }

  // Calculate town and level
  const totalLevels = puzzles.length;
  const town = Math.floor(index / 5) + 1;
  const levelInTown = (index % 5) + 1;

  // Update puzzle indicator
  const indicator = document.getElementById('puzzleIndicator');
  console.log('DEBUG levelInTown:', levelInTown);
  console.log('DEBUG puzzles:', puzzles);
  if (indicator) indicator.textContent = `Puzzle ${levelInTown} of ${puzzles.length / 3}`;

  // Get puzzle data
  const puzzle = puzzles[index];
  console.log('puzzles:', puzzles);
  console.log('currentPuzzleIndex:', currentPuzzleIndex);
  console.log('puzzle:', puzzles ? puzzles[currentPuzzleIndex] : 'no puzzles loaded');
  
  if (!puzzle) {
    console.error("❌ Puzzle not found for index:", index);
    return;
  }

  // Generate puzzle UI
  generatePuzzle(puzzle.level, puzzle.items, puzzle.correctOrder, puzzle.title, puzzle.clues, puzzle.story);

  currentPuzzleIndex = index;

  // Save progress
  localStorage.setItem('lastLevel', currentPuzzleIndex + 1);

  // Update URL
  const newURL = new URL(window.location);
  newURL.searchParams.set('town', town);
  newURL.searchParams.set("level", levelInTown);
  window.history.replaceState({}, "", newURL);

  // Update banner
  const banner = document.getElementById('banner');
  if (banner) {
    banner.textContent = `LEVEL: ${levelInTown}`;
  }

  // Reset timer
  hour = 0;
  minute = 0;
  second = 0;

  const hourElement = document.getElementById('hours');
  const minuteElement = document.getElementById('minutes');
  const secondElement = document.getElementById('seconds');

  if (hourElement) hourElement.textContent = '00';
  if (minuteElement) minuteElement.textContent = '00';
  if (secondElement) secondElement.textContent = '00';

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  // Start timer automatically if timer feature is enabled
  if (timerFeatureEnabled) {
    timer = true;
    timerInterval = setInterval(() => {
      if (timer) {
        second++;
        if (second === 60) {
          second = 0;
          minute++;
        }
        if (minute === 60) {
          minute = 0;
          hour++;
        }
        
        if (hourElement) hourElement.textContent = hour.toString().padStart(2, '0');
        if (minuteElement) minuteElement.textContent = minute.toString().padStart(2, '0');
        if (secondElement) secondElement.textContent = second.toString().padStart(2, '0');
      }
    }, 1000);
  }

  // Update navigation buttons
  document.getElementById('prevBtn').disabled = index === 0;
  document.getElementById('nextBtn').disabled = index === puzzles.length - 1;
}

//================================================================================
// 🎯 NAVIGATION BUTTON HANDLERS
//================================================================================
// Previous/Next puzzle navigation
//================================================================================

document.getElementById('prevBtn').addEventListener('click', () => {
  if (currentPuzzleIndex > 0) loadPuzzle(--currentPuzzleIndex);
});

document.getElementById('nextBtn').addEventListener('click', () => {
  if (currentPuzzleIndex < puzzles.length - 1) loadPuzzle(++currentPuzzleIndex);
});

//================================================================================
// ⏸️ PAUSE DIALOG HANDLERS
//================================================================================
// Handles pause button and pause dialog interactions
//================================================================================

/**
 * Opens pause dialog and pauses timer
 */
const pauseDialog = document.getElementById('pauseDialog');
const pauseBtn = document.getElementById('pauseBtn');

if (pauseBtn) {
  pauseBtn.addEventListener('click', () => {
    // Pause timer
    if (timerFeatureEnabled && timer) {
      timer = false;
    }
    
    // Open dialog
    if (pauseDialog && typeof pauseDialog.showModal === 'function') {
      pauseDialog.showModal();
    }
  });
}

/**
 * Resume button - closes dialog and resumes timer
 */
const resumeBtn = document.getElementById('resumeBtn');
if (resumeBtn) {
  resumeBtn.addEventListener('click', () => {
    // Close dialog first
    if (pauseDialog) {
      pauseDialog.close();
         if (timerFeatureEnabled && timerInterval) {
      timer = true;
    }

    }
    
    // Remove overlay if it exists
    const overlay = document.querySelector('.overlay');
    if (overlay) {
      overlay.remove();
    }
    
    // Re-enable all game controls
    const submitBtn = document.getElementById('submitBtn');
    const clearBtn = document.getElementById('clearBtn');
    const shufBtn = document.getElementById('shufBtn');
    const hintBtn = document.getElementById('hintBtn');
    
    if (submitBtn && !submitBtn.dataset.permanentDisabled) {
      submitBtn.disabled = false;
    }
    if (clearBtn && !clearBtn.dataset.permanentDisabled) {
      clearBtn.disabled = false;
    }
    if (shufBtn && !shufBtn.dataset.permanentDisabled) {
      shufBtn.disabled = false;
    }
    
    // Only re-enable hint if settings allow it
    const settings = JSON.parse(localStorage.getItem('gameSettings') || '{}');
    const hintEnabled = settings.hintEnabled ?? false;
    if (hintBtn && hintEnabled && !hintBtn.dataset.forceDisabled) {
      hintBtn.disabled = false;
    }
    
    // Resume timer immediately
 
  });
}

/**
 * Retry Level button - reloads current puzzle
 */
const pauseRetryBtn = document.getElementById('pauseRetryBtn');
if (pauseRetryBtn) {
  pauseRetryBtn.addEventListener('click', () => {
    if (pauseDialog) {
      pauseDialog.close();
    }
    loadPuzzle(currentPuzzleIndex);
  });
}

/**
 * Levels button - navigates to levels page
 */
const pauseLevelsBtn = document.getElementById('pauseLevelsBtn');
if (pauseLevelsBtn) {
  pauseLevelsBtn.addEventListener('click', () => {
    const town = Math.floor(currentPuzzleIndex / 5) + 1;
    window.location.href = `levels.html?town=${town}`;
  });
}

/**
 * Towns button - navigates to towns page
 */
const pauseTownsBtn = document.getElementById('pauseTownsBtn');
if (pauseTownsBtn) {
  pauseTownsBtn.addEventListener('click', () => {
    window.location.href = 'towns.html';
  });
}

/**
 * Home button - navigates to home page
 */
const pauseHomeBtn = document.getElementById('pauseHomeBtn');
if (pauseHomeBtn) {
  pauseHomeBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}

//================================================================================
// 🚀 INITIALIZATION
//================================================================================
// Loads first puzzle when page loads
//================================================================================

document.addEventListener('DOMContentLoaded', () => {
  loadPuzzleURL();
});