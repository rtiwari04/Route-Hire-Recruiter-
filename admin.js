/* ==========================================================================
   RouteHire Admin Module Script (Document Verification & Email Generator)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  checkAdminRoleProtection();
  initAdminDashboard();
  initAdminDriverDetails();
});

function checkAdminRoleProtection() {
  const currentPath = window.location.pathname.toLowerCase();
  if (currentPath.includes('admin-login.html')) return;

  const role = localStorage.getItem('routeHireRole');
  if (role !== 'admin') {
    window.location.href = 'admin-login.html';
  }
}

async function initAdminDashboard() {
  const totalDriversEl = document.getElementById('adminStatTotalDrivers');
  if (!totalDriversEl) return;

  let statsLoaded = false;

  if (window.RouteHireAPI && typeof RouteHireAPI.getAdminStats === 'function') {
    try {
      const res = await RouteHireAPI.getAdminStats();
      if (res && res.success && res.stats) {
        if (totalDriversEl) totalDriversEl.innerText = res.stats.totalDrivers || 0;
        const pendingEl = document.getElementById('adminStatPending');
        if (pendingEl) pendingEl.innerText = res.stats.pendingDrivers || 0;
        const verifiedEl = document.getElementById('adminStatVerified');
        if (verifiedEl) verifiedEl.innerText = res.stats.verifiedDrivers || 0;
        const rejectedEl = document.getElementById('adminStatRejected');
        if (rejectedEl) rejectedEl.innerText = res.stats.rejectedDrivers || 0;
        statsLoaded = true;
      }
    } catch (e) {}
  }

  if (!statsLoaded) {
    const drivers = getDriversData();
    if (totalDriversEl) totalDriversEl.innerText = drivers.length;
    const pendingEl = document.getElementById('adminStatPending');
    if (pendingEl) pendingEl.innerText = drivers.filter(d => d.verificationStatus === 'pending' || d.verificationStatus === 'PENDING_VERIFICATION').length;
    const verifiedEl = document.getElementById('adminStatVerified');
    if (verifiedEl) verifiedEl.innerText = drivers.filter(d => d.verificationStatus === 'verified' || d.verificationStatus === 'VERIFIED').length;
    const rejectedEl = document.getElementById('adminStatRejected');
    if (rejectedEl) rejectedEl.innerText = drivers.filter(d => d.verificationStatus === 'rejected' || d.verificationStatus === 'REJECTED').length;
  }
}

function getDriversData() {
  try {
    const localDrivers = JSON.parse(localStorage.getItem('routehire_drivers') || '[]');
    if (localDrivers.length > 0) return localDrivers;
  } catch (e) {}
  
  if (window.ROUTEHIRE_DATA && window.ROUTEHIRE_DATA.drivers) {
    return window.ROUTEHIRE_DATA.drivers;
  }
  return [
    {
      id: 'drv-101',
      name: 'Rajesh Kumar',
      email: 'rajesh@demo.com',
      mobile: '+91 98765 43210',
      city: 'Nagpur',
      state: 'Maharashtra',
      experience: 8,
      licenceNumber: 'MH-31-2012-0088921',
      verificationStatus: 'PENDING_VERIFICATION'
    },
    {
      id: 'drv-102',
      name: 'Suresh Patil',
      email: 'suresh@demo.com',
      mobile: '+91 98220 11223',
      city: 'Pune',
      state: 'Maharashtra',
      experience: 12,
      licenceNumber: 'MH-12-2010-0044120',
      verificationStatus: 'VERIFIED'
    }
  ];
}