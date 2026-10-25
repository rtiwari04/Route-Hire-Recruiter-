/* ==========================================================================
   RouteHire Operator Requirement Post & Registration Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Post Requirement Form Handler (post-requirement.html)
  const postForm = document.getElementById('postRequirementForm');
  if (postForm) {
    postForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('reqTitle').value.trim();
      const location = document.getElementById('reqLocation').value.trim();
      const routesInput = document.getElementById('reqRoutes').value.trim();
      const vacancies = parseInt(document.getElementById('reqVacancies').value) || 1;
      const salaryMin = document.getElementById('reqSalaryMin').value.trim();
      const salaryMax = document.getElementById('reqSalaryMax').value.trim();
      const minExperience = parseInt(document.getElementById('reqExp').value) || 2;
      const desc = document.getElementById('reqDescription').value.trim();

      const newJob = {
        id: `job-custom-${Date.now()}`,
        operatorId: "op-custom",
        operatorName: "Laxmi Holidays Travels",
        operatorLogo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=150&q=80",
        verifiedOperator: true,
        title: title || "Professional Bus Driver",
        location: location || "Nagpur, Maharashtra",
        routes: routesInput ? routesInput.split(',').map(r => r.trim()) : ["Nagpur → Mumbai"],
        salaryMin: parseInt(salaryMin) || 30000,
        salaryMax: parseInt(salaryMax) || 35000,
        salaryFormatted: `₹${salaryMin} – ₹${salaryMax} / Month`,
        minExperience: minExperience,
        vehicleTypes: ["Volvo", "AC Sleeper"],
        vacancies: vacancies,
        joining: "Immediate",
        jobType: "Full-Time",
        postedDate: "Just now",
        description: desc || "Driver recruitment requirement.",
        responsibilities: ["Safely operate assigned bus.", "Follow assigned schedules.", "Maintain passenger safety."],
        requirements: ["Valid Heavy Commercial Driving Licence", "Relevant highway experience"],
        benefits: ["Accomodation provided", "Trip allowances"]
      };

      // Save via REST API & LocalStorage
      try {
        RouteHireAPI.createJob(newJob);
      } catch (err) {
        console.log('[API Notice] Fallback requirement post.');
      }

      const existing = JSON.parse(localStorage.getItem('routehire_custom_jobs') || '[]');
      existing.unshift(newJob);
      localStorage.setItem('routehire_custom_jobs', JSON.stringify(existing));

      openModal('postSuccessModal');
    });
  }

  // 2. Operator Registration Form Handler (operator-register.html)
  const opRegisterForm = document.getElementById('operatorRegisterForm');
  if (opRegisterForm) {
    opRegisterForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const opData = {
        companyName: document.getElementById('opCompanyName') ? document.getElementById('opCompanyName').value : 'Apex Intercity Express',
        contactPerson: document.getElementById('opContactPerson') ? document.getElementById('opContactPerson').value : 'Vikram Malhotra',
        phone: document.getElementById('opPhone') ? document.getElementById('opPhone').value : '+91 99999 99999',
        email: document.getElementById('opEmail') ? document.getElementById('opEmail').value : 'operator@demo.com',
        password: 'operator123',
        city: document.getElementById('opCity') ? document.getElementById('opCity').value : 'Nagpur',
        state: 'Maharashtra'
      };

      try {
        await RouteHireAPI.registerOperator(opData);
      } catch (err) {
        console.log('[API Notice] Operator registration fallback.');
      }

      openModal('opSuccessModal');
    });
  }
});
