const Operator = require('../models/Oprator');
const User = require('../models/User');

// @desc    Get Current Operator Profile
// @route   GET /api/operators/profile
// @access  Private (Operator)
const getOperatorProfile = async (req, res) => {
  try {
    const operator = await Operator.findOne({ user: req.user._id });
    if (!operator) {
      return res.status(404).json({ success: false, message: 'Operator profile not found' });
    }
    return res.json({ success: true, operator });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getOperatorProfile
};
