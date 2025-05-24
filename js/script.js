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
});