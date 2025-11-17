// Add sound to back button (bear icon) with delay before navigation
document.addEventListener('DOMContentLoaded', () => {
    const backLink = document.querySelector('.backHome');
    if (backLink) {
        // Use aria-label content for the native tooltip; fallback if missing
        const ariaText = backLink.getAttribute('aria-label');
        const tooltipText = (ariaText && ariaText.trim()) || 'Click to go back to the previous page';
        backLink.setAttribute('title', tooltipText);

        backLink.addEventListener('click', (e) => {
            e.preventDefault();
            const targetUrl = backLink.getAttribute('href');
            if (window.playSfx) {
                window.playSfx('audio/SoundFX/Bubble.mp3');
            }
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 150);
        });
    }
});
