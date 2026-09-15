const Application = require("../models/Application");
const Job = require("../models/Job");
const StudentProfile = require("../models/StudentProfile");
const Placement = require("../models/Placement");
const User = require("../models/User");

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Student)
const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId).populate("companyId");
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.status !== "Active") {
      return res.status(400).json({ success: false, message: "This job posting is closed" });
    }

    // Check if deadline passed
    if (job.deadline && new Date() > new Date(job.deadline)) {
      return res.status(400).json({ success: false, message: "Application deadline has passed" });
    }

    // Check existing application
    const existing = await Application.findOne({ studentId: req.user._id, jobId });
    if (existing) {
      return res.status(400).json({ success: false, message: "You have already applied for this job" });
    }

    // Check student profile & eligibility
    const profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(400).json({ success: false, message: "Please complete your profile before applying" });
    }

    if (!profile.resume || !profile.resume.url) {
      return res.status(400).json({
        success: false,
        message: "Please upload your resume in your profile before applying",
      });
    }

    // Check eligibility
    if (profile.cgpa < job.minimumCGPA) {
      return res.status(400).json({
        success: false,
        message: `Ineligible: Minimum CGPA required is ${job.minimumCGPA}`,
      });
    }

    if (profile.backlogs > job.maxBacklogs) {
      return res.status(400).json({
        success: false,
        message: `Ineligible: Maximum backlogs allowed is ${job.maxBacklogs}`,
      });
    }

    if (job.branches && job.branches.length > 0 && !job.branches.includes("All")) {
      const studentBranchNorm = (profile.branch || "").trim().toLowerCase();
      const branchOk = job.branches.some(
        (b) =>
          b.toLowerCase() === studentBranchNorm ||
          studentBranchNorm.includes(b.toLowerCase()) ||
          b.toLowerCase().includes(studentBranchNorm)
      );
      if (!branchOk) {
        return res.status(400).json({
          success: false,
          message: `Ineligible: Only branches [${job.branches.join(", ")}] are eligible`,
        });
      }
    }

    const application = await Application.create({
      studentId: req.user._id,
      jobId,
      resume: {
        filename: profile.resume.filename,
        originalName: profile.resume.originalName,
        url: profile.resume.url,
      },
      status: "Applied",
    });

    const populated = await Application.findById(application._id)
      .populate({
        path: "jobId",
        populate: { path: "companyId", select: "name industry location logoUrl" },
      });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      application: populated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current student's applications
// @route   GET /api/applications/my
// @access  Private (Student)
const getStudentApplications = async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate({
        path: "jobId",
        populate: { path: "companyId", select: "name industry location logoUrl website" },
      })
      .sort({ createdAt: -1 });

    return res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get applications for a job (Recruiter/Admin)
// @route   GET /api/applications/job/:jobId
// @access  Private (Admin, Recruiter)
const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ jobId })
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });

    // Attach student profile data
    const studentUserIds = applications.map((a) => a.studentId._id);
    const profiles = await StudentProfile.find({ userId: { $in: studentUserIds } });
    const profileMap = new Map();
    profiles.forEach((p) => profileMap.set(p.userId.toString(), p));

    const enriched = applications.map((app) => {
      const appObj = app.toObject();
      appObj.studentProfile = profileMap.get(app.studentId._id.toString()) || null;
      return appObj;
    });

    return res.json({ success: true, count: enriched.length, applications: enriched });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update application status & feedback
// @route   PUT /api/applications/:id/status
// @access  Private (Admin, Recruiter)
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, feedback, interviewDate } = req.body;

    const application = await Application.findById(id).populate("jobId");
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (status) application.status = status;
    if (feedback !== undefined) application.feedback = feedback;
    if (interviewDate !== undefined) application.interviewDate = interviewDate;

    await application.save();

    // If candidate is Selected, automatically generate or update Placement record!
    if (status === "Selected") {
      const job = await Job.findById(application.jobId);
      if (job) {
        await Placement.findOneAndUpdate(
          { studentId: application.studentId, jobId: job._id },
          {
            studentId: application.studentId,
            companyId: job.companyId,
            jobId: job._id,
            package: job.salary,
            packageLPA: job.packageLPA,
            joiningDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 months later
            placedAt: new Date(),
          },
          { upsert: true, new: true }
        );
      }
    }

    const updated = await Application.findById(id)
      .populate("studentId", "name email")
      .populate({
        path: "jobId",
        populate: { path: "companyId", select: "name" },
      });

    return res.json({ success: true, message: "Application updated successfully", application: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all applications across portal (Admin)
// @route   GET /api/applications/all
// @access  Private (Admin)
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("studentId", "name email")
      .populate({
        path: "jobId",
        populate: { path: "companyId", select: "name location" },
      })
      .sort({ createdAt: -1 });

    const studentUserIds = applications.map((a) => a.studentId ? a.studentId._id : null).filter(Boolean);
    const profiles = await StudentProfile.find({ userId: { $in: studentUserIds } });
    const profileMap = new Map();
    profiles.forEach((p) => profileMap.set(p.userId.toString(), p));

    const enriched = applications.map((app) => {
      const appObj = app.toObject();
      if (app.studentId) {
        appObj.studentProfile = profileMap.get(app.studentId._id.toString()) || null;
      }
      return appObj;
    });

    return res.json({ success: true, count: enriched.length, applications: enriched });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  applyForJob,
  getStudentApplications,
  getJobApplications,
  updateApplicationStatus,
  getAllApplications,
};
