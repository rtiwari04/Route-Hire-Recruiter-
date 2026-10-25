const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Operator = require('../models/Oprator');
const { sendApprovalEmail } = require('../utils/EmailServices');

// Generate JWT Token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'routehire_super_secret_jwt_key_2026_production', {
    expiresIn: '30d'
  });
};

// @desc    Register Driver
// @route   POST /api/auth/register/driver
// @access  Public
const registerDriver = async (req, res) => {
  try {
    const {
      name, email, phone, password,
      fatherName, dob, gender, address, city, state,
      licenceNumber, badgeNumber, licenceExpiry, totalExperience,
      previousCompany, lastPosition, expectedSalary, vehicleExperience,
      routes, skills, languages, availability
    } = req.body;

    if (!name || !email || !phone || !password || !city || !licenceNumber) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Create User account
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: 'driver',
      status: 'PENDING_VERIFICATION'
    });

    // Create Driver profile
    const driver = await Driver.create({
      user: user._id,
      fatherName,
      dob,
      gender,
      address,
      city,
      state,
      licenceNumber,
      badgeNumber,
      licenceExpiry,
      totalExperience: Number(totalExperience) || 1,
      previousCompany,
      lastPosition,
      expectedSalary,
      vehicleExperience: Array.isArray(vehicleExperience) ? vehicleExperience : [vehicleExperience].filter(Boolean),
      routes: Array.isArray(routes) ? routes : [],
      skills: Array.isArray(skills) ? skills : [],
      languages: Array.isArray(languages) ? languages : [],
      availability: availability || 'Available',
      verificationStatus: 'PENDING_VERIFICATION'
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Driver registration successful. Profile under verification.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      },
      driver
    });
  } catch (error) {
    console.error('[Register Driver Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register Operator
// @route   POST /api/auth/register/operator
// @access  Public
const registerOperator = async (req, res) => {
  try {
    const {
      companyName, contactPerson, email, phone, password,
      gstNumber, fleetSize, companyType, address, city, state
    } = req.body;

    if (!companyName || !email || !phone || !password || !city) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const user = await User.create({
      name: companyName,
      email,
      phone,
      password,
      role: 'operator',
      status: 'PENDING_VERIFICATION'
    });

    const operator = await Operator.create({
      user: user._id,
      companyName,
      contactPerson,
      gstNumber,
      fleetSize,
      companyType,
      address,
      city,
      state,
      verificationStatus: 'PENDING_VERIFICATION'
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Operator registration successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      },
      operator
    });
  } catch (error) {
    console.error('[Register Operator Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter email/mobile and password' });
    }

    const identifier = email.trim();
    const phoneDigits = identifier.replace(/\D/g, '');
    const phonePattern = phoneDigits.length >= 7 && phoneDigits.length <= 15
      ? new RegExp(`${phoneDigits.split('').join('\\D*')}$`)
      : null;
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { phone: identifier },
        ...(phonePattern ? [{ phone: phonePattern }] : [])
      ]
    }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Role check if specific role passed
    if (role && user.role !== role) {
      return res.status(401).json({ success: false, message: `Account is registered as ${user.role}, not ${role}` });
    }

    const token = generateToken(user._id);

    let profile = null;
    if (user.role === 'driver') {
      profile = await Driver.findOne({ user: user._id });
    } else if (user.role === 'operator') {
      profile = await Operator.findOne({ user: user._id });
    }

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status
      },
      profile
    });
  } catch (error) {
    console.error('[Login Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Current Logged in User
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = req.user;
    let profile = null;

    if (user.role === 'driver') {
      profile = await Driver.findOne({ user: user._id });
    } else if (user.role === 'operator') {
      profile = await Operator.findOne({ user: user._id });
    }

    return res.json({
      success: true,
      user,
      profile
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerDriver,
  registerOperator,
  loginUser,
  getMe
};
