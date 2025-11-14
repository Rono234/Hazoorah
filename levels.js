// levels.js - Pagination logic for levels page
(function() {
    // Get town parameter from URL
    const urlParams = new URLSearchParams(window.location.search);
    const selectedTown = parseInt(urlParams.get('town')) || 1;

    let currentPage = 1;
    const totalPages = 3;
    const levelsPerPage = 5;
    const totalLevels = totalPages * levelsPerPage;

    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    const pageIndicator = document.getElementById('pageIndicator');
    const allButtons = document.querySelectorAll('[data-page]');
    const levelsGrid = document.getElementById('levelsGrid')

    function generateLevelBtns() {
        levelsGrid.innerHTML = '';

        const townProgress = JSON.parse(localStorage.getItem('townProgress') || "{}");
        
        console.log('Town Progress:', townProgress); // Debug log

        for (let i = 1; i <= totalLevels; i++) {
            const btn = document.createElement('button');
            btn.classList.add("levelBtn");

            const town = Math.ceil(i / levelsPerPage);
            const levelInTown = ((i - 1) % levelsPerPage) + 1;

            btn.dataset.town = town;
            btn.dataset.level = levelInTown;
            btn.dataset.page = town;
            btn.setAttribute('aria-label', `Town ${town} Level ${levelInTown}`);

            const completedLevels = townProgress[`town${town}`] || [];
            const isCompleted = completedLevels.includes(levelInTown);
            
            // Get star rating for this level
            const starKey = `town${town}_stars`;
            const stars = townProgress[starKey]?.[levelInTown] || 0;
            
            console.log(`Town ${town}, Level ${levelInTown}: completed=${isCompleted}, stars=${stars}`); // Debug log

            // Create star display with images - show for completed levels
            let starHTML = '';
            if (isCompleted) {
                starHTML = `<div class="levelStars">`;
                for (let s = 0; s < 3; s++) {
                    // FIX: Changed from >= to <
                    const starSrc = s < stars ? 'images/star-filled.png' : 'images/star-empty.png';
                    starHTML += `<img src="${starSrc}" alt="${s < stars ? 'Earned' : 'Empty'} star" class="star-icon">`;
                }
                starHTML += `</div>`;
            }

            btn.innerHTML = `
                <span class="levelBtnLabel">${levelInTown}</span>
                ${starHTML}
            `;

            const highestCompleted = completedLevels.length ? Math.max(...completedLevels) : 0;
            const nextLevel = highestCompleted + 1;

            if (isCompleted) {
                btn.disabled = false;
                btn.classList.add('completed');
            } else if (levelInTown === 1 || levelInTown === nextLevel) {
                btn.disabled = false;
            } else {
                btn.disabled = true;
                btn.classList.add('locked');
            }

            btn.addEventListener('click', () => {
                window.location.href = `index.html?town=${town}&level=${levelInTown}`;
            });

            levelsGrid.appendChild(btn);
        }
    }

    function showPage(pageNum) {
        currentPage = pageNum;
        const allButtons = document.querySelectorAll(".levelBtn"); 
        
        // Show/hide buttons based on page
        allButtons.forEach(btn => {
            const btnPage = parseInt(btn.dataset.page);
            
            if (btnPage === currentPage) {
                btn.style.display = btn.classList.contains('placeholder') ? 'block' : 'flex';
            } else {
                btn.style.display = 'none';
            }
        });

        // Update page indicator
        // pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;

        // Disable prev button on first page
        // prevBtn.disabled = currentPage === 1;

        // Disable next button on last page
        // nextBtn.disabled = currentPage === totalPages;
    }

    // prevBtn.addEventListener('click', () => {
    //     if (currentPage > 1) {
    //         showPage(currentPage - 1);
    //     }
    // });

    // nextBtn.addEventListener('click', () => {
    //     if (currentPage < totalPages) {
    //         showPage(currentPage + 1);
    //     }
    // });

    window.addEventListener('storage', () => {
        generateLevelBtns();
        showPage(currentPage);
    })

    // Initialize first page
    generateLevelBtns();
    showPage(selectedTown);
})();