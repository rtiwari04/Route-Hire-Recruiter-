/* ==========================================================================
   RouteHire Recruitment Job Engine & Match Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initJobsPage();
  initJobDetailsPage();
});

/* RouteHire Match Calculation Logic (Frontend Demo Algorithm) */
function calculateRouteHireMatch(job, driver = null) {
  if (!driver) {
    driver = ROUTEHIRE_DATA.drivers[0]; // Default demo driver (Rajesh Kumar)
  }

  let score = 50; // Base score

  // 1. Location match (+20 pts)
  if (driver.city && job.location.toLowerCase().includes(driver.city.toLowerCase())) {
    score += 20;
  }

  // 2. Route overlap match (+20 pts)
  const driverRouteCities = driver.routes.flatMap(r => [r.origin.toLowerCase(), r.destination.toLowerCase()]);
  const jobRouteCities = job.routes.flatMap(r => r.toLowerCase().split('→').map(c => c.trim()));
  
  const hasRouteMatch = jobRouteCities.some(city => driverRouteCities.includes(city));
  if (hasRouteMatch) {
    score += 20;
  }

  // 3. Experience match (+10 pts)
  if (driver.experience >= job.minExperience) {
    score += 10;
  }

  // Cap score at 98%
  return Math.min(score, 98);
}

