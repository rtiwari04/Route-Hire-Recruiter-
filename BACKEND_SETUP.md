# RouteHire Backend - Setup & Running Guide

## 📋 Overview

This is the Node.js/Express backend for the RouteHire commercial driver recruitment platform. It provides REST APIs for driver management, job posting, applications, and admin operations.

---

## 🛠️ Prerequisites

Before running the backend, ensure you have:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (v6 or higher) - Comes with Node.js
- **MongoDB** (Local or Atlas account) - [Download Local](https://www.mongodb.com/try/download/community) or [Atlas Cloud](https://www.mongodb.com/cloud/atlas)
- **Postman** (Optional, for API testing) - [Download](https://www.postman.com/downloads/)

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend/config
npm install
```

This will install all required packages:
- express (web framework)
- mongoose (MongoDB ODM)
- cors (cross-origin requests)
- dotenv (environment variables)
- jsonwebtoken (JWT authentication)
- bcryptjs (password hashing)
- nodemailer (email sending)
- multer (file uploads)

### 2. Configure Environment Variables

The `.env` file is already created. Verify/update these settings:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/routehire_db
JWT_SECRET=routehire_super_secret_jwt_key_2026_production

# Email Configuration (Optional for now)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=notifications@routehire.com
EMAIL_PASSWORD=your_app_password_here
EMAIL_FROM="RouteHire Recruitment Team <notifications@routehire.com>"
```

### 3. Start MongoDB

#### Option A: Local MongoDB
```bash
# On Windows (if installed via MSI)
# MongoDB will auto-start, or manually start:
net start MongoDB

# Or if using homebrew on Mac
brew services start mongodb-community

# Or run mongod directly
mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Update `.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/routehire_db?retryWrites=true&w=majority
   ```

### 4. Start Backend Server

```bash
cd backend/config

# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

You should see:
```
=====================================================
[Server] RouteHire Backend Running on http://localhost:5000
[MongoDB] Connected: localhost / routehire_db
```

### 5. Verify Backend is Running

Open browser and go to:
```
http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "RouteHire Backend API Running Smoothly",
  "version": "1.0.0"
}
```

---

## 📁 Project Structure

```
backend/config/
├── Server.js                 # Main Express server
├── db.js                     # MongoDB connection
├── package.json              # Dependencies
├── .env                      # Environment variables ⚠️ DO NOT COMMIT
│
├── controller/               # Route handlers (business logic)
│   ├── AuthController.js
│   ├── DriverControler.js
│   ├── OperatorController.js
│   ├── JobController.js
│   ├── ApplicationController.js
│   ├── DocumentController.js
│   └── AdminController.js
│
├── Routes/                   # API route definitions
│   ├── AuthRoutes.js
│   ├── DriverRoutes.js
│   ├── OpratorRoutes.js
│   ├── JobsRoutes.js
│   ├── ApplicationRoutes.js
│   ├── DocumentRoutes.js
│   └── AdminRoutes.js
│
├── models/                   # MongoDB schemas
│   ├── User.js
│   ├── Driver.js
│   ├── Oprator.js
│   ├── Job.js
│   ├── Application.js
│   ├── Document.js
│   ├── Auditlogs.js
│   └── Notification.js
│
├── Middleware/               # Custom middleware
│   ├── AuthMiddleware.js     # JWT verification
│   ├── AdminMiddleware.js    # Admin-only routes
│   └── uploadMiddleware.js   # File upload handling
│
└── utils/                    # Utility functions
    ├── EmailServices.js
    └── SeedData.js
```

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/login              # User login
POST   /api/auth/register/driver    # Driver registration
POST   /api/auth/register/operator  # Operator registration
```

### Jobs
```
GET    /api/jobs                    # Get all jobs
POST   /api/jobs                    # Create new job (operator)
GET    /api/jobs/:id                # Get job details
POST   /api/jobs/:id/apply          # Apply for job (driver)
```

### Applications
```
GET    /api/applications/my         # My applications
PUT    /api/applications/:id/status # Update application status
```

### Admin
```
GET    /api/admin/stats             # Dashboard statistics
GET    /api/admin/drivers           # All drivers
PUT    /api/admin/drivers/:id/approve
PUT    /api/admin/drivers/:id/reject
```

### Documents
```
POST   /api/documents/upload        # Upload document
GET    /api/documents/:id           # Get document
```

---

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. User logs in with credentials
2. Backend validates and returns JWT token
3. Frontend stores token in localStorage
4. Token sent with each API request in `Authorization: Bearer <token>` header
5. Backend validates token on protected routes

### Test Login Flow

```bash
# 1. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "driver@demo.com",
    "password": "driver123",
    "role": "driver"
  }'

# Response includes token:
# {
#   "success": true,
#   "token": "eyJhbGc...",
#   "user": { ... }
# }

# 2. Use token in subsequent requests
curl -X GET http://localhost:5000/api/applications/my \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## 🗄️ Database Seeding

Pre-populate database with demo data:

```bash
npm run seed
```

This creates:
- Demo drivers and operators
- Sample job listings
- Application records

---

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### "ECONNREFUSED" or "Connection refused"
```bash
# MongoDB not running
# Start MongoDB:
mongod

# Or check if MongoDB service is running:
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
```

### "Port 5000 already in use"
```bash
# Kill process using port 5000:
# Windows: netstat -ano | findstr :5000
#         taskkill /PID <PID> /F
# Mac/Linux: lsof -ti:5000 | xargs kill -9
```

### Frontend can't reach backend
1. Verify backend is running: `http://localhost:5000/api/health`
2. Check CORS is enabled in `Server.js`
3. Verify frontend API_BASE_URL matches: `http://localhost:5000/api`
4. Check browser console for error messages

### Emails not sending
1. Ensure EMAIL_USER and EMAIL_PASSWORD are correct in `.env`
2. For Gmail, use [App Password](https://myaccount.google.com/apppasswords) instead of account password
3. Check EMAIL_HOST and EMAIL_PORT settings

---

## 📊 Testing with Postman

1. Import API collection (if available)
2. Set environment variables:
   - `baseUrl`: http://localhost:5000
   - `token`: (paste JWT token from login response)
3. Test endpoints:
   - Health check
   - Login
   - Create job
   - Apply for job
   - Admin operations

---

## 🔄 Development Workflow

### Add New Endpoint

1. Create controller method in `controller/YourController.js`
2. Add route in `Routes/YourRoutes.js`
3. Import and use in `Server.js`
4. Test with curl or Postman
5. Document in API reference

### Example:
```javascript
// Controller
exports.newEndpoint = async (req, res) => {
  try {
    // Business logic
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Route
router.post('/new', AuthMiddleware.verifyToken, controller.newEndpoint);

// Use in Server.js
app.use('/api/your', require('./Routes/YourRoutes'));
```

---

## 📝 Logging

All API calls are logged to console with timestamps:
- `[Server]` - Server events
- `[MongoDB]` - Database operations
- `[Auth]` - Authentication events
- `[API]` - API requests/responses

### Enable debug mode:
```javascript
// In Server.js
if (process.env.DEBUG) {
  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.path}`);
    next();
  });
}
```

```bash
DEBUG=true npm start
```

---

## 🚀 Production Deployment

Before deploying:

1. **Update .env for production**
   - Change JWT_SECRET to secure random string
   - Use MongoDB Atlas instead of local
   - Set NODE_ENV=production
   - Update CORS allowed origins

2. **Install production dependencies only**
   ```bash
   npm install --production
   ```

3. **Run with process manager**
   ```bash
   npm install -g pm2
   pm2 start Server.js --name routehire-api
   ```

4. **Setup reverse proxy** (nginx/Apache)
   - Proxy requests to localhost:5000
   - Handle SSL/TLS certificates
   - Setup rate limiting

5. **Monitor logs**
   ```bash
   pm2 logs routehire-api
   ```

---

## 📞 Support & Debugging

### Enable verbose logging:
```javascript
// Add to top of Server.js
const debug = require('debug')('routehire:*');
```

### Check server status:
```bash
curl http://localhost:5000/api/health
```

### View MongoDB data:
```bash
# Open MongoDB shell
mongosh

# List databases
show dbs

# Use routehire database
use routehire_db

# Show collections
show collections

# View documents
db.users.find()
```

---

## 📚 Resources

- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [JWT Guide](https://jwt.io/introduction)
- [CORS Documentation](https://enable-cors.org/)

---

**Version**: 1.0.0  
**Last Updated**: 2026-09-14  
**Status**: ✅ Ready for Development
