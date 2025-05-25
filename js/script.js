document.addEventListener('DOMContentLoaded', function () {
    // Initialize the theme toggle button
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    let isSun = true;

    themeToggleBtn.addEventListener('click', function () {
        isSun = !isSun;
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        themeIcon.src = isSun ? "resources/Moon_fill.svg" : "resources/Sun_fill.svg";
    });

    // Handle file input
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', handleFile);

    // Drag and drop support
    const uploadArea = document.querySelector('.upload-area');

    uploadArea.addEventListener('dragover', function (e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function (e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function (e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) {
            // Set the file to the input for consistency
            fileInput.files = e.dataTransfer.files;
            handleFile({ target: { files: [file] } });
        }
    });

    function handleFile(event) {
        const file = event.target.files[0];
        if (file) {
            // Example: check file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('File is too large! Max size is 2MB.');
                fileInput.value = '';
                return;
            }

            // Replace upload area with uploading message
            const uploadArea = document.querySelector('.upload-area');
            const mainContent = document.querySelector('.main-content');
            uploadArea.innerHTML = `
                <div class="uploading-message">
                    <img src="resources/logo-small.svg" alt="Uploading...">
                    <p>Uploading... Please wait</p>
                    <div class="loading-bar-container">
                        <div class="loading-bar"></div>
                    </div>
                </div>
            `;

            // Animate loading bar
            const loadingBar = document.querySelector('.loading-bar');
            let progress = 0;
            const interval = setInterval(() => {
                if (progress < 90) {
                    progress += Math.random() * 10;
                    loadingBar.style.width = Math.min(progress, 90) + '%';
                }
            }, 200);

            // If you want to upload the file, you can use FormData and fetch API
            const formData = new FormData();
            formData.append('file', file);
            fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                clearInterval(interval);
                if (loadingBar) loadingBar.style.width = '100%';

                setTimeout(() => {
                    if (data.error) {
                        uploadArea.innerHTML = `<p class="error">Error: ${data.error}</p>`;
                    } else {
                        mainContent.innerHTML = `
                            <div class="upload-image-container">
                                ${data.url ? `<img src="${data.url}" alt="Uploaded Image">` : '<p class="error">No image URL returned from server.</p>'}
                            </div>
                            <div class="upload-actions">
                                <button id="shareBtn" type="button">
                                    <img src="resources/Link.svg" alt="Share" class="icon">
                                    Share
                                </button>
                                <a id="downloadBtn" href="${data.url || '#'}" download>
                                    <button type="button">
                                        <img src="resources/download.svg" alt="Download" class="icon">
                                        Download
                                    </button>
                                </a>
                            </div>
                        `;

                        // Add event listener for share button
                        const shareBtn = document.getElementById('shareBtn');
                        if (shareBtn && data.url) {
                            shareBtn.addEventListener('click', async () => {
                                if (navigator.share) {
                                    try {
                                        await navigator.share({
                                            title: 'Uploaded Image',
                                            url: data.url
                                        });
                                    } catch (err) {
                                        alert('Sharing failed: ' + err.message);
                                    }
                                } else {
                                    // Fallback: copy link to clipboard
                                    try {
                                        await navigator.clipboard.writeText(data.url);
                                        alert('Image URL copied to clipboard!');
                                    } catch (err) {
                                        alert('Could not copy URL: ' + err.message);
                                    }
                                }
                            });
                        }
                    }
                }, 400);
            })
            .catch(error => {
                clearInterval(interval);
                uploadArea.innerHTML = `<p class="error">An error occurred while uploading the file. ${error.message}</p>`;
            });
        }
    }
});