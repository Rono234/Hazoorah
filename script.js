const slots = document.querySelectorAll('.slot');
const items = document.querySelectorAll('.item');
const feedback = document.getElementById('feedback');
const attemptCount = document.getElementById('attemptCount');
const submitBtn = document.getElementById('submitBtn');
const clearBtn = document.getElementById('clearBtn');
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


clearBtn.addEventListener("click", () =>{
    const slots = document.querySelectorAll(".slot");
    const itemContainer = document.getElementById("items");

    slots.forEach(slot => {
        const item = document.querySelector(".item");
        if (item){
            itemContainer.appendChild(item);
        }
    })
})