/* Render Jobs List on find-jobs.html */
async function initJobsPage() {
  const jobsContainer = document.getElementById('jobsContainer');
  const searchInput = document.getElementById('searchJobInput');
  const locationFilter = document.getElementById('locationFilter');
  const expFilter = document.getElementById('expFilter');
  const vehicleFilter = document.getElementById('vehicleFilter');
  const jobsCountEl = document.getElementById('jobsCount');

  if (!jobsContainer) return;

  // Retrieve jobs via REST API with fallback to LocalStorage & data.js
  let apiJobs = null;
  try {
    const apiRes = await RouteHireAPI.getJobs();
    if (apiRes && apiRes.success) apiJobs = apiRes.jobs;
  } catch (e) {
    console.log('[API Notice] Fallback to local jobs dataset.');
  }

  const localJobs = JSON.parse(localStorage.getItem('routehire_custom_jobs') || '[]');
  const allJobs = apiJobs || [...localJobs, ...ROUTEHIRE_DATA.jobs];

  renderJobs(allJobs);

  [searchInput, locationFilter, expFilter, vehicleFilter].forEach(input => {
    if (input) {
      input.addEventListener('input', filterJobs);
      input.addEventListener('change', filterJobs);
    }
  });

  function filterJobs() {
    let filtered = [...allJobs];
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const loc = locationFilter ? locationFilter.value : '';
    const minExp = expFilter ? parseInt(expFilter.value) || 0 : 0;
    const vehicle = vehicleFilter ? vehicleFilter.value : '';

    if (query) {
      filtered = filtered.filter(j => 
        j.title.toLowerCase().includes(query) ||
        j.operatorName.toLowerCase().includes(query) ||
        j.location.toLowerCase().includes(query) ||
        j.routes.some(r => r.toLowerCase().includes(query))
      );
    }

    if (loc) {
      filtered = filtered.filter(j => j.location.toLowerCase().includes(loc.toLowerCase()));
    }

    if (minExp > 0) {
      filtered = filtered.filter(j => j.minExperience <= minExp);
    }

    if (vehicle) {
      filtered = filtered.filter(j => j.vehicleTypes.some(v => v.toLowerCase().includes(vehicle.toLowerCase())));
    }

    renderJobs(filtered);
  }

  function renderJobs(jobs) {
    if (jobsCountEl) jobsCountEl.innerText = jobs.length;

    if (jobs.length === 0) {
      jobsContainer.innerHTML = `
        <div class="card" style="text-align: center; padding: 4rem 1rem;">
          <i class="fa-solid fa-briefcase-slash" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
          <h3>No Requirements Found</h3>
          <p style="color: var(--text-muted); margin-top: 0.5rem;">Try broadening your route or location filters.</p>
        </div>
      `;
      return;
    }

    jobsContainer.innerHTML = jobs.map(j => {
      const matchScore = calculateRouteHireMatch(j);
      return `
        <div class="card card-hover" style="margin-bottom: 1.5rem; padding: 1.8rem; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.25rem;">
              <div style="display: flex; gap: 1rem; align-items: center;">
                <img src="${j.operatorLogo}" alt="${j.operatorName}" class="avatar-img" style="width: 56px; height: 56px;">
                <div>
                  <h3 style="font-size: 1.2rem; color: var(--text-dark); margin-bottom: 0.2rem;">${j.title}</h3>
                  <div style="font-size: 0.9rem; font-weight: 600; color: var(--primary); display: flex; align-items: center; gap: 0.4rem;">
                    ${j.operatorName}
                    ${j.verifiedOperator ? `<span class="badge badge-verified" style="font-size:0.7rem;"><i class="fa-solid fa-circle-check"></i> Verified Operator</span>` : ''}
                  </div>
                </div>
              </div>
              <span class="badge badge-verified" style="font-size: 0.82rem; padding: 0.4rem 0.85rem;"><i class="fa-solid fa-bolt"></i> ${matchScore}% RouteHire Match</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; background: var(--bg-subtle); padding: 1rem 1.25rem; border-radius: var(--radius-sm); margin-bottom: 1.25rem; font-size: 0.9rem;">
              <div>
                <span style="font-size: 0.75rem; color: var(--text-light); uppercase; font-weight: 700;">LOCATION</span>
                <p style="font-weight: 600; color: var(--text-dark);"><i class="fa-solid fa-location-dot" style="color: var(--accent);"></i> ${j.location}</p>
              </div>
              <div>
                <span style="font-size: 0.75rem; color: var(--text-light); uppercase; font-weight: 700;">SALARY / CTC</span>
                <p style="font-weight: 700; color: var(--success);">${j.salaryFormatted}</p>
              </div>
              <div>
                <span style="font-size: 0.75rem; color: var(--text-light); uppercase; font-weight: 700;">EXPERIENCE</span>
                <p style="font-weight: 600;">${j.minExperience}+ Years Required</p>
              </div>
              <div>
                <span style="font-size: 0.75rem; color: var(--text-light); uppercase; font-weight: 700;">VACANCIES</span>
                <p style="font-weight: 700; color: var(--accent);">${j.vacancies} Drivers Needed</p>
              </div>
            </div>

            <div style="margin-bottom: 1.25rem;">
              <span style="font-size: 0.78rem; font-weight: 700; uppercase; color: var(--text-light); display: block; margin-bottom: 0.4rem;">COVERED ROUTES</span>
              <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${j.routes.map(r => `<span style="background: var(--accent-light); color: var(--accent); font-weight: 600; padding: 0.3rem 0.75rem; border-radius: var(--radius-full); font-size: 0.82rem;"><i class="fa-solid fa-route"></i> ${r}</span>`).join('')}
              </div>
            </div>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--card-border); padding-top: 1.25rem;">
            <span style="font-size: 0.85rem; color: var(--text-muted);"><i class="fa-solid fa-clock"></i> Posted ${j.postedDate}</span>
            <a href="Job-page.html?id=${j.id}" class="btn btn-primary btn-sm"><i class="fa-solid fa-eye"></i> View Details &amp; Apply</a>
          </div>
        </div>
      `;
    }).join('');
  }
}

