document.addEventListener('DOMContentLoaded', () => {
  initDashboardTheme();
  initDashboardNavigation();
  initDashboardGreeting();
});

function initDashboardTheme() {
  const savedTheme = localStorage.getItem('routehire_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const themeButtons = document.querySelectorAll('.theme-toggle');
  themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('routehire_theme', nextTheme);

      const icon = button.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-moon', nextTheme === 'dark');
        icon.classList.toggle('fa-sun', nextTheme === 'light');
      }
    });
  });
}

function initDashboardNavigation() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const pageName = currentPath.split('?')[0];

  document.querySelectorAll('.sidebar-item, .nav-link, .bottom-nav-item').forEach((link) => {
    const href = (link.getAttribute('href') || '').split('?')[0];
    if (!href) return;

    if (href === pageName || href === currentPath) {
      link.classList.add('active');
    }
  });
}

function initDashboardGreeting() {
  const header = document.querySelector('.dashboard-title h1');
  if (!header) return;

  const hour = new Date().getHours();
  let greeting = 'Hello';

  if (hour < 12) greeting = 'Good Morning';
  else if (hour < 18) greeting = 'Good Afternoon';
  else greeting = 'Good Evening';

  const profileName = document.querySelector('.nav-actions div span:last-child') ||
    document.querySelector('.nav-actions span:last-child') ||
    document.querySelector('.avatar-img + span');
  const driverName = profileName ? profileName.textContent.trim() : 'Rakesh';

  header.textContent = `${greeting}, ${driverName} 👋`;
}
