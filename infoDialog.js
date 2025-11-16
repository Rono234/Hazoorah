 const infoDialog = document.getElementById('infoDialog');
        const infoBtn = document.getElementById('infoBtn');
        const closeInfoBtn = document.getElementById('closeInfoBtn');

        // Open the info dialog when the info button is clicked
        infoBtn.addEventListener('click', () => {
            infoDialog.showModal();
        });

        // Close the info dialog when the close button is clicked
        closeInfoBtn.addEventListener('click', () => {
            infoDialog.close();
        });