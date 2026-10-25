/* ==========================================================================
   Dashboard Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCounters();
  initDashboardOffers();
});

/* Animated Counter Logic */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    let count = 0;
    const speed = target / 50;

    const updateCounter = () => {
      count += speed;
      if (count < target) {
        counter.innerText = Math.ceil(count).toLocaleString();
        setTimeout(updateCounter, 30);
      } else {
        counter.innerText = target.toLocaleString() + '+';
      }
    };
    updateCounter();
  });
}

/* Dashboard Interactive Actions */
function initDashboardOffers() {
  const acceptBtns = document.querySelectorAll('.btn-accept-offer');
  const declineBtns = document.querySelectorAll('.btn-decline-offer');

  acceptBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.card, tr');
      if (card) {
        card.style.opacity = '0.5';
        showToast('Offer Accepted! Operator notified.', 'success');
      }
    });
  });

  declineBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.card, tr');
      if (card) {
        card.style.opacity = '0.5';
        showToast('Offer Declined.', 'danger');
      }
    });
  });
}
