// New Game Button Functionality

/**
 * Starts a new game, checking for existing progress and prompting user if needed
 */
function startNewGame() {
    // Check if there's existing game progress
    const gameProgress = localStorage.getItem('gameProgress');
    const townProgress = localStorage.getItem('townProgress');
    
    // If user has saved progress, show confirmation dialog
    if (gameProgress || townProgress) {
        const dialog = document.getElementById('confirmNewGameDialog');
        dialog.showModal();
    } else {
        // No existing progress, go directly to towns page
        location.href = 'towns.html';
    }
}

/**
 * Clears all saved game data and redirects to towns page
 */
function confirmNewGame() {
    // Clear all game-related localStorage
    localStorage.removeItem('gameProgress');
    localStorage.removeItem('townProgress');
    localStorage.removeItem('lastLevel');
    
    console.log('Game progress cleared. Starting fresh game.');
    
    // Redirect to towns page
    location.href = 'towns.html';
}

/**
 * Cancels the new game and closes the dialog
 */
function cancelNewGame() {
    const dialog = document.getElementById('confirmNewGameDialog');
    dialog.close();
}

// Wire up event listeners when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check and log saved game data status on page load
    const gameProgress = localStorage.getItem('gameProgress');
    const townProgress = localStorage.getItem('townProgress');
    const startBtn = document.getElementById('startBtn');
    
    if (gameProgress || townProgress) {
        console.log('User has existing game data saved.');
        // Enable resume button
        if (startBtn) {
            startBtn.disabled = false;
            startBtn.style.opacity = '1';
            startBtn.style.cursor = 'pointer';
        }
    } else {
        console.log('User has no game data saved.');
        // Disable resume button
        if (startBtn) {
            startBtn.disabled = true;
            startBtn.style.opacity = '0.5';
            startBtn.style.cursor = 'not-allowed';
        }
    }
    
    // New Game button
    const newGameBtn = document.getElementById('newGameBtn');
    if (newGameBtn) {
        newGameBtn.addEventListener('click', startNewGame);
    }
    
    // Confirmation dialog buttons
    const confirmYes = document.getElementById('confirmYesBtn');
    const confirmNo = document.getElementById('confirmNoBtn');
    
    if (confirmYes) {
        confirmYes.addEventListener('click', confirmNewGame);
    }
    
    if (confirmNo) {
        confirmNo.addEventListener('click', cancelNewGame);
    }
});
