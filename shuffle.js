//Logic for shuffle button
let animalArr = ['cat', 'mouse', 'dog'];

//Fisher-yates shuffle algorithm
function shuffArr(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function updateAnimalDisplay() {
  // Clear all slots and items container
  slots.forEach(slot => slot.innerHTML = '');
  document.getElementById('items').innerHTML = '';

  // Shuffle the animals
  shuffArr(animalArr);

  // Place animals directly in slots
  slots.forEach((slot, index) => {
    const animal = animalArr[index];
    const emoji = animal === 'cat' ? '🐱' : animal === 'mouse' ? '🐭' : '🐶';
    const div = document.createElement('div');
    div.className = 'item';
    div.draggable = true;
    div.dataset.color = animal;
    div.style.background = 'transparent';
    div.innerHTML = emoji;

    // Add drag event listeners
    div.addEventListener('dragstart', () => {
      draggedItem = div;
      setTimeout(() => div.style.display = 'none', 0);
    });
    div.addEventListener('dragend', () => {
      setTimeout(() => {
        div.style.display = 'flex';
        draggedItem = null;
      }, 0);
    });

    slot.appendChild(div);
  });
}

shufBtn.addEventListener('click', () => {
  updateAnimalDisplay();
});
