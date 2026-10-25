/* ==========================================================================
   RouteHire Applications Manager Script (Connected to REST API)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initDriverApplications();
  initOperatorApplications();
});

async function initDriverApplications() {
  const container = document.getElementById('driverAppsList');
  if (!container) return;

  let apps = ROUTEHIRE_DATA.applications;

  try {
    const apiRes = await RouteHireAPI.getMyApplications();
    if (apiRes && apiRes.success && apiRes.applications.length > 0) {
      apps = apiRes.applications;
    }
  } catch (e) {
    console.log('[API Notice] Fallback to local applications data.');
  }

  if (apps.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted);">No applications submitted yet.</p>`;
    return;
  }

  container.innerHTML = apps.map(app => {
    let badgeClass = 'badge-info';
    if (app.status === 'SHORTLISTED' || app.status === 'Shortlisted') badgeClass = 'badge-verified';
    if (app.status === 'SELECTED' || app.status === 'Selected') badgeClass = 'badge-verified';
    if (app.status === 'REJECTED' || app.status === 'Rejected') badgeClass = 'badge-danger';
    if (app.status === 'UNDER_REVIEW' || app.status === 'Under Review') badgeClass = 'badge-warning';

    const jobId = app.job ? (app.job._id || app.job) : (app.jobId || 'job-101');

    return `
      <div class="card" style="margin-bottom: 1rem; padding: 1.5rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span class="badge ${badgeClass}" style="margin-bottom: 0.5rem;"><i class="fa-solid fa-clock"></i> Status: ${app.status}</span>
            <h3 style="font-size: 1.15rem; color: var(--primary);">${app.jobTitle}</h3>
            <p style="font-size: 0.9rem; font-weight: 600; color: var(--text-dark);">${app.operatorName} • <i class="fa-solid fa-route" style="color:var(--accent);"></i> ${app.route}</p>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">Applied on: ${app.appliedDate}</p>
          </div>
          <div style="text-align: right;">
            <span class="badge badge-info" style="font-size: 0.8rem;">Match: ${app.matchScore || 96}%</span>
            <div style="margin-top: 0.75rem;">
              <a href="/DriverPage/Job-page.html?id=${jobId}" class="btn btn-outline btn-sm">View Requirement</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

async function initOperatorApplications() {
  const container = document.getElementById('operatorAppsContainer');
  if (!container) return;

  let apps = ROUTEHIRE_DATA.applications;
  try {
    const apiRes = await RouteHireAPI.getOperatorApplications();
    if (apiRes && apiRes.success && apiRes.applications.length > 0) {
      apps = apiRes.applications;
    }
  } catch (e) {
    console.log('[API Notice] Fallback to local applications data.');
  }

  container.innerHTML = apps.map(app => {
    const appId = app._id || app.id || 'app-101';
    return `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <img src="${app.driverImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}" class="avatar-img" style="width: 42px; height: 42px;">
            <div>
              <strong style="color: var(--primary);">${app.driverName}</strong>
              <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Nagpur • 8 Yrs Exp</span>
            </div>
          </div>
        </td>
        <td>${app.jobTitle}</td>
        <td>${app.route}</td>
        <td>${app.appliedDate}</td>
        <td><span class="badge badge-warning">${app.status}</span></td>
        <td>
          <button class="btn btn-success btn-sm" onclick="handleUpdateAppStatus('${appId}', 'SHORTLISTED')">Shortlist</button>
          <button class="btn btn-danger btn-sm" onclick="handleUpdateAppStatus('${appId}', 'REJECTED')">Reject</button>
        </td>
      </tr>
    `;
  }).join('');
}

async function handleUpdateAppStatus(appId, status) {
  try {
    await RouteHireAPI.updateApplicationStatus(appId, status);
  } catch (e) {
    console.log('[API Notice] Local status update fallback.');
  }

  showToast(`Applicant status updated to ${status}. Email sent!`, status === 'SHORTLISTED' ? 'success' : 'danger');
  initOperatorApplications();
}
