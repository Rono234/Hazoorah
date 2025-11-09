// levels.js - Pagination logic for levels page
(function() {
    let currentPage = 1;
    const totalPages = 3;

    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    const pageIndicator = document.getElementById('pageIndicator');
    const allButtons = document.querySelectorAll('[data-page]');

    function showPage(pageNum) {
        currentPage = pageNum;

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
        pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;

        // Disable prev button on first page
        prevBtn.disabled = currentPage === 1;

        // Disable next button on last page
        nextBtn.disabled = currentPage === totalPages;
    }

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            showPage(currentPage - 1);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            showPage(currentPage + 1);
        }
    });

    // Optional: handle level button clicks (navigate to game)
    document.querySelectorAll('.levelBtn:not(.placeholder)').forEach(btn => {
        btn.addEventListener('click', () => {
            const level = btn.dataset.level;
            // Navigate to game page with level parameter
            window.location.href = `index.html?level=${level}`;
        });
    });

    // Initialize first page
    showPage(1);
})();

// function getLevelsData(levelNumber){
//     const levelData = [
//         {
//             levelItems: level1,
//             order: orderLevel1,
//             title: "Level 1",
//             clues: cluesLevel1,
//             story: story1
//         },
//         {
//             levelItems: level2,
//             order: orderLevel2,
//             title: "Level 2",
//             clues: cluesLevel2,
//             story: story2
//         },
//         {
//             levelItems: level3,
//             order: orderLevel3,
//             title: "Level 3",
//             clues: cluesLevel3,
//             story: story3
//         },
//         {
//             levelItems: level4,
//             order: orderLevel4,
//             title: "Level 4",
//             clues: cluesLevel4,
//             story: story4
//         },
//         {
//             levelItems: level5,
//             order: orderLevel5,
//             title: "Level 5",
//             clues: cluesLevel5,
//             story: story5
//         },
//         {
//             levelItems: level6,
//             order: orderLevel6,
//             title: "Level 6",
//             clues: cluesLevel6,
//             story: story6
//         },
//         {
//             levelItems: level7,
//             order: orderLevel7,
//             title: "Level 7",
//             clues: cluesLevel7,
//             story: story7
//         },
//         {
//             levelItems: level8,
//             order: orderLevel8,
//             title: "Level 8",
//             clues: cluesLevel8,
//             story: story8
//         },
//         {
//             levelItems: level9,
//             order: orderLevel9,
//             title: "Level 9",
//             clues: cluesLevel9,
//             story: story9
//         },
//         {
//             levelItems: level10,
//             order: orderLevel10,
//             title: "Level 10",
//             clues: cluesLevel10,
//             story: story10
//         },
//         {
//             levelItems: level11,
//             order: orderLevel11,
//             title: "Level 11",
//             clues: cluesLevel11,
//             story: story11
//         },
//         {
//             levelItems: level12,
//             order: orderLevel12,
//             title: "Level 12",
//             clues: cluesLevel12,
//             story: story12
//         },
//         {
//             levelItems: level13,
//             order: orderLevel13,
//             title: "Level 13",
//             clues: cluesLevel13,
//             story: story13
//         },
//         {
//             levelItems: level14,
//             order: orderLevel14,
//             title: "Level 14",
//             clues: cluesLevel14,
//             story: story14
//         },
//         {
//             levelItems: level15,
//             order: orderLevel15,
//             title: "Level 15",
//             clues: cluesLevel15,
//             story: story15
//         },
//     ];

//     if (levelNumber < 1 || levelNumber > levelData.length) {
//         alert("Invalid level number! Returning level 1.");
//         levelNumber = 1;
//     }

//     return levelData[levelNumber - 1];
// }