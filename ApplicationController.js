const Application = require('../models/Application');
const Driver = require('../models/Driver');
const Operator = require('../models/Oprator');
const User = require('../models/User');
const Job = require('../models/Job');
const { sendShortlistedEmail, sendSelectedEmail, sendRejectionEmail } = require('../utils/EmailServices');

// @desc    Get Applications for Current Logged in Driver
// @route   GET /api/applications/my
// @access  Private (Driver)
const getMyApplications = async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.user._id });
    if (!driver) {
      return res.json({ success: true, applications: [] });
    }

    const applications = await Application.find({ driver: driver._id }).populate('job').sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Applications for Current Operator's Jobs
// @route   GET /api/applications/operator
// @access  Private (Operator)
const getOperatorApplications = async (req, res) => {
  try {
    const operator = await Operator.findOne({ user: req.user._id });
    const query = operator ? { operator: operator._id } : {};

    const applications = await Application.find(query).populate('driver').populate('job').sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Application Status & Trigger Automated Email
// @route   PUT /api/applications/:id/status
// @access  Private (Operator/Admin)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, reason } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.status = status;
    if (reason) application.rejectionReason = reason;

    await application.save();

    // Fetch Driver User and Job for email notification
    const driverProfile = await Driver.findById(application.driver).populate('user');
    const job = await Job.findById(application.job);

    if (driverProfile && driverProfile.user) {
      if (status === 'SHORTLISTED') {
        sendShortlistedEmail(driverProfile.user, job).catch(e => console.error('[Email Error]:', e));
      } else if (status === 'SELECTED') {
        sendSelectedEmail(driverProfile.user, job).catch(e => console.error('[Email Error]:', e));
      } else if (status === 'REJECTED') {
        sendRejectionEmail(driverProfile.user, reason).catch(e => console.error('[Email Error]:', e));
      }
    }

    return res.json({
      success: true,
      message: `Application status updated to ${status}`,
      application
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyApplications,
  getOperatorApplications,
  updateApplicationStatus
};
