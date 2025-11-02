const slots = document.querySelectorAll('.slot');
const items = document.querySelectorAll('.item');
const feedback = document.getElementById('feedback');
const attemptCount = document.getElementById('attemptCount');
const submitBtn = document.getElementById('submitBtn');
const shufBtn = document.getElementById('shufBtn');
let draggedItem = null;
let attemptsLeft = 3;

// Correct answer order: Red, Green, Blue
const correctOrder = ['cat', 'dog', 'mouse'];

// Drag and drop logic
items.forEach(item => {
  item.addEventListener('dragstart', () => {
    draggedItem = item;
    setTimeout(() => item.style.display = 'none', 0);
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
    if (draggedItem) {
      if (slot.firstChild) {
        // Swap if already occupied
        const existing = slot.firstChild;
        document.getElementById('items').appendChild(existing);
      }
      slot.appendChild(draggedItem);
    }
  });
});

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

// Submit logic
submitBtn.addEventListener('click', () => {
  const userOrder = Array.from(slots).map(slot => 
    slot.firstChild ? slot.firstChild.dataset.color : null
  );

  if (userOrder.includes(null)) {
    feedback.textContent = "Place all houses before submitting!";
    feedback.style.color = "orange";
    return;
  }

  if (JSON.stringify(userOrder) === JSON.stringify(correctOrder)) {
    feedback.textContent = "✅ Correct! You solved the riddle!";
    feedback.style.color = "green";
    submitBtn.disabled = true;
  } else {
    attemptsLeft--;
    attemptCount.textContent = attemptsLeft;
    feedback.textContent = attemptsLeft > 0 
      ? "❌ Not quite right! Try again."
      : "❌ Out of attempts! The correct order was Red, Green, Blue.";
    feedback.style.color = attemptsLeft > 0 ? "red" : "darkred";

    if (attemptsLeft === 0) submitBtn.disabled = true;
  }
});