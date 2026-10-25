/* ==========================================================================
   Multi-Step Driver & Operator Registration Form Handler
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMultiStepForm();
  initDynamicRoutes();
});

function initMultiStepForm() {
  const wizardForm = document.getElementById('driverRegisterForm');
  if (!wizardForm) return;

  const steps = document.querySelectorAll('.wizard-step-content');
  const stepIndicators = document.querySelectorAll('.step-item');
  const progressBar = document.querySelector('.wizard-progress-bar');
  const nextBtns = document.querySelectorAll('.btn-next-step');
  const prevBtns = document.querySelectorAll('.btn-prev-step');

  let currentStep = 1;
  const totalSteps = steps.length;

  updateStepView();

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
          currentStep++;
          updateStepView();
        }
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateStepView();
      }
    });
  });

  wizardForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    showToast('Submitting registration details to RouteHire API...', 'info');

    const driverData = {
      name: document.getElementById('driverName') ? document.getElementById('driverName').value : 'Rajesh Kumar',
      email: document.getElementById('driverEmail') ? document.getElementById('driverEmail').value : 'driver@demo.com',
      phone: document.getElementById('driverPhone') ? document.getElementById('driverPhone').value : '+91 98765 43210',
      password: 'driver123',
      city: document.getElementById('driverCity') ? document.getElementById('driverCity').value : 'Nagpur',
      state: document.getElementById('driverState') ? document.getElementById('driverState').value : 'Maharashtra',
      licenceNumber: document.getElementById('licenceNumber') ? document.getElementById('licenceNumber').value : 'MH-31-2012-0088921',
      totalExperience: document.getElementById('totalExp') ? document.getElementById('totalExp').value : 8
    };

    try {
      await RouteHireAPI.registerDriver(driverData);
    } catch (err) {
      console.log('[API Notice] Registration fallback execution.');
    }

    openModal('successModal');
  });

  function updateStepView() {
    steps.forEach((s, idx) => {
      s.style.display = (idx + 1 === currentStep) ? 'block' : 'none';
    });

    stepIndicators.forEach((item, idx) => {
      const stepNum = idx + 1;
      item.classList.remove('active', 'completed');
      if (stepNum === currentStep) {
        item.classList.add('active');
      } else if (stepNum < currentStep) {
        item.classList.add('completed');
      }
    });

    if (progressBar) {
      const pct = ((currentStep - 1) / (totalSteps - 1)) * 100;
      progressBar.style.width = `${pct}%`;
    }

    window.scrollTo({ top: 100, behavior: 'smooth' });
  }

  function validateStep(stepNum) {
    const activeStepEl = document.getElementById(`step-${stepNum}`);
    if (!activeStepEl) return true;

    const requiredFields = activeStepEl.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.style.borderColor = 'var(--danger)';
      } else {
        field.style.borderColor = 'var(--card-border)';
      }
    });

    if (!isValid) {
      showToast('Please fill in all mandatory fields before proceeding.', 'warning');
    }
    return isValid;
  }
}

function initDynamicRoutes() {
  const container = document.getElementById('routesContainer');
  const addBtn = document.getElementById('btnAddRoute');

  if (container && addBtn) {
    addBtn.addEventListener('click', () => {
      const newRow = document.createElement('div');
      newRow.className = 'route-row';
      newRow.innerHTML = `
        <input type="text" class="form-control" placeholder="Origin (e.g. Nagpur)" required>
        <input type="text" class="form-control" placeholder="Destination (e.g. Hyderabad)" required>
        <input type="number" class="form-control" placeholder="Years" min="1" required>
        <input type="number" class="form-control" placeholder="Trips" min="10" required>
        <button type="button" class="btn-remove-row" title="Remove Route"><i class="fa-solid fa-trash-can"></i></button>
      `;

      container.appendChild(newRow);

      newRow.querySelector('.btn-remove-row').addEventListener('click', () => {
        newRow.remove();
      });
    });
  }
}
