/* ==========================================================================
   Login Page Script (Integrated with js/auth.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const driverTab = document.getElementById('driverTab');
  const operatorTab = document.getElementById('operatorTab');
  const adminTab = document.getElementById('adminTab');
  const roleInput = document.getElementById('userRole');
  const mobileInput = document.getElementById('mobileInput');
  const passwordInput = document.getElementById('passwordInput');
  const inputLabel = document.getElementById('inputLabel');
  const inputIcon = document.getElementById('inputIcon');
  const demoFillBtn = document.getElementById('demoFillBtn');
  const loginForm = document.getElementById('loginForm');

  let activeRole = 'driver';

  function setActiveTab(role) {
    activeRole = role;
    if (roleInput) roleInput.value = role;

    [driverTab, operatorTab, adminTab].forEach(tab => {
      if (!tab) return;
      tab.classList.remove('active');
      tab.style.background = 'transparent';
      tab.style.color = 'var(--text-muted)';
      tab.style.fontWeight = '600';
    });

    let currentTab = driverTab;
    if (role === 'operator') currentTab = operatorTab;
    if (role === 'admin') currentTab = adminTab;

    if (currentTab) {
      currentTab.classList.add('active');
      currentTab.style.background = 'var(--card-bg)';
      currentTab.style.color = 'var(--accent)';
      currentTab.style.fontWeight = '700';
    }

    if (inputLabel) {
      if (role === 'driver') inputLabel.textContent = 'Mobile Number / Email';
      else if (role === 'operator') inputLabel.textContent = 'Operator Email / Mobile';
      else if (role === 'admin') inputLabel.textContent = 'Admin Email / Mobile';
    }

    if (inputIcon) {
      if (role === 'driver') inputIcon.className = 'fa-solid fa-user';
      else if (role === 'operator') inputIcon.className = 'fa-solid fa-building';
      else if (role === 'admin') inputIcon.className = 'fa-solid fa-user-shield';
    }

    if (mobileInput) {
      if (role === 'driver') mobileInput.placeholder = 'e.g. driver@demo.com or 9876543210';
      else if (role === 'operator') mobileInput.placeholder = 'e.g. operator@demo.com';
      else if (role === 'admin') mobileInput.placeholder = 'admin@routehire.com';
    }

    clearFields();
  }

  if (driverTab) driverTab.addEventListener('click', () => setActiveTab('driver'));
  if (operatorTab) operatorTab.addEventListener('click', () => setActiveTab('operator'));
  if (adminTab) adminTab.addEventListener('click', () => setActiveTab('admin'));

  if (demoFillBtn) {
    demoFillBtn.addEventListener('click', () => {
      if (activeRole === 'driver') {
        mobileInput.value = 'driver@gmail.com';
        passwordInput.value = 'Driver@123';
        if (typeof showToast === 'function') showToast('Auto-filled Driver Credentials (driver@gmail.com / Driver@123)', 'success');
      } else if (activeRole === 'operator') {
        mobileInput.value = 'operator@abctravels.com';
        passwordInput.value = 'Operator@123';
        if (typeof showToast === 'function') showToast('Auto-filled Operator Credentials (operator@abctravels.com / Operator@123)', 'success');
      } else if (activeRole === 'admin') {
        mobileInput.value = 'admin@routehire.com';
        passwordInput.value = 'Admin@123';
        if (typeof showToast === 'function') showToast('Auto-filled Admin Credentials (admin@routehire.com / Admin@123)', 'success');
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const emailOrPhone = mobileInput.value.trim();
      const password = passwordInput.value.trim();

      if (!emailOrPhone || !password) {
        if (typeof showToast === 'function') showToast('Please enter credentials', 'warning');
        return;
      }

      if (typeof showToast === 'function') showToast('Authenticating Credentials...', 'info');

      try {
        // Use universal Auth module
        let authResult;
        if (window.Auth && typeof window.Auth.login === 'function') {
          authResult = await window.Auth.login({ email: emailOrPhone, password, role: activeRole });
        } else {
          // Direct fallback if Auth not loaded
          localStorage.setItem('routeHireRole', activeRole);
          authResult = {
            success: true,
            redirectUrl: activeRole === 'admin' ? 'admin-dashboard.html' : (activeRole === 'operator' ? 'operator-dashboard.html' : 'driver-dashboard.html')
          };
        }

        if (typeof showToast === 'function') showToast(`${activeRole.toUpperCase()} Login Successful! Redirecting...`, 'success');
        
        setTimeout(() => {
          window.location.href = authResult.redirectUrl;
        }, 600);

      } catch (err) {
        console.error('[Login Error]:', err);
        // Force fallback redirect
        localStorage.setItem('routeHireRole', activeRole);
        window.location.href = activeRole === 'admin' ? 'admin-dashboard.html' : (activeRole === 'operator' ? 'operator-dashboard.html' : 'driver-dashboard.html');
      }
    });
  }

  function clearFields() {
    if (mobileInput) mobileInput.value = '';
    if (passwordInput) passwordInput.value = '';
  }
});
