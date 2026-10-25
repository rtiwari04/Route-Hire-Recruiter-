/* ==========================================================================
   RouteHire Frontend Configuration & Connection Manager
   ========================================================================== */

const isLocalPreview = window.location.protocol === 'file:' ||
  (['localhost', '127.0.0.1'].includes(window.location.hostname) &&
    window.location.port !== '5000');
const BACKEND_ORIGIN = isLocalPreview
  ? `http://${window.location.hostname || 'localhost'}:5000`
  : window.location.origin;

const RouteHireConfig = {
  // Backend API Configuration
  API_BASE_URL: `${BACKEND_ORIGIN}/api`,
  BACKEND_URL: BACKEND_ORIGIN,
  PORT: 5000,
  
  // Feature Flags
  FEATURES: {
    USE_BACKEND: true,
    USE_DEMO_MODE: true, // Fallback to demo if backend is unavailable
    LOG_REQUESTS: true,
    SHOW_DEBUG_INFO: false
  },

  // Storage Keys
  STORAGE_KEYS: {
    TOKEN: 'routehire_token',
    USER: 'routehire_user',
    ROLE: 'routeHireRole',
    BACKEND_STATUS: 'routehire_backend_status',
    LAST_SYNC: 'routehire_last_sync'
  },

  // Application Constants
  ROLES: {
    DRIVER: 'driver',
    OPERATOR: 'operator',
    ADMIN: 'admin'
  },

  // Timeout Configuration (ms)
  TIMEOUTS: {
    API_CALL: 8000,
    CONNECTION_CHECK: 3000
  },

  /**
   * Initialize Backend Connection
   * Check if backend is accessible and update status
   */
  async initBackendConnection() {
    try {
      const response = await fetch(`${this.BACKEND_URL}/api/health`, {
        method: 'GET',
        timeout: this.TIMEOUTS.CONNECTION_CHECK
      });
      
      if (response.ok) {
        const data = await response.json();
        this.setBackendStatus(true, data);
        console.log('✅ [RouteHire Backend] Connected successfully', data);
        return true;
      } else {
        this.setBackendStatus(false, 'HTTP Error');
        console.warn('⚠️ [RouteHire Backend] HTTP Error:', response.status);
        return false;
      }
    } catch (error) {
      this.setBackendStatus(false, error.message);
      console.warn('❌ [RouteHire Backend] Connection Failed:', error.message);
      return false;
    }
  },

  /**
   * Set Backend Status in LocalStorage
   */
  setBackendStatus(isConnected, details = '') {
    const status = {
      connected: isConnected,
      timestamp: new Date().toISOString(),
      details: details
    };
    localStorage.setItem(this.STORAGE_KEYS.BACKEND_STATUS, JSON.stringify(status));
  },

  /**
   * Get Backend Status
   */
  getBackendStatus() {
    const status = localStorage.getItem(this.STORAGE_KEYS.BACKEND_STATUS);
    return status ? JSON.parse(status) : { connected: false, timestamp: null };
  },

  /**
   * Check if Backend is Available
   */
  isBackendAvailable() {
    return this.getBackendStatus().connected === true;
  },

  /**
   * Get Stored User
   */
  getStoredUser() {
    const user = localStorage.getItem(this.STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },

  /**
   * Get Stored Token
   */
  getStoredToken() {
    return localStorage.getItem(this.STORAGE_KEYS.TOKEN);
  },

  /**
   * Get User Role
   */
  getUserRole() {
    return localStorage.getItem(this.STORAGE_KEYS.ROLE) || this.ROLES.DRIVER;
  },

  /**
   * Save User Session
   */
  saveUserSession(user, token, role) {
    localStorage.setItem(this.STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(this.STORAGE_KEYS.ROLE, role);
  },

  /**
   * Clear User Session
   */
  clearUserSession() {
    localStorage.removeItem(this.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(this.STORAGE_KEYS.USER);
    localStorage.removeItem(this.STORAGE_KEYS.ROLE);
  },

  /**
   * Log Debug Information
   */
  log(message, type = 'info', data = null) {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = `[${timestamp}] [RouteHire] `;
    
    if (this.FEATURES.LOG_REQUESTS) {
      switch(type) {
        case 'error':
          console.error(prefix + message, data);
          break;
        case 'warning':
          console.warn(prefix + message, data);
          break;
        case 'success':
          console.log('%c' + prefix + message, 'color: green; font-weight: bold;', data);
          break;
        default:
          console.log(prefix + message, data);
      }
    }
  }
};

/**
 * Initialize Backend Connection on Page Load
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    RouteHireConfig.initBackendConnection();
  });
} else {
  RouteHireConfig.initBackendConnection();
}
