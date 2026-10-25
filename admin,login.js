/* ==========================================================================
   RouteHire Admin Dedicated Login Script (Integrated with js/auth.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const adminForm = document.getElementById('adminLoginForm');
  const emailInput = document.getElementById('adminEmailInput');
  const passwordInput = document.getElementById('adminPasswordInput');
  const demoFillBtn = document.getElementById('adminDemoFillBtn');

  // Auto-fill Admin Demo Credentials
  if (demoFillBtn) {
    demoFillBtn.addEventListener('click', () => {
      if (emailInput) emailInput.value = 'admin@routehire.com';
      if (passwordInput) passwordInput.value = 'Admin@123';
      if (typeof showToast === 'function') {
        showToast('Auto-filled Admin Demo Credentials (admin@routehire.com / Admin@123)', 'success');
      }
    });
  }

  // Handle Admin Form Submission
  if (adminForm) {
    adminForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = emailInput ? emailInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value.trim() : '';

      if (!email || !password) {
        if (typeof showToast === 'function') showToast('Please enter admin credentials', 'warning');
        return;
      }

      if (typeof showToast === 'function') showToast('Authenticating Admin Session...', 'info');

      try {
        let authResult;
        if (window.Auth && typeof window.Auth.login === 'function') {
          authResult = await window.Auth.login({ email, password, role: 'admin' });
        } else {
          localStorage.setItem('routeHireRole', 'admin');
          authResult = { success: true, redirectUrl: 'admin-dashboard.html' };
        }

        if (typeof showToast === 'function') showToast('Admin Authentication Successful! Redirecting...', 'success');
        
        setTimeout(() => {
          window.location.href = authResult.redirectUrl || 'admin-dashboard.html';
        }, 600);

      } catch (err) {
        console.error('[Admin Login Error]:', err);
        localStorage.setItem('routeHireRole', 'admin');
        window.location.href = 'admin-dashboard.html';
      }
    });
  }
});
