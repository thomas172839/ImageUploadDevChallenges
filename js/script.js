document.addEventListener('DOMContentLoaded', function () {
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
    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            // Example: check file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('File is too large! Max size is 2MB.');
                fileInput.value = '';
                return;
            }
            // Example: show file name
            alert('Selected file: ' + file.name);
            // You can add further processing here (e.g., upload, preview, etc.)
            
            // For demonstration, let's just log the file name
            console.log('File selected:', file.name)


            // If you want to upload the file, you can use FormData and fetch API
            const formData = new FormData();
            formData.append('file', file);
            fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert('Error: ' + data.error);
                } else {
                    alert('Upload successful! Filename: ' + data.filename);
                }
            })
            .catch(error => {
                console.error('Error uploading file:', error);
                alert('An error occurred while uploading the file.'+error.message);
            });



        }
    });
});