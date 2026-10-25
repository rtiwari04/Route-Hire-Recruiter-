const Driver = require('../models/Driver');
const Document = require('../models/document');
const User = require('../models/User');

// @desc    Get Driver Profile by User or Driver ID
// @route   GET /api/drivers/profile
// @access  Private
const getDriverProfile = async (req, res) => {
  try {
    let driver = await Driver.findOne({ user: req.user._id });
    if (!driver && req.query.id) {
      driver = await Driver.findById(req.query.id);
    }

    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver profile not found' });
    }

    const documents = await Document.find({ driver: driver._id });

    return res.json({
      success: true,
      driver,
      documents
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Driver Profile
// @route   PUT /api/drivers/profile
// @access  Private
const updateDriverProfile = async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.user._id });
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver profile not found' });
    }

    const allowedFields = ['availability', 'expectedSalary', 'routes', 'skills', 'languages', 'previousCompany', 'lastPosition'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        driver[field] = req.body[field];
      }
    });

    await driver.save();

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      driver
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDriverProfile,
  updateDriverProfile
};
