const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  operator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Operator',
    required: true
  },
  operatorName: { type: String, required: true },
  operatorLogo: { type: String, default: '' },
  verifiedOperator: { type: Boolean, default: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  routes: [{ type: String }],
  salaryMin: { type: Number, required: true },
  salaryMax: { type: Number, required: true },
  salaryFormatted: { type: String, required: true },
  minExperience: { type: Number, default: 2 },
  vehicleTypes: [{ type: String }],
  vacancies: { type: Number, default: 5 },
  joining: { type: String, default: 'Immediate' },
  jobType: { type: String, default: 'Full-Time' },
  description: { type: String, required: true },
  responsibilities: [{ type: String }],
  requirements: [{ type: String }],
  benefits: [{ type: String }],
  status: {
    type: String,
    enum: ['ACTIVE', 'CLOSED'],
    default: 'ACTIVE'
  },
  postedDate: { type: String, default: 'Just now' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);
