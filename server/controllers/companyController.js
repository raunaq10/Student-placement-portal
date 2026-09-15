const Company = require("../models/Company");
const Job = require("../models/Job");

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public / Authenticated
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate("recruiterId", "name email").sort({ name: 1 });

    // Attach active jobs count
    const jobs = await Job.find({ status: "Active" });
    const companyJobsCount = {};
    jobs.forEach((j) => {
      const cId = j.companyId.toString();
      companyJobsCount[cId] = (companyJobsCount[cId] || 0) + 1;
    });

    const enriched = companies.map((c) => ({
      ...c.toObject(),
      activeJobsCount: companyJobsCount[c._id.toString()] || 0,
    }));

    return res.json({ success: true, count: enriched.length, companies: enriched });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single company
// @route   GET /api/companies/:id
// @access  Public / Authenticated
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate("recruiterId", "name email");
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    const jobs = await Job.find({ companyId: company._id }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      company,
      jobs,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new company
// @route   POST /api/companies
// @access  Private (Admin, Recruiter)
const createCompany = async (req, res) => {
  try {
    const { name, industry, description, website, location, contactEmail, contactPhone, logoUrl } =
      req.body;

    const existing = await Company.findOne({ name });
    if (existing) {
      return res.status(400).json({ success: false, message: "Company already exists" });
    }

    const company = await Company.create({
      name,
      industry,
      description,
      website,
      location,
      recruiterId: req.user._id,
      contactEmail: contactEmail || req.user.email,
      contactPhone,
      logoUrl,
    });

    return res.status(201).json({ success: true, company });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private (Admin, Recruiter)
const updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    // Allow admin or the recruiter who created it
    if (
      req.user.role !== "admin" &&
      company.recruiterId &&
      company.recruiterId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: "Not authorized to update this company" });
    }

    const updated = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.json({ success: true, company: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Private (Admin)
const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    await Job.deleteMany({ companyId: company._id });
    await company.deleteOne();

    return res.json({ success: true, message: "Company and related jobs removed" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
};
