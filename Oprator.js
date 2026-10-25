const mongoose = require('mongoose');

const operatorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: { type: String, required: true },
  companyLogo: { type: String, default: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=150&q=80' },
  contactPerson: { type: String, required: true },
  gstNumber: { type: String, default: '' },
  fleetSize: { type: String, default: '10-50 Buses' },
  companyType: { type: String, default: 'Intercity Bus Operator' },
  address: { type: String, default: '' },
  city: { type: String, required: true },
  state: { type: String, required: true },
  verificationStatus: {
    type: String,
    enum: ['PENDING_VERIFICATION', 'VERIFIED', 'REJECTED'],
    default: 'PENDING_VERIFICATION'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Operator', operatorSchema);
