const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  operator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Operator',
    required: true
  },
  driverName: { type: String, required: true },
  driverImage: { type: String, default: '' },
  operatorName: { type: String, required: true },
  jobTitle: { type: String, required: true },
  route: { type: String, required: true },
  appliedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  status: {
    type: String,
    enum: ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED', 'RESUBMIT_DOCUMENTS'],
    default: 'APPLIED'
  },
  matchScore: { type: Number, default: 92 },
  rejectionReason: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);
