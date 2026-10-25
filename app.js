/* ==========================================================================
   RouteHire Core Application Script & Global Helpers
   ========================================================================== */

// Central Google Form Application URL Constant
const DRIVER_APPLICATION_FORM = "https://forms.gle/z7VPSp8biUmKQBfB6";

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTheme();
  initMobileBottomNav();
});

/* Navbar Initialization */
function initNavbar() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('mobile-open');
    });
  }

  // Active Link Highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-link, .sidebar-item');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    }
  });
}

/* Mobile Bottom Navigation Bar for Drivers */
function initMobileBottomNav() {
  const isDriverPage = document.querySelector('.dashboard-wrapper') || window.location.pathname.includes('driver') || window.location.pathname.includes('find-jobs') || window.location.pathname.includes('applications');
  
  if (isDriverPage && !document.querySelector('.mobile-bottom-nav')) {
    const bottomNav = document.createElement('nav');
    bottomNav.className = 'mobile-bottom-nav';
    bottomNav.innerHTML = `
      <a href="DriverPage/Driver-Dashboard.html" class="bottom-nav-item ${window.location.pathname.includes('Driver-Dashboard') ? 'active' : ''}">
        <i class="fa-solid fa-house"></i>
        <span>Home</span>
      </a>
      <a href="DriverPage/Find-jobs.html" class="bottom-nav-item ${window.location.pathname.includes('find-jobs') ? 'active' : ''}">
        <i class="fa-solid fa-briefcase"></i>
        <span>Jobs</span>
      </a>
      <a href="DriverPage/Application.html" class="bottom-nav-item ${window.location.pathname.includes('applications') ? 'active' : ''}">
        <i class="fa-solid fa-file-lines"></i>
        <span>Applications</span>
      </a>
      <a href="DriverPage/Job-page.html" class="bottom-nav-item ${window.location.pathname.includes('job-offers') ? 'active' : ''}">
        <i class="fa-solid fa-envelope"></i>
        <span>Offers</span>
      </a>
      <a href="profile.html?id=drv-101" class="bottom-nav-item ${window.location.pathname.includes('profile') ? 'active' : ''}">
        <i class="fa-solid fa-user"></i>
        <span>Profile</span>
      </a>
    `;
    document.body.appendChild(bottomNav);
  }
}

/* Theme Management (Dark Mode) */
function initTheme() {
  const savedTheme = localStorage.getItem('routehire_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const themeToggleButtons = document.querySelectorAll('.theme-toggle');
  themeToggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('routehire_theme', next);
      showToast(`Switched to ${next} theme mode`, 'info');
    });
  });
}

/* Toast Notification Helper */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconClass = 'fa-circle-info';
  if (type === 'success') iconClass = 'fa-circle-check';
  if (type === 'warning') iconClass = 'fa-triangle-exclamation';
  if (type === 'danger') iconClass = 'fa-circle-xmark';

  toast.innerHTML = `
    <i class="fa-solid ${iconClass}"></i>
    <div>
      <h4 style="font-size:0.9rem; font-weight:600;">Notification</h4>
      <p style="font-size:0.85rem; color:var(--text-muted);">${message}</p>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* Modal Helper Functions */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}
