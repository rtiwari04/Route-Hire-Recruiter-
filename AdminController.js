const User = require('../models/User');
const Driver = require('../models/Driver');
const Operator = require('../models/Oprator');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Document = require('../models/document');
const AuditLog = require('../models/Auditlogs');
const { sendApprovalEmail, sendRejectionEmail, sendResubmitDocumentEmail } = require('../utils/EmailServices');

// @desc    Get Admin Dashboard Statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const totalDrivers = await Driver.countDocuments();
    const pendingDrivers = await Driver.countDocuments({ verificationStatus: 'PENDING_VERIFICATION' });
    const verifiedDrivers = await Driver.countDocuments({ verificationStatus: 'VERIFIED' });
    const rejectedDrivers = await Driver.countDocuments({ verificationStatus: 'REJECTED' });
    const shortlistedDrivers = await Driver.countDocuments({ verificationStatus: 'SHORTLISTED' });

    const totalOperators = await Operator.countDocuments();
    const verifiedOperators = await Operator.countDocuments({ verificationStatus: 'VERIFIED' });
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const selectedCandidates = await Application.countDocuments({ status: 'SELECTED' });
    const pendingDocuments = await Document.countDocuments({ status: 'PENDING' });

    return res.json({
      success: true,
      stats: {
        totalDrivers,
        pendingDrivers,
        verifiedDrivers,
        rejectedDrivers,
        shortlistedDrivers,
        totalOperators,
        verifiedOperators,
        totalJobs,
        totalApplications,
        selectedCandidates,
        pendingDocuments
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Drivers for Admin
// @route   GET /api/admin/drivers
// @access  Private (Admin)
const getAdminDrivers = async (req, res) => {
  try {
    const { status, query } = req.query;
    let filter = {};

    if (status && status !== 'All') {
      filter.verificationStatus = status;
    }

    let drivers = await Driver.find(filter).populate('user').sort({ createdAt: -1 });

    if (query) {
      const q = query.toLowerCase();
      drivers = drivers.filter(d =>
        d.user.name.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        d.licenceNumber.toLowerCase().includes(q)
      );
    }

    return res.json({
      success: true,
      count: drivers.length,
      drivers
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve Driver Profile & Verify All Documents
// @route   PUT /api/admin/drivers/:id/approve
// @access  Private (Admin)
const approveDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id).populate('user');
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    driver.verificationStatus = 'VERIFIED';
    await driver.save();

    // Verify all driver documents
    await Document.updateMany({ driver: driver._id }, { status: 'VERIFIED' });

    if (driver.user) {
      driver.user.status = 'VERIFIED';
      await driver.user.save();

      // Trigger automatic approval email via Nodemailer
      sendApprovalEmail(driver.user).catch(e => console.error('[Email Error]:', e));
    }

    // Audit Log
    await AuditLog.create({
      admin: req.user ? req.user._id : null,
      action: 'APPROVE_DRIVER_ALL_OK',
      targetUser: driver.user ? driver.user.name : driver.licenceNumber,
      targetType: 'Driver',
      details: 'Everything OK - All documents verified & driver profile approved by admin.'
    });

    return res.json({
      success: true,
      message: 'Driver profile & all documents verified. Confirmation email sent.',
      driver
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject Driver Profile
// @route   PUT /api/admin/drivers/:id/reject
// @access  Private (Admin)
const rejectDriver = async (req, res) => {
  try {
    const { reason } = req.body;
    const driver = await Driver.findById(req.params.id).populate('user');
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    driver.verificationStatus = 'REJECTED';
    driver.rejectionReason = reason || 'Documentation mismatch';
    await driver.save();

    // Update documents to REJECTED
    await Document.updateMany({ driver: driver._id }, { status: 'REJECTED', rejectionReason: reason || 'Audit rejected' });

    if (driver.user) {
      driver.user.status = 'REJECTED';
      await driver.user.save();

      sendRejectionEmail(driver.user, reason).catch(e => console.error('[Email Error]:', e));
    }

    await AuditLog.create({
      admin: req.user ? req.user._id : null,
      action: 'REJECT_DRIVER',
      targetUser: driver.user ? driver.user.name : driver.licenceNumber,
      targetType: 'Driver',
      details: 'Driver profile rejected by admin.',
      reason: reason || ''
    });

    return res.json({
      success: true,
      message: 'Driver profile rejected & email sent to user.',
      driver
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get System Audit Logs
// @route   GET /api/admin/audit-logs
// @access  Private (Admin)
const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().populate('admin', 'name email').sort({ createdAt: -1 }).limit(50);
    return res.json({ success: true, logs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAdminDrivers,
  approveDriver,
  rejectDriver,
  getAuditLogs
};
