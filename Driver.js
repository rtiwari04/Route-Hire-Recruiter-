const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fatherName: { type: String, default: '' },
  dob: { type: String, default: '' },
  gender: { type: String, default: 'Male' },
  address: { type: String, default: '' },
  city: { type: String, required: true },
  state: { type: String, required: true },
  licenceNumber: { type: String, required: true },
  badgeNumber: { type: String, default: '' },
  licenceExpiry: { type: String, default: '' },
  totalExperience: { type: Number, required: true, default: 1 },
  previousCompany: { type: String, default: '' },
  lastPosition: { type: String, default: '' },
  expectedSalary: { type: String, default: '₹35,000 / month' },
  vehicleExperience: [{ type: String }],
  routes: [{
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    experienceYears: { type: Number, default: 1 },
    trips: { type: Number, default: 50 }
  }],
  skills: [{ type: String }],
  languages: [{ type: String }],
  availability: {
    type: String,
    enum: ['Available', 'Currently Working', 'Available Soon', 'Not Available'],
    default: 'Available'
  },
  profileImage: { type: String, default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  driverScore: { type: Number, default: 85 },
  rating: { type: Number, default: 4.8 },
  verificationStatus: {
    type: String,
    enum: ['PENDING_VERIFICATION', 'VERIFIED', 'SHORTLISTED', 'SELECTED', 'REJECTED', 'RESUBMIT_REQUIRED'],
    default: 'PENDING_VERIFICATION'
  },
  rejectionReason: { type: String, default: '' },
  resubmitReason: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Driver', driverSchema);
