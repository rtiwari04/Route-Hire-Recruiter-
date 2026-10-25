/* ==========================================================================
   Login Page Script (Connected to REST API & Demo Fallback)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const driverTab = document.getElementById('driverTab');
  const operatorTab = document.getElementById('operatorTab');
  const roleInput = document.getElementById('userRole');
  const mobileInput = document.getElementById('mobileInput');
  const passwordInput = document.getElementById('passwordInput');
  const demoFillBtn = document.getElementById('demoFillBtn');
  const loginForm = document.getElementById('loginForm');

  let activeRole = 'driver';

  if (driverTab && operatorTab) {
    driverTab.addEventListener('click', () => {
      activeRole = 'driver';
      driverTab.classList.add('active');
      operatorTab.classList.remove('active');
      roleInput.value = 'driver';
      clearFields();
    });

    operatorTab.addEventListener('click', () => {
      activeRole = 'operator';
      operatorTab.classList.add('active');
      driverTab.classList.remove('active');
      roleInput.value = 'operator';
      clearFields();
    });
  }

  if (demoFillBtn) {
    demoFillBtn.addEventListener('click', () => {
      if (activeRole === 'driver') {
        mobileInput.value = 'driver@demo.com';
        passwordInput.value = 'driver123';
        showToast('Auto-filled Driver Credentials', 'success');
      } else {
        mobileInput.value = 'operator@demo.com';
        passwordInput.value = 'operator123';
        showToast('Auto-filled Operator Credentials', 'success');
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const emailOrPhone = mobileInput.value.trim();
      const password = passwordInput.value.trim();

      if (!emailOrPhone || !password) {
        showToast('Please enter credentials', 'warning');
        return;
      }

      showToast('Authenticating Credentials...', 'info');

      try {
        const result = await RouteHireAPI.login({ email: emailOrPhone, password, role: activeRole });
        if (result && result.success) {
          showToast('Login Successful!', 'success');
          setTimeout(() => {
            if (activeRole === 'driver') {
              window.location.href = 'driver-dashboard.html';
            } else {
              window.location.href = 'operator-dashboard.html';
            }
          }, 800);
          return;
        }
      } catch (err) {
        console.log('[API Login Notice] Demo mode fallback triggered.');
      }

      // Demo Fallback
      setTimeout(() => {
        if (activeRole === 'driver') {
          localStorage.setItem('routeHireRole', 'driver');
          localStorage.setItem('routehire_user', JSON.stringify({ role: 'driver', name: 'Rajesh Kumar', mobile: '9876543210' }));
          window.location.href = 'driver-dashboard.html';
        } else {
          localStorage.setItem('routeHireRole', 'operator');
          localStorage.setItem('routehire_user', JSON.stringify({ role: 'operator', name: 'Laxmi Holidays Travels', mobile: '9999999999' }));
          window.location.href = 'operator-dashboard.html';
        }
      }, 800);
    });
  }

  function clearFields() {
    mobileInput.value = '';
    passwordInput.value = '';
  }
});
