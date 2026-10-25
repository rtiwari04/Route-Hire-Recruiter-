/* ==========================================================================
   RouteHire Admin Dedicated Login Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const adminForm = document.getElementById('adminLoginForm');
  const emailInput = document.getElementById('adminEmailInput');
  const passwordInput = document.getElementById('adminPasswordInput');
  const demoFillBtn = document.getElementById('adminDemoFillBtn');

  // Auto-fill Admin Demo Credentials (admin@routehire.com / Admin@123)
  if (demoFillBtn) {
    demoFillBtn.addEventListener('click', () => {
      if (emailInput) emailInput.value = 'admin@routehire.com';
      if (passwordInput) passwordInput.value = 'Admin@123';
      showToast('Auto-filled Admin Demo Credentials (admin@routehire.com / Admin@123)', 'success');
    });
  }

  // Handle Admin Form Submission
  if (adminForm) {
    adminForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = emailInput ? emailInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value : '';

      if (!email || !password) {
        showToast('Please enter admin credentials', 'warning');
        return;
      }

      showToast('Authenticating Admin Session...', 'info');

      try {
        const result = await RouteHireAPI.login({ email, password, role: 'admin' });
        if (result && result.success && result.user && result.user.role === 'admin') {
          showToast('Admin Authentication Successful!', 'success');
          setTimeout(() => {
            window.location.href = 'admin-dashboard.html';
          }, 800);
          return;
        }

        showToast(result && result.message
          ? result.message
          : 'The authentication server did not confirm an admin account.', 'danger');
      } catch (err) {
        showToast(err.message || 'Unable to authenticate admin. Please try again.', 'danger');
      }
    });
  }
});