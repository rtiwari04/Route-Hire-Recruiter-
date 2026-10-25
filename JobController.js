const Job = require('../models/Job');
const Operator = require('../models/Oprator');
const Application = require('../models/Application');
const Driver = require('../models/Driver');
const User = require('../models/User');
const { sendApplicationConfirmationEmail } = require('../utils/EmailServices');

// @desc    Get All Jobs with Search & Filter
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const { query, location, minExp, vehicle } = req.query;
    let filter = { status: 'ACTIVE' };

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (minExp) {
      filter.minExperience = { $lte: Number(minExp) };
    }

    if (vehicle) {
      filter.vehicleTypes = { $in: [new RegExp(vehicle, 'i')] };
    }

    let jobs = await Job.find(filter).sort({ createdAt: -1 });

    if (query) {
      const q = query.toLowerCase();
      jobs = jobs.filter(j => 
        j.title.toLowerCase().includes(q) ||
        j.operatorName.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.routes.some(r => r.toLowerCase().includes(q))
      );
    }

    return res.json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Single Job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job requirement not found' });
    }
    return res.json({ success: true, job });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Job Requirement (Operator/Admin)
// @route   POST /api/jobs
// @access  Private (Operator/Admin)
const createJob = async (req, res) => {
  try {
    const { title, location, routes, salaryMin, salaryMax, minExperience, vehicleTypes, vacancies, joining, description, responsibilities, requirements, benefits } = req.body;

    let operator = await Operator.findOne({ user: req.user._id });
    let operatorName = operator ? operator.companyName : (req.user.name || 'RouteHire Operator');

    const job = await Job.create({
      operator: operator ? operator._id : req.user._id,
      operatorName,
      operatorLogo: operator ? operator.companyLogo : '',
      verifiedOperator: true,
      title: title || 'Professional Bus Driver',
      location: location || 'Nagpur, Maharashtra',
      routes: Array.isArray(routes) ? routes : [routes].filter(Boolean),
      salaryMin: Number(salaryMin) || 30000,
      salaryMax: Number(salaryMax) || 35000,
      salaryFormatted: `₹${Number(salaryMin || 30000).toLocaleString('en-IN')} – ₹${Number(salaryMax || 35000).toLocaleString('en-IN')} / Month`,
      minExperience: Number(minExperience) || 2,
      vehicleTypes: Array.isArray(vehicleTypes) ? vehicleTypes : ['Volvo', 'AC Sleeper'],
      vacancies: Number(vacancies) || 5,
      joining: joining || 'Immediate',
      description: description || 'Driver recruitment requirement.',
      responsibilities: Array.isArray(responsibilities) ? responsibilities : ['Safely operate assigned bus.'],
      requirements: Array.isArray(requirements) ? requirements : ['Valid Heavy Commercial Driving Licence'],
      benefits: Array.isArray(benefits) ? benefits : ['Accommodation provided']
    });

    return res.status(201).json({
      success: true,
      message: 'Driver hiring requirement posted successfully',
      job
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply for Job Requirement
// @route   POST /api/jobs/:id/apply
// @access  Private (Driver)
const applyJob = async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.user._id });
    if (!driver) {
      return res.status(400).json({ success: false, message: 'Driver profile required to apply for jobs' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job requirement not found' });
    }

    // Check duplicate application
    const existingApp = await Application.findOne({ driver: driver._id, job: job._id });
    if (existingApp) {
      return res.status(400).json({ success: false, message: 'You have already applied for this requirement' });
    }

    const application = await Application.create({
      driver: driver._id,
      job: job._id,
      operator: job.operator,
      driverName: req.user.name,
      driverImage: driver.profileImage,
      operatorName: job.operatorName,
      jobTitle: job.title,
      route: job.routes && job.routes[0] ? job.routes[0] : 'Assigned Route',
      status: 'APPLIED',
      matchScore: 92
    });

    // Trigger confirmation email asynchronously
    sendApplicationConfirmationEmail(req.user, job).catch(err => console.error('[Email Error]:', err));

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  applyJob
};
