/* ==========================================================================
   Search Driver Engine Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const cityFilter = document.getElementById('cityFilter');
  const vehicleFilter = document.getElementById('vehicleFilter');
  const expFilter = document.getElementById('expFilter');
  const availabilityFilter = document.getElementById('availabilityFilter');
  const verifiedFilter = document.getElementById('verifiedFilter');
  const sortSelect = document.getElementById('sortSelect');
  const resultsContainer = document.getElementById('driverResultsContainer');
  const totalCountEl = document.getElementById('totalCount');

  if (!resultsContainer) return;

  let allDrivers = [...ROUTEHIRE_DATA.drivers];

  // Render initial list
  renderDrivers(allDrivers);

  // Filter event listeners
  const filterInputs = [searchInput, cityFilter, vehicleFilter, expFilter, availabilityFilter, verifiedFilter, sortSelect];
  filterInputs.forEach(input => {
    if (input) {
      input.addEventListener('input', filterAndRender);
      input.addEventListener('change', filterAndRender);
    }
  });

  function filterAndRender() {
    let filtered = [...allDrivers];

    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const city = cityFilter ? cityFilter.value : '';
    const vehicle = vehicleFilter ? vehicleFilter.value : '';
    const minExp = expFilter ? parseInt(expFilter.value) || 0 : 0;
    const availability = availabilityFilter ? availabilityFilter.value : '';
    const verifiedOnly = verifiedFilter ? verifiedFilter.checked : false;
    const sortBy = sortSelect ? sortSelect.value : 'rating';

    // Search query filter (Name, Route, Skills, City)
    if (query) {
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(query) ||
        d.city.toLowerCase().includes(query) ||
        d.routes.some(r => `${r.origin} ${r.destination}`.toLowerCase().includes(query)) ||
        d.vehicles.some(v => v.toLowerCase().includes(query))
      );
    }

    // City Filter
    if (city) {
      filtered = filtered.filter(d => d.city === city);
    }

    // Vehicle Filter
    if (vehicle) {
      filtered = filtered.filter(d => d.vehicles.includes(vehicle));
    }

    // Experience Filter
    if (minExp > 0) {
      filtered = filtered.filter(d => d.experience >= minExp);
    }

    // Availability Filter
    if (availability) {
      filtered = filtered.filter(d => d.availability === availability);
    }

    // Verified Filter
    if (verifiedOnly) {
      filtered = filtered.filter(d => d.verified);
    }

    // Sorting
    if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'experience') {
      filtered.sort((a, b) => b.experience - a.experience);
    } else if (sortBy === 'score') {
      filtered.sort((a, b) => b.score - a.score);
    }

    renderDrivers(filtered);
  }

  function renderDrivers(drivers) {
    if (totalCountEl) {
      totalCountEl.innerText = drivers.length;
    }

    if (drivers.length === 0) {
      resultsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;" class="card">
          <i class="fa-solid fa-user-slash" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
          <h3>No Drivers Found</h3>
          <p style="color: var(--text-muted); margin-top: 0.5rem;">Try adjusting your search criteria or clearing filters.</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = drivers.map(d => `
      <div class="card card-hover" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <img src="${d.profileImage}" alt="${d.name}" class="avatar-img" style="width: 56px; height: 56px;">
              <div>
                <h3 style="font-size: 1.1rem; display: flex; align-items: center; gap: 0.4rem;">
                  ${d.name}
                  ${d.verified ? `<i class="fa-solid fa-circle-check" style="color: var(--success);" title="Verified Profile"></i>` : ''}
                </h3>
                <p style="font-size: 0.85rem; color: var(--text-muted);">
                  <i class="fa-solid fa-location-dot" style="color: var(--accent);"></i> ${d.city}, ${d.state}
                </p>
              </div>
            </div>
            <div style="text-align: right;">
              <span class="badge badge-verified" style="font-size: 0.75rem;">Score: ${d.score}/100</span>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; background: var(--bg-subtle); padding: 0.85rem; border-radius: var(--radius-sm); margin-bottom: 1.25rem; font-size: 0.88rem;">
            <div>
              <span style="color: var(--text-light); display: block; font-size: 0.75rem;">Total Exp</span>
              <strong>${d.experience} Years</strong>
            </div>
            <div>
              <span style="color: var(--text-light); display: block; font-size: 0.75rem;">Rating</span>
              <strong><i class="fa-solid fa-star" style="color: var(--warning);"></i> ${d.rating} / 5.0</strong>
            </div>
          </div>

          <div style="margin-bottom: 1rem;">
            <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--text-light); display: block; margin-bottom: 0.4rem;">Top Route</span>
            <div style="font-size: 0.9rem; font-weight: 600; color: var(--primary);">
              <i class="fa-solid fa-route" style="color: var(--accent); margin-right: 0.4rem;"></i>
              ${d.routes[0] ? `${d.routes[0].origin} → ${d.routes[0].destination}` : 'Flexible'}
            </div>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--text-light); display: block; margin-bottom: 0.4rem;">Vehicles</span>
            <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
              ${d.vehicles.map(v => `<span style="background: var(--card-bg); border: 1px solid var(--card-border); padding: 0.2rem 0.6rem; border-radius: var(--radius-full); font-size: 0.78rem;">${v}</span>`).join('')}
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem; border-top: 1px solid var(--card-border); padding-top: 1.25rem;">
          <a href="Frontend/HTML/public/profile.html?id=${d.id}" class="btn btn-outline btn-sm btn-block">View Profile</a>
          <button class="btn btn-primary btn-sm btn-block" onclick="openOfferModal('${d.id}', '${d.name}')">Send Offer</button>
        </div>
      </div>
    `).join('');
  }
});

function openOfferModal(driverId, driverName) {
  const modal = document.getElementById('offerModal');
  const targetNameEl = document.getElementById('targetDriverName');
  if (targetNameEl) targetNameEl.innerText = driverName;
  if (modal) modal.classList.add('active');
}
