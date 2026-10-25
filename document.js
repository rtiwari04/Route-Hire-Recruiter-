const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  documentType: {
    type: String,
    enum: ['licence', 'aadhaar', 'medical', 'police', 'experience'],
    required: true
  },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['PENDING', 'VERIFIED', 'REJECTED', 'RESUBMIT_REQUIRED'],
    default: 'PENDING'
  },
  rejectionReason: { type: String, default: '' },
  adminNotes: { type: String, default: '' }
});

module.exports = mongoose.model('Document', documentSchema);
