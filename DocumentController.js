const Document = require('../models/document');
const Driver = require('../models/Driver');
const User = require('../models/User');
const { sendResubmitDocumentEmail } = require('../utils/EmailServices');

// @desc    Upload Driver Verification Document
// @route   POST /api/documents/upload
// @access  Private (Driver)
const uploadDocument = async (req, res) => {
  try {
    const { documentType } = req.body;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a file to upload' });
    }

    const driver = await Driver.findOne({ user: req.user._id });
    if (!driver) {
      return res.status(400).json({ success: false, message: 'Driver profile required' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    let document = await Document.findOne({ driver: driver._id, documentType });
    if (document) {
      document.fileName = req.file.originalname;
      document.fileUrl = fileUrl;
      document.status = 'PENDING';
      document.rejectionReason = '';
      await document.save();
    } else {
      document = await Document.create({
        driver: driver._id,
        documentType,
        fileName: req.file.originalname,
        fileUrl,
        status: 'PENDING'
      });
    }

    return res.status(201).json({
      success: true,
      message: `${documentType.toUpperCase()} uploaded successfully`,
      document
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin Verify or Request Resubmission for Document
// @route   PUT /api/documents/:id/verify
// @access  Private (Admin)
const updateDocumentStatus = async (req, res) => {
  try {
    const { status, reason, notes } = req.body;
    const document = await Document.findById(req.params.id).populate('driver');

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    document.status = status;
    if (reason) document.rejectionReason = reason;
    if (notes) document.adminNotes = notes;
    await document.save();

    const driver = document.driver;
    if (driver && status === 'RESUBMIT_REQUIRED') {
      driver.verificationStatus = 'RESUBMIT_REQUIRED';
      driver.resubmitReason = reason || 'Document image unclear';
      await driver.save();

      const user = await User.findById(driver.user);
      if (user) {
        sendResubmitDocumentEmail(user, document.documentType, reason).catch(e => console.error('[Email Error]:', e));
      }
    }

    return res.json({
      success: true,
      message: `Document status updated to ${status}`,
      document
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadDocument,
  updateDocumentStatus
};
