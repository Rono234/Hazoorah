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

// Add shuffle button event listener
document.getElementById('shufBtn').addEventListener('click', () => {
  updatePuzzleDisplay();
});
