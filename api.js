/* ==========================================================================
   RouteHire Frontend REST API Client Module
   Connected to Backend Express API on http://localhost:5000
   ========================================================================== */

// Fallback if config.js is not loaded
const API_BASE_URL = (typeof RouteHireConfig !== 'undefined') 
  ? RouteHireConfig.API_BASE_URL 
  : 'http://localhost:5000/api';

const RouteHireAPI = {
  // Helper for Headers
  getHeaders(isJSON = true) {
    const headers = {};
    if (isJSON) headers['Content-Type'] = 'application/json';
    
    // Get token from config if available, otherwise from localStorage
    let token;
    if (typeof RouteHireConfig !== 'undefined') {
      token = RouteHireConfig.getStoredToken();
    } else {
      token = localStorage.getItem('routehire_token');
    }
    
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  },

  /**
   * Handle API Response Errors
   */
  async handleResponse(response, context = '') {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`${context}: ${error.message || response.statusText}`);
    }
    return await response.json();
  },

  // 1. Auth APIs
  async registerDriver(driverData) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register/driver`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(driverData)
      });
      const data = await res.json();
      if (typeof RouteHireConfig !== 'undefined') {
        RouteHireConfig.log('Driver registered successfully', 'success', data);
      }
      return data;
    } catch (e) {
      console.warn('❌ [API Registration Error]', e.message);
      console.warn('Falling back to demo registration mode...');
      return { success: true, message: 'Driver registered (Demo Mode - Backend Unavailable)' };
    }
  },

  async registerOperator(operatorData) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register/operator`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(operatorData)
      });
      const data = await res.json();
      if (typeof RouteHireConfig !== 'undefined') {
        RouteHireConfig.log('Operator registered successfully', 'success', data);
      }
      return data;
    } catch (e) {
      console.warn('❌ [API Registration Error]', e.message);
      return { success: true, message: 'Operator registered (Demo Mode - Backend Unavailable)' };
    }
  },

  async login(credentials) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(credentials)
      });
      
      const data = await res.json();
      
      if (data.success && data.token && data.user) {
        // Use config if available, otherwise fallback to localStorage
        if (typeof RouteHireConfig !== 'undefined') {
          RouteHireConfig.saveUserSession(data.user, data.token, data.user.role);
        } else {
          localStorage.setItem('routehire_token', data.token);
          localStorage.setItem('routeHireRole', data.user.role);
          localStorage.setItem('routehire_user', JSON.stringify(data.user));
        }
        
        if (typeof RouteHireConfig !== 'undefined') {
          RouteHireConfig.log('Login successful', 'success', data.user);
        } else {
          console.log('✅ Login successful:', data.user);
        }
      }
      return data;
    } catch (e) {
      console.warn('❌ [API Login Error]', e.message);
      if (credentials && credentials.role === 'admin') {
        throw new Error(`Cannot reach the RouteHire API at ${API_BASE_URL}. Start the backend from backend/config with "npm start" and make sure MongoDB is running.`);
      }
      console.warn('Falling back to demo authentication mode...');
      return null;
    }
  },

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getHeaders(false)
    });
    return this.handleResponse(response, 'Session verification');
  },

  // 2. Jobs APIs
  async getJobs(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/jobs?${queryString}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (typeof RouteHireConfig !== 'undefined') {
        RouteHireConfig.log('Jobs fetched successfully', 'success', `Count: ${data.length || 0}`);
      }
      return data;
    } catch (e) {
      console.warn('⚠️ [API Jobs Error] Failed to fetch jobs:', e.message);
      return null; // Fallback to demo data or empty array
    }
  },

  async applyJob(jobId) {
    try {
      const res = await fetch(`${API_BASE_URL}/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: this.getHeaders()
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (typeof RouteHireConfig !== 'undefined') {
        RouteHireConfig.log('Job application submitted', 'success', { jobId });
      }
      return data;
    } catch (e) {
      console.warn('⚠️ [API Apply Error]', e.message);
      return { success: true, message: 'Application submitted (Demo Mode)' };
    }
  },

  async createJob(jobData) {
    try {
      const res = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(jobData)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (typeof RouteHireConfig !== 'undefined') {
        RouteHireConfig.log('Job created successfully', 'success', data);
      }
      return data;
    } catch (e) {
      console.warn('⚠️ [API Create Job Error]', e.message);
      return { success: true, message: 'Job posted (Demo Mode)' };
    }
  },

  // 3. Applications APIs
  async getMyApplications() {
    try {
      const res = await fetch(`${API_BASE_URL}/applications/my`, {
        headers: this.getHeaders()
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (typeof RouteHireConfig !== 'undefined') {
        RouteHireConfig.log('Applications fetched', 'success', `Count: ${data.length || 0}`);
      }
      return data;
    } catch (e) {
      console.warn('⚠️ [API Applications Error]', e.message);
      return null;
    }
  },

  async updateApplicationStatus(appId, status, reason = '') {
    try {
      const res = await fetch(`${API_BASE_URL}/applications/${appId}/status`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ status, reason })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (typeof RouteHireConfig !== 'undefined') {
        RouteHireConfig.log('Application status updated', 'success', { appId, status });
      }
      return data;
    } catch (e) {
      console.warn('⚠️ [API Status Update Error]', e.message);
      return { success: true, message: `Status updated to ${status} (Demo Mode)` };
    }
  },

  // 4. Admin APIs
  async getAdminStats() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: this.getHeaders()
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (typeof RouteHireConfig !== 'undefined') {
        RouteHireConfig.log('Admin stats fetched', 'success');
      }
      return data;
    } catch (e) {
      console.warn('⚠️ [API Admin Stats Error]', e.message);
      return null;
    }
  },

  async approveDriver(driverId) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/drivers/${driverId}/approve`, {
        method: 'PUT',
        headers: this.getHeaders()
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (typeof RouteHireConfig !== 'undefined') {
        RouteHireConfig.log('Driver approved', 'success', { driverId });
      }
      return data;
    } catch (e) {
      console.warn('⚠️ [API Driver Approval Error]', e.message);
      return { success: true, message: 'Driver approved (Demo Mode)' };
    }
  },

  async rejectDriver(driverId, reason = '') {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/drivers/${driverId}/reject`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ reason })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (typeof RouteHireConfig !== 'undefined') {
        RouteHireConfig.log('Driver rejected', 'info', { driverId });
      }
      return data;
    } catch (e) {
      console.warn('⚠️ [API Driver Rejection Error]', e.message);
      return { success: true, message: 'Driver rejected (Demo Mode)' };
    }
  }
};
