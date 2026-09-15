const StudentProfile = require("../models/StudentProfile");
const User = require("../models/User");
const Placement = require("../models/Placement");

// @desc    Get current student's profile
// @route   GET /api/profile
// @access  Private (Student)
const getMyProfile = async (req, res) => {
  try {
    let profile = await StudentProfile.findOne({ userId: req.user._id }).populate(
      "userId",
      "name email role"
    );

    if (!profile) {
      // Auto-create default profile if missing
      profile = await StudentProfile.create({
        userId: req.user._id,
        rollNumber: `COL-${Math.floor(1000 + Math.random() * 9000)}`,
        branch: "Computer Science and Engineering",
        cgpa: 7.5,
        tenthPercentage: 75,
        twelfthPercentage: 75,
        backlogs: 0,
      });
      profile = await profile.populate("userId", "name email role");
    }

    // Check placement status
    const placement = await Placement.findOne({ studentId: req.user._id }).populate("companyId", "name");

    return res.json({
      success: true,
      profile,
      placement: placement || null,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update current student profile
// @route   PUT /api/profile
// @access  Private (Student)
const updateMyProfile = async (req, res) => {
  try {
    const {
      rollNumber,
      phone,
      course,
      branch,
      semester,
      cgpa,
      tenthPercentage,
      twelfthPercentage,
      backlogs,
      skills,
      projects,
      certifications,
      internships,
      name,
    } = req.body;

    if (name) {
      await User.findByIdAndUpdate(req.user._id, { name });
    }

    let profile = await StudentProfile.findOne({ userId: req.user._id });

    if (!profile) {
      profile = new StudentProfile({ userId: req.user._id });
    }

    if (rollNumber !== undefined) profile.rollNumber = rollNumber;
    if (phone !== undefined) profile.phone = phone;
    if (course !== undefined) profile.course = course;
    if (branch !== undefined) profile.branch = branch;
    if (semester !== undefined) profile.semester = semester;
    if (cgpa !== undefined) profile.cgpa = Number(cgpa);
    if (tenthPercentage !== undefined) profile.tenthPercentage = Number(tenthPercentage);
    if (twelfthPercentage !== undefined) profile.twelfthPercentage = Number(twelfthPercentage);
    if (backlogs !== undefined) profile.backlogs = Number(backlogs);
    if (skills !== undefined) {
      profile.skills = Array.isArray(skills)
        ? skills
        : skills.split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (projects !== undefined) profile.projects = projects;
    if (certifications !== undefined) profile.certifications = certifications;
    if (internships !== undefined) profile.internships = internships;

    await profile.save();
    profile = await profile.populate("userId", "name email role");

    return res.json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload student resume
// @route   POST /api/profile/resume
// @access  Private (Student)
const uploadResumeFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No resume file uploaded" });
    }

    const fileUrl = `/uploads/resumes/${req.file.filename}`;

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user._id },
      {
        resume: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          path: req.file.path,
          url: fileUrl,
          uploadedAt: new Date(),
        },
      },
      { new: true, upsert: true }
    ).populate("userId", "name email role");

    return res.json({
      success: true,
      message: "Resume uploaded successfully",
      resume: profile.resume,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all students (Admin / Recruiter)
// @route   GET /api/profile/all
// @access  Private (Admin, Recruiter)
const getAllStudents = async (req, res) => {
  try {
    const { branch, minCGPA, search } = req.query;

    const filter = {};
    if (branch && branch !== "All") {
      filter.branch = branch;
    }
    if (minCGPA) {
      filter.cgpa = { $gte: Number(minCGPA) };
    }

    let profiles = await StudentProfile.find(filter)
      .populate("userId", "name email role")
      .sort({ cgpa: -1 });

    // Filter by search term if provided
    if (search && search.trim() !== "") {
      const term = search.toLowerCase();
      profiles = profiles.filter(
        (p) =>
          (p.userId && p.userId.name.toLowerCase().includes(term)) ||
          (p.userId && p.userId.email.toLowerCase().includes(term)) ||
          (p.rollNumber && p.rollNumber.toLowerCase().includes(term))
      );
    }

    // Attach placement status
    const placements = await Placement.find().populate("companyId", "name");
    const placementMap = new Map();
    placements.forEach((p) => {
      placementMap.set(p.studentId.toString(), p);
    });

    const enrichedProfiles = profiles.map((p) => {
      const placement = p.userId ? placementMap.get(p.userId._id.toString()) : null;
      return {
        ...p.toObject(),
        isPlaced: !!placement,
        placementInfo: placement || null,
      };
    });

    return res.json({
      success: true,
      count: enrichedProfiles.length,
      students: enrichedProfiles,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  uploadResumeFile,
  getAllStudents,
};