/* Render Job Details Page (job-details.html) */
function initJobDetailsPage() {
  const params = new URLSearchParams(window.location.search);
  const jobId = params.get('id') || 'job-101';

  const localJobs = JSON.parse(localStorage.getItem('routehire_custom_jobs') || '[]');
  const allJobs = [...localJobs, ...ROUTEHIRE_DATA.jobs];
  const job = allJobs.find(j => j.id === jobId) || allJobs[0];

  const titleEl = document.getElementById('jobTitle');
  const operatorNameEl = document.getElementById('jobOperatorName');
  const operatorLogoEl = document.getElementById('jobOperatorLogo');
  const locationEl = document.getElementById('jobLocation');
  const salaryEl = document.getElementById('jobSalary');
  const expEl = document.getElementById('jobExp');
  const vacanciesEl = document.getElementById('jobVacancies');
  const joiningEl = document.getElementById('jobJoining');
  const routesContainer = document.getElementById('jobRoutes');
  const vehiclesContainer = document.getElementById('jobVehicles');
  const descEl = document.getElementById('jobDescription');
  const respContainer = document.getElementById('jobResponsibilities');
  const reqContainer = document.getElementById('jobRequirements');
  const benefitsContainer = document.getElementById('jobBenefits');
  const matchScoreEl = document.getElementById('jobMatchScore');

  if (titleEl) titleEl.innerText = job.title;
  if (operatorNameEl) operatorNameEl.innerText = job.operatorName;
  if (operatorLogoEl) operatorLogoEl.src = job.operatorLogo;
  if (locationEl) locationEl.innerText = job.location;
  if (salaryEl) {
    if (job.salaryFormatted) {
      salaryEl.innerText = job.salaryFormatted;
    } else if (job.salaryMin && job.salaryMax) {
      salaryEl.innerText = `₹${Number(job.salaryMin).toLocaleString('en-IN')} - ₹${Number(job.salaryMax).toLocaleString('en-IN')} / Month`;
    } else if (job.salaryMin) {
      salaryEl.innerText = `₹${Number(job.salaryMin).toLocaleString('en-IN')} / Month`;
    } else {
      salaryEl.innerText = '₹30,000 - ₹35,000 / Month';
    }
  }
  if (expEl) expEl.innerText = `${job.minExperience}+ Years Required`;
  if (vacanciesEl) vacanciesEl.innerText = `${job.vacancies} Drivers`;
  if (joiningEl) joiningEl.innerText = job.joining;
  if (descEl) descEl.innerText = job.description;

  if (matchScoreEl) {
    const match = calculateRouteHireMatch(job);
    matchScoreEl.innerText = `${match}% RouteHire Match`;
  }

  if (routesContainer) {
    routesContainer.innerHTML = job.routes.map(r => `
      <span class="badge badge-info" style="padding: 0.5rem 1rem; font-size: 0.88rem;"><i class="fa-solid fa-route"></i> ${r}</span>
    `).join('');
  }

  if (vehiclesContainer) {
    vehiclesContainer.innerHTML = job.vehicleTypes.map(v => `
      <span style="background: var(--bg-subtle); border: 1px solid var(--card-border); padding: 0.4rem 0.9rem; border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 600;"><i class="fa-solid fa-bus"></i> ${v}</span>
    `).join('');
  }

  if (respContainer && job.responsibilities) {
    respContainer.innerHTML = job.responsibilities.map(r => `
      <li style="margin-bottom: 0.75rem; display: flex; align-items: flex-start; gap: 0.75rem; font-size: 0.95rem;">
        <i class="fa-solid fa-circle-check" style="color: var(--accent); margin-top: 0.25rem;"></i>
        <span>${r}</span>
      </li>
    `).join('');
  }

  if (reqContainer && job.requirements) {
    reqContainer.innerHTML = job.requirements.map(req => `
      <li style="margin-bottom: 0.75rem; display: flex; align-items: flex-start; gap: 0.75rem; font-size: 0.95rem;">
        <i class="fa-solid fa-angle-right" style="color: var(--secondary); margin-top: 0.25rem;"></i>
        <span>${req}</span>
      </li>
    `).join('');
  }

  if (benefitsContainer && job.benefits) {
    benefitsContainer.innerHTML = job.benefits.map(b => `
      <div style="background: var(--success-bg); color: var(--success); padding: 0.8rem 1.2rem; border-radius: var(--radius-sm); font-weight: 600; font-size: 0.9rem; display: flex; align-items: center; gap: 0.6rem;">
        <i class="fa-solid fa-gift"></i> ${b}
      </div>
    `).join('');
  }
}

/* Open Apply Modal & Trigger External Google Form Redirect */
function openApplyModal() {
  const modal = document.getElementById('applyConfirmationModal');
  if (modal) modal.classList.add('active');
}

async function handleContinueApplication() {
  closeModal('applyConfirmationModal');
  showToast('Submitting application & notifying operator...', 'info');

  const params = new URLSearchParams(window.location.search);
  const jobId = params.get('id') || 'job-101';

  try {
    await RouteHireAPI.applyJob(jobId);
  } catch (e) {
    console.log('[API Notice] Fallback application submission.');
  }

  showToast('Opening RouteHire Driver Application Form...', 'success');
  window.open(DRIVER_APPLICATION_FORM, '_blank');
}
