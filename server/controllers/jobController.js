const Job = require("../models/Job");
const Company = require("../models/Company");
const StudentProfile = require("../models/StudentProfile");
const Application = require("../models/Application");

// Helper function to evaluate eligibility
const evaluateStudentEligibility = (profile, job) => {
  const checklist = [];
  const reasons = [];

  // 1. CGPA Check
  const cgpaPassed = profile.cgpa >= job.minimumCGPA;
  checklist.push({
    criteria: "CGPA",
    required: `${job.minimumCGPA}+`,
    studentValue: profile.cgpa,
    passed: cgpaPassed,
  });
  if (!cgpaPassed) {
    reasons.push(`CGPA is ${profile.cgpa}, required minimum is ${job.minimumCGPA}`);
  }

  // 2. Max Backlogs Check
  const backlogsPassed = profile.backlogs <= job.maxBacklogs;
  checklist.push({
    criteria: "Active Backlogs",
    required: `<= ${job.maxBacklogs}`,
    studentValue: profile.backlogs,
    passed: backlogsPassed,
  });
  if (!backlogsPassed) {
    reasons.push(`You have ${profile.backlogs} backlogs; maximum allowed is ${job.maxBacklogs}`);
  }

  // 3. 10th Percentage Check
  const tenthPassed = (profile.tenthPercentage || 0) >= (job.minTenthPercentage || 0);
  checklist.push({
    criteria: "10th Percentage",
    required: `${job.minTenthPercentage || 0}%+`,
    studentValue: `${profile.tenthPercentage || 0}%`,
    passed: tenthPassed,
  });
  if (!tenthPassed) {
    reasons.push(`10th score (${profile.tenthPercentage}%) is below requirement (${job.minTenthPercentage}%)`);
  }

  // 4. 12th Percentage Check
  const twelfthPassed = (profile.twelfthPercentage || 0) >= (job.minTwelfthPercentage || 0);
  checklist.push({
    criteria: "12th Percentage",
    required: `${job.minTwelfthPercentage || 0}%+`,
    studentValue: `${profile.twelfthPercentage || 0}%`,
    passed: twelfthPassed,
  });
  if (!twelfthPassed) {
    reasons.push(`12th score (${profile.twelfthPercentage}%) is below requirement (${job.minTwelfthPercentage}%)`);
  }

  // 5. Branch Check
  let branchPassed = true;
  if (job.branches && job.branches.length > 0 && !job.branches.includes("All")) {
    const studentBranchNorm = (profile.branch || "").trim().toLowerCase();
    branchPassed = job.branches.some(
      (b) =>
        b.toLowerCase() === studentBranchNorm ||
        studentBranchNorm.includes(b.toLowerCase()) ||
        b.toLowerCase().includes(studentBranchNorm)
    );
    checklist.push({
      criteria: "Eligible Branches",
      required: job.branches.join(", "),
      studentValue: profile.branch,
      passed: branchPassed,
    });
    if (!branchPassed) {
      reasons.push(`Branch '${profile.branch}' is not in the eligible list: ${job.branches.join(", ")}`);
    }
  } else {
    checklist.push({
      criteria: "Eligible Branches",
      required: "All Branches",
      studentValue: profile.branch,
      passed: true,
    });
  }

  const isEligible = cgpaPassed && backlogsPassed && tenthPassed && twelfthPassed && branchPassed;

  return { isEligible, reasons, checklist };
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public / Authenticated
const getAllJobs = async (req, res) => {
  try {
    const { branch, minSalary, search, status } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    } else {
      // By default show active jobs unless requested
      filter.status = "Active";
    }

    if (branch && branch !== "All") {
      filter.$or = [{ branches: branch }, { branches: "All" }];
    }

    if (minSalary) {
      filter.packageLPA = { $gte: Number(minSalary) };
    }

    let jobs = await Job.find(filter)
      .populate("companyId", "name industry location logoUrl website")
      .sort({ createdAt: -1 });

    if (search && search.trim() !== "") {
      const term = search.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(term) ||
          (j.companyId && j.companyId.name.toLowerCase().includes(term)) ||
          j.location.toLowerCase().includes(term) ||
          (j.requiredSkills && j.requiredSkills.some((s) => s.toLowerCase().includes(term)))
      );
    }

    // If user is a student, attach eligibility information & applied status!
    let studentProfile = null;
    let appliedJobIds = new Set();

    if (req.user && req.user.role === "student") {
      studentProfile = await StudentProfile.findOne({ userId: req.user._id });
      const myApplications = await Application.find({ studentId: req.user._id });
      appliedJobIds = new Set(myApplications.map((a) => a.jobId.toString()));
    }

    const enrichedJobs = jobs.map((job) => {
      const jobObj = job.toObject();
      const hasApplied = appliedJobIds.has(job._id.toString());
      jobObj.hasApplied = hasApplied;

      if (studentProfile) {
        const eligibility = evaluateStudentEligibility(studentProfile, job);
        jobObj.eligibility = eligibility;
      }

      return jobObj;
    });

    return res.json({ success: true, count: enrichedJobs.length, jobs: enrichedJobs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public / Authenticated
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "companyId",
      "name industry description location website contactEmail logoUrl"
    );

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const jobObj = job.toObject();

    // Check student eligibility if logged in
    if (req.user && req.user.role === "student") {
      const profile = await StudentProfile.findOne({ userId: req.user._id });
      if (profile) {
        jobObj.eligibility = evaluateStudentEligibility(profile, job);
      }
      const application = await Application.findOne({
        studentId: req.user._id,
        jobId: job._id,
      });
      jobObj.application = application || null;
    }

    return res.json({ success: true, job: jobObj });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check eligibility for a job
// @route   GET /api/jobs/:id/eligibility
// @access  Private (Student)
const checkEligibility = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(400).json({ success: false, message: "Please complete your profile first" });
    }

    const result = evaluateStudentEligibility(profile, job);
    return res.json({ success: true, ...result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create job posting
// @route   POST /api/jobs
// @access  Private (Admin, Recruiter)
const createJob = async (req, res) => {
  try {
    const {
      companyId,
      title,
      description,
      salary,
      packageLPA,
      location,
      minimumCGPA,
      minTenthPercentage,
      minTwelfthPercentage,
      branches,
      requiredSkills,
      maxBacklogs,
      deadline,
      driveDate,
    } = req.body;

    // Parse packageLPA if given as string
    let numericLPA = Number(packageLPA);
    if (isNaN(numericLPA)) {
      const match = salary ? salary.match(/(\d+(\.\d+)?)/) : null;
      numericLPA = match ? parseFloat(match[1]) : 5.0;
    }

    const job = await Job.create({
      companyId,
      title,
      description,
      salary,
      packageLPA: numericLPA,
      location: location || "Pan India",
      minimumCGPA: minimumCGPA !== undefined ? Number(minimumCGPA) : 6.0,
      minTenthPercentage: minTenthPercentage !== undefined ? Number(minTenthPercentage) : 60,
      minTwelfthPercentage: minTwelfthPercentage !== undefined ? Number(minTwelfthPercentage) : 60,
      branches: Array.isArray(branches) ? branches : (branches || "All").split(",").map((b) => b.trim()),
      requiredSkills: Array.isArray(requiredSkills)
        ? requiredSkills
        : (requiredSkills || "").split(",").map((s) => s.trim()).filter(Boolean),
      maxBacklogs: maxBacklogs !== undefined ? Number(maxBacklogs) : 0,
      deadline,
      driveDate,
      createdBy: req.user._id,
    });

    const populated = await Job.findById(job._id).populate("companyId", "name industry location");

    return res.status(201).json({ success: true, job: populated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Admin, Recruiter)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (req.body.salary && !req.body.packageLPA) {
      const match = req.body.salary.match(/(\d+(\.\d+)?)/);
      if (match) req.body.packageLPA = parseFloat(match[1]);
    }

    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("companyId", "name industry location");

    return res.json({ success: true, job: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Admin, Recruiter)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    await Application.deleteMany({ jobId: job._id });
    await job.deleteOne();

    return res.json({ success: true, message: "Job and associated applications removed" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  checkEligibility,
  createJob,
  updateJob,
  deleteJob,
};
