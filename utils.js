/* ==========================================================================
   RouteHire Shared Utilities
   ========================================================================== */

window.RouteHireUtils = window.RouteHireUtils || {};

window.RouteHireUtils.buildMailtoUrl = function ({ to, subject, body }) {
  const encodedSubject = encodeURIComponent(subject || 'RouteHire Notification');
  const encodedBody = encodeURIComponent(body || '');
  return `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
};

window.RouteHireUtils.openMailClient = function ({ to, subject, body }) {
  if (!to) {
    console.warn('[Mail] Missing recipient email.');
    return;
  }

  const mailtoUrl = window.RouteHireUtils.buildMailtoUrl({ to, subject, body });

  try {
    window.location.href = mailtoUrl;
  } catch (error) {
    console.warn('[Mail] mailto fallback failed:', error);
  }
};
