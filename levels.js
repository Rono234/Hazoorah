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
