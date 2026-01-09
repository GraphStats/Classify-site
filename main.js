function initApp() {
    lucide.createIcons();

    // Theme Toggle Logic
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    document.documentElement.setAttribute('data-theme', currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // GitHub Release Detection
    updateLatestRelease();
}

async function updateLatestRelease() {
    try {
        const response = await fetch('https://api.github.com/repos/GraphStats/Classify/releases/latest');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        const version = data.tag_name.replace('v', '');
        const assets = data.assets;
        const setupExe = assets.find(asset => asset.name.endsWith('.exe') && asset.name.includes('Setup'));
        const downloadUrl = setupExe ? setupExe.browser_download_url : data.html_url;

        // Update Version Badge
        const badge = document.querySelector('.badge');
        if (badge) {
            badge.innerHTML = `<span class="pulse"></span> Version ${version} disponible`;
            badge.style.animation = 'fadeIn 0.5s ease-out';
        }

        // Update All Download Buttons
        const downloadBtns = document.querySelectorAll('a.btn-primary');
        downloadBtns.forEach(btn => {
            const text = btn.textContent.toLowerCase();
            if (text.includes('télécharger') || text.includes('obtenir')) {
                btn.href = downloadUrl;
            }
        });
    } catch (error) {
        console.error('Error fetching GitHub release:', error);
    }
}

document.addEventListener('DOMContentLoaded', initApp);
