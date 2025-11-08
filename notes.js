(function () {
    const notesKeyPrefix = 'hazoora_note_level_';
    const textarea = document.getElementById('levelNotes');
    const saveBtn = document.getElementById('saveNoteBtn');
    const clearBtn = document.getElementById('clearNoteBtn');
    const status = document.getElementById('noteStatus');
    const puzzleIndicator = document.getElementById('puzzleIndicator');

    if (!textarea || !puzzleIndicator) return;

    function getLevelNumber() {
        const txt = puzzleIndicator.textContent || '';
        const m = txt.match(/(\d+)/);
        return m ? m[1] : '1';
    }

    function storageKeyForCurrentLevel() {
        return notesKeyPrefix + getLevelNumber();
    }

    function loadNote() {
        const key = storageKeyForCurrentLevel();
        textarea.value = localStorage.getItem(key) || '';
        status.textContent = '';
    }

    // function saveNote() {
    //     const key = storageKeyForCurrentLevel();
    //     localStorage.setItem(key, textarea.value);
    //     status.textContent = 'Saved';
    //     clearStatusAfterDelay();
    // }

    function clearNote() {
        const key = storageKeyForCurrentLevel();
        localStorage.removeItem(key);
        textarea.value = '';
        status.textContent = 'Cleared';
        clearStatusAfterDelay();
    }

    function clearStatusAfterDelay() {
        setTimeout(() => { status.textContent = ''; }, 1500);
    }

    // simple debounce for autosave
    let autosaveTimer = null;
    textarea.addEventListener('input', () => {
        clearTimeout(autosaveTimer);
        autosaveTimer = setTimeout(() => {
            saveNote();
        }, 1200);
    });

    // saveBtn.addEventListener('click', saveNote);
    clearBtn.addEventListener('click', clearNote);

    // watch for puzzleIndicator text changes (loads notes when puzzle changes)
    const observer = new MutationObserver(loadNote);
    observer.observe(puzzleIndicator, { childList: true, characterData: true, subtree: true });

    // initial load
    loadNote();
})();