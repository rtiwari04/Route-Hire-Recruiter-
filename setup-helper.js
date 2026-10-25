/* ==========================================================================
   RouteHire Frontend-Backend Connection Verification & Setup Helper
   Run this in the browser console to verify and troubleshoot the connection
   ========================================================================== */

window.RouteHireSetup = {
  /**
   * Run full verification suite
   */
  async runFullVerification() {
    console.clear();
    console.log('%c🚀 RouteHire Frontend-Backend Connection Verification', 'font-size: 16px; font-weight: bold; color: #0066cc;');
    console.log('=' .repeat(60));
    
    const results = {
      timestamp: new Date().toLocaleString(),
      checks: {}
    };

    // 1. Check if required libraries are loaded
    console.log('\n📋 Checking Required Libraries...');
    results.checks.config = this.checkConfig();
    results.checks.api = this.checkAPI();

    // 2. Check backend connectivity
    console.log('\n🔌 Checking Backend Connectivity...');
    results.checks.backendHealth = await this.checkBackendHealth();

    // 3. Check storage
    console.log('\n💾 Checking Local Storage...');
    results.checks.storage = this.checkStorage();

    // 4. Check API configuration
    console.log('\n⚙️ Checking API Configuration...');
    results.checks.apiConfig = this.checkAPIConfig();

    // 5. Summary
    console.log('\n' + '='.repeat(60));
    console.log('%c✅ VERIFICATION COMPLETE', 'font-size: 14px; font-weight: bold; color: #27ae60;');
    console.log('\n📊 Summary:');
    
    const passedChecks = Object.values(results.checks).filter(c => c.passed).length;
    const totalChecks = Object.values(results.checks).length;
    
    console.log(`   Passed: ${passedChecks}/${totalChecks}`);
    
    if (passedChecks === totalChecks) {
      console.log('%c✅ All checks passed! Frontend-Backend connection is configured correctly.', 'color: #27ae60; font-weight: bold;');
    } else {
      console.log('%c⚠️ Some checks failed. See details above for troubleshooting.', 'color: #e74c3c; font-weight: bold;');
    }

    return results;
  },

  /**
   * Check if RouteHireConfig is loaded
   */
  checkConfig() {
    const result = { passed: false, details: '' };
    
    if (typeof RouteHireConfig !== 'undefined') {
      console.log('  ✅ RouteHireConfig loaded');
      result.passed = true;
      result.details = `API Base URL: ${RouteHireConfig.API_BASE_URL}`;
    } else {
      console.log('  ❌ RouteHireConfig NOT loaded - Make sure js/config.js is loaded');
      result.details = 'Add: <script src="js/config.js"></script>';
    }
    
    return result;
  },

  /**
   * Check if RouteHireAPI is loaded
   */
  checkAPI() {
    const result = { passed: false, details: '' };
    
    if (typeof RouteHireAPI !== 'undefined') {
      console.log('  ✅ RouteHireAPI loaded');
      result.passed = true;
      result.details = 'API module ready for use';
    } else {
      console.log('  ❌ RouteHireAPI NOT loaded - Make sure js/api.js is loaded');
      result.details = 'Add: <script src="js/api.js"></script>';
    }
    
    return result;
  },

  /**
   * Check backend health
   */
  async checkBackendHealth() {
    const result = { passed: false, details: '', statusCode: null };
    
    try {
      const response = await fetch('http://localhost:5000/api/health', {
        method: 'GET'
      });
      
      result.statusCode = response.status;
      
      if (response.ok) {
        const data = await response.json();
        console.log('  ✅ Backend is online');
        result.passed = true;
        result.details = `Version: ${data.version || 'Unknown'}, Message: ${data.message}`;
      } else {
        console.log(`  ⚠️  Backend responded with status ${response.status}`);
        result.details = `HTTP Status: ${response.status}`;
      }
    } catch (error) {
      console.log('  ❌ Backend is OFFLINE or unreachable');
      result.details = `Error: ${error.message}`;
      result.passed = false;
      
      // Provide troubleshooting hints
      console.log('\n    🔧 Troubleshooting:');
      console.log('       1. Ensure MongoDB is running');
      console.log('       2. Start backend: cd backend/config && npm start');
      console.log('       3. Verify PORT=5000 in .env');
      console.log('       4. Check firewall settings');
    }
    
    return result;
  },

  /**
   * Check local storage
   */
  checkStorage() {
    const result = { passed: true, details: {} };
    
    const keys = {
      token: localStorage.getItem('routehire_token'),
      user: localStorage.getItem('routehire_user'),
      role: localStorage.getItem('routeHireRole'),
      status: localStorage.getItem('routehire_backend_status')
    };

    const hasValidSession = !!(keys.token && keys.user && keys.role);

    if (hasValidSession) {
      console.log('  ✅ Valid user session found');
      result.details.hasValidSession = true;
      
      try {
        const user = JSON.parse(keys.user);
        console.log(`     User: ${user.name || user.email || 'Unknown'}`);
        console.log(`     Role: ${keys.role}`);
        result.details.userInfo = user;
      } catch (e) {
        result.details.userInfoError = 'Invalid user JSON';
      }
    } else {
      console.log('  ℹ️  No user session found (User not logged in)');
      result.details.hasValidSession = false;
    }

    try {
      const status = JSON.parse(keys.status);
      console.log(`  📊 Backend Status: ${status.connected ? 'Connected' : 'Offline'}`);
      result.details.backendStatus = status;
    } catch (e) {
      console.log('  ℹ️  No backend status cached');
    }

    return result;
  },

  /**
   * Check API configuration
   */
  checkAPIConfig() {
    const result = { passed: true, details: {} };
    
    if (typeof RouteHireConfig === 'undefined') {
      result.passed = false;
      result.details.error = 'RouteHireConfig not loaded';
      return result;
    }

    console.log('  ✅ Configuration Details:');
    console.log(`     API Base URL: ${RouteHireConfig.API_BASE_URL}`);
    console.log(`     Backend URL: ${RouteHireConfig.BACKEND_URL}`);
    console.log(`     Port: ${RouteHireConfig.PORT}`);
    
    console.log('  ✅ Feature Flags:');
    console.log(`     Use Backend: ${RouteHireConfig.FEATURES.USE_BACKEND}`);
    console.log(`     Demo Mode: ${RouteHireConfig.FEATURES.USE_DEMO_MODE}`);
    console.log(`     Log Requests: ${RouteHireConfig.FEATURES.LOG_REQUESTS}`);

    result.details = {
      apiBaseUrl: RouteHireConfig.API_BASE_URL,
      backendUrl: RouteHireConfig.BACKEND_URL,
      port: RouteHireConfig.PORT,
      features: RouteHireConfig.FEATURES
    };

    return result;
  },

  /**
   * Test a specific API endpoint
   */
  async testAPIEndpoint(method = 'GET', endpoint = '/api/health', data = null) {
    console.log(`\n🧪 Testing API Endpoint: ${method} ${endpoint}`);
    console.log('=' .repeat(60));

    const url = `http://localhost:5000${endpoint}`;
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      console.log(`✅ Response Status: ${response.status} ${response.statusText}`);

      const responseData = await response.json();
      console.log('📦 Response Data:');
      console.table(responseData);

      return { success: true, status: response.status, data: responseData };
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      return { success: false, error: error.message };
    }
  },

  /**
   * Display helpful commands
   */
  showHelp() {
    console.clear();
    console.log('%c🆘 RouteHire Setup Help', 'font-size: 16px; font-weight: bold; color: #0066cc;');
    console.log('=' .repeat(60));
    
    console.log('\n📋 Available Commands:');
    console.log('');
    console.log('  // Run full verification');
    console.log('  RouteHireSetup.runFullVerification()');
    console.log('');
    console.log('  // Test specific endpoint');
    console.log('  RouteHireSetup.testAPIEndpoint("GET", "/api/health")');
    console.log('');
    console.log('  // Test login');
    console.log('  RouteHireSetup.testAPIEndpoint("POST", "/api/auth/login", {');
    console.log('    email: "driver@demo.com",');
    console.log('    password: "driver123",');
    console.log('    role: "driver"');
    console.log('  })');
    console.log('');
    console.log('  // Check current backend status');
    console.log('  RouteHireConfig.getBackendStatus()');
    console.log('');
    console.log('  // Get stored user');
    console.log('  RouteHireConfig.getStoredUser()');
    console.log('');
    console.log('  // Clear user session');
    console.log('  RouteHireConfig.clearUserSession()');
    console.log('');
    console.log('=' .repeat(60));
  },

  /**
   * Quick start guide
   */
  quickStart() {
    console.clear();
    console.log('%c🚀 RouteHire Quick Start Guide', 'font-size: 16px; font-weight: bold; color: #0066cc;');
    console.log('=' .repeat(60));

    console.log('\n1️⃣  Start MongoDB:');
    console.log('   mongod');

    console.log('\n2️⃣  Start Backend:');
    console.log('   cd backend/config');
    console.log('   npm install');
    console.log('   npm start');

    console.log('\n3️⃣  Access Frontend:');
    console.log('   http://localhost:5000');

    console.log('\n4️⃣  Verify Connection:');
    console.log('   RouteHireSetup.runFullVerification()');

    console.log('\n5️⃣  Test Login (Demo Credentials):');
    console.log('   Email: driver@demo.com');
    console.log('   Password: driver123');

    console.log('\n' + '='.repeat(60));
  }
};

// Log initialization message
console.log('%c✅ RouteHire Setup Helper Loaded', 'color: #27ae60; font-weight: bold;');
console.log('Type RouteHireSetup.showHelp() for available commands');
