/* ==========================================================================
   Driver Profile Dynamic Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const driverId = params.get('id') || 'drv-101';

  let driver = null;
  try {
    const apiRes = await RouteHireAPI.getDriverProfile(driverId);
    if (apiRes && apiRes.success && apiRes.driver) {
      driver = apiRes.driver;
    }
  } catch (e) {
    console.log('[API Notice] Profile API fallback.');
  }

  if (!driver) {
    driver = ROUTEHIRE_DATA.drivers.find(d => d.id === driverId) || ROUTEHIRE_DATA.drivers[0];
  }

  renderProfileDetails(driver);
});

function renderProfileDetails(d) {
  // Elements
  const pName = document.getElementById('profileName');
  const pImg = document.getElementById('profileImg');
  const pLocation = document.getElementById('profileLocation');
  const pExp = document.getElementById('profileExp');
  const pRating = document.getElementById('profileRating');
  const pScore = document.getElementById('profileScore');
  const pAvailability = document.getElementById('profileAvailability');
  const pPrevCompany = document.getElementById('profilePrevCompany');
  const pSalary = document.getElementById('profileSalary');
  const pRoutesContainer = document.getElementById('profileRoutes');
  const pVehiclesContainer = document.getElementById('profileVehicles');
  const pSkillsContainer = document.getElementById('profileSkills');
  const pLanguagesContainer = document.getElementById('profileLanguages');

  if (pName) pName.innerText = d.name;
  if (pImg) pImg.src = d.profileImage;
  if (pLocation) pLocation.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${d.city}, ${d.state}`;
  if (pExp) pExp.innerText = `${d.experience} Years`;
  if (pRating) pRating.innerText = d.rating;
  if (pScore) pScore.innerText = `${d.score}/100`;
  if (pAvailability) pAvailability.innerText = d.availability;
  if (pPrevCompany) pPrevCompany.innerText = `${d.lastPosition} at ${d.previousCompany}`;
  if (pSalary) pSalary.innerText = d.expectedSalary;

  // Routes
  if (pRoutesContainer) {
    pRoutesContainer.innerHTML = d.routes.map(r => `
      <div class="card" style="padding: 1.25rem; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 42px; height: 42px; border-radius: 50%; background: var(--accent-light); color: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
            <i class="fa-solid fa-route"></i>
          </div>
          <div>
            <h4 style="font-size: 1.05rem;">${r.origin} <i class="fa-solid fa-arrow-right-long" style="color: var(--accent); font-size: 0.85rem; margin: 0 0.4rem;"></i> ${r.destination}</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted);">${r.experienceYears} Years Driving Experience • Approx ${r.trips}+ Trips Completed</p>
          </div>
        </div>
        <span class="badge badge-verified"><i class="fa-solid fa-circle-check"></i> High Route Master</span>
      </div>
    `).join('');
  }

  // Vehicles
  if (pVehiclesContainer) {
    pVehiclesContainer.innerHTML = d.vehicles.map(v => `
      <span style="background: var(--bg-subtle); border: 1px solid var(--card-border); padding: 0.5rem 1.1rem; border-radius: var(--radius-full); font-size: 0.9rem; font-weight: 600; color: var(--primary);">
        <i class="fa-solid fa-bus" style="color: var(--accent); margin-right: 0.4rem;"></i> ${v}
      </span>
    `).join('');
  }

  // Skills
  if (pSkillsContainer) {
    pSkillsContainer.innerHTML = d.skills.map(s => `
      <span class="badge badge-info" style="padding: 0.4rem 0.9rem; font-size: 0.82rem;">${s}</span>
    `).join('');
  }

  // Languages
  if (pLanguagesContainer) {
    pLanguagesContainer.innerHTML = d.languages.map(l => `
      <span style="background: var(--card-bg); border: 1px solid var(--card-border); padding: 0.4rem 0.9rem; border-radius: var(--radius-sm); font-size: 0.88rem; font-weight: 500;">${l}</span>
    `).join('');
  }
}
