/* ==========================================================================
   RouteHire Backend Connection Status Indicator
   Displays connection status and provides troubleshooting info
   ========================================================================== */

const BackendStatusIndicator = {
  /**
   * Initialize the status indicator
   * Call this in your HTML pages to display backend connection status
   */
  init(containerId = 'backend-status-indicator') {
    // Check if config is loaded
    if (typeof RouteHireConfig === 'undefined') {
      console.warn('RouteHireConfig not loaded. Status indicator unavailable.');
      return;
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.render(containerId);
        this.setupEventListeners();
      });
    } else {
      this.render(containerId);
      this.setupEventListeners();
    }
  },

  /**
   * Render the status indicator HTML
   */
  render(containerId) {
    const status = RouteHireConfig.getBackendStatus();
    const isConnected = status.connected;
    
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Container with id "${containerId}" not found for status indicator`);
      return;
    }

    const html = `
      <div class="backend-status-indicator ${isConnected ? 'connected' : 'offline'}">
        <div class="status-badge">
          <i class="fa-solid ${isConnected ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
          <span class="status-text">
            ${isConnected ? 'Backend Connected' : 'Demo Mode - Backend Offline'}
          </span>
        </div>
        
        ${!isConnected ? `
          <div class="status-warning">
            <p>Running in <strong>Demo Mode</strong>. Backend is not available.</p>
            <button class="btn btn-sm btn-outline" id="retry-backend-connection">
              <i class="fa-solid fa-arrows-rotate"></i> Retry Connection
            </button>
          </div>
        ` : ''}
        
        <div class="status-details" id="status-details" style="display: none;">
          <p><strong>Last Updated:</strong> <span id="status-timestamp"></span></p>
          <p><strong>Details:</strong> <span id="status-details-text"></span></p>
          <p><strong>Backend URL:</strong> <code>${RouteHireConfig.BACKEND_URL}</code></p>
          <button class="btn btn-sm" id="close-status-details">Close</button>
        </div>
        
        <button class="status-toggle" id="status-toggle-details" title="Show Details">
          <i class="fa-solid fa-chevron-down"></i>
        </button>
      </div>

      <style>
        .backend-status-indicator {
          background: var(--card-bg, #fff);
          border-left: 4px solid var(--danger, #e74c3c);
          padding: 1rem;
          border-radius: var(--radius-md, 8px);
          margin-bottom: 1rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: relative;
        }

        .backend-status-indicator.connected {
          border-left-color: var(--success, #27ae60);
          background-color: var(--bg-success, #f0fdf4);
        }

        .backend-status-indicator.offline {
          border-left-color: var(--danger, #e74c3c);
          background-color: var(--bg-danger, #fdf0f0);
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .backend-status-indicator.connected .status-badge {
          color: var(--success, #27ae60);
        }

        .backend-status-indicator.offline .status-badge {
          color: var(--danger, #e74c3c);
        }

        .status-badge i {
          font-size: 1.1rem;
        }

        .status-warning {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(0,0,0,0.1);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .status-warning p {
          margin: 0 0 0.5rem 0;
          color: var(--text-muted, #666);
        }

        .status-details {
          margin-top: 1rem;
          padding: 1rem;
          background: rgba(0,0,0,0.05);
          border-radius: var(--radius-sm, 4px);
          font-size: 0.85rem;
          font-family: monospace;
        }

        .status-details p {
          margin: 0.5rem 0;
        }

        .status-details code {
          background: rgba(0,0,0,0.1);
          padding: 0.25rem 0.5rem;
          border-radius: 3px;
          word-break: break-all;
        }

        .status-toggle {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          color: var(--text-light, #999);
          transition: transform 0.2s ease;
          padding: 0.5rem;
        }

        .status-toggle:hover {
          color: var(--text-muted, #666);
        }

        .status-details:target + .status-toggle {
          transform: rotate(180deg);
        }
      </style>
    `;

    container.innerHTML = html;
  },

  /**
   * Setup event listeners for status indicator
   */
  setupEventListeners() {
    const retryBtn = document.getElementById('retry-backend-connection');
    const detailsBtn = document.getElementById('status-toggle-details');
    const closeBtn = document.getElementById('close-status-details');
    const detailsDiv = document.getElementById('status-details');

    if (retryBtn) {
      retryBtn.addEventListener('click', async () => {
        retryBtn.disabled = true;
        retryBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Retrying...';
        
        const connected = await RouteHireConfig.initBackendConnection();
        
        if (connected) {
          location.reload(); // Reload page on successful connection
        } else {
          retryBtn.disabled = false;
          retryBtn.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> Retry Failed - Try Again';
          setTimeout(() => {
            retryBtn.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> Retry Connection';
          }, 3000);
        }
      });
    }

    if (detailsBtn) {
      detailsBtn.addEventListener('click', () => {
        if (detailsDiv.style.display === 'none') {
          detailsDiv.style.display = 'block';
          this.updateDetailsDisplay();
        } else {
          detailsDiv.style.display = 'none';
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        detailsDiv.style.display = 'none';
      });
    }
  },

  /**
   * Update the details display with current status
   */
  updateDetailsDisplay() {
    const status = RouteHireConfig.getBackendStatus();
    const timestamp = document.getElementById('status-timestamp');
    const details = document.getElementById('status-details-text');

    if (timestamp) {
      timestamp.textContent = status.timestamp 
        ? new Date(status.timestamp).toLocaleString()
        : 'Never';
    }

    if (details) {
      details.textContent = status.details || 'No additional details available';
    }
  },

  /**
   * Refresh status by checking backend again
   */
  async refresh() {
    await RouteHireConfig.initBackendConnection();
    // Re-render the indicator
    this.render('backend-status-indicator');
    this.setupEventListeners();
  }
};

// Auto-initialize if there's a status indicator container
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('backend-status-indicator')) {
      BackendStatusIndicator.init();
    }
  });
} else {
  if (document.getElementById('backend-status-indicator')) {
    BackendStatusIndicator.init();
  }
}
