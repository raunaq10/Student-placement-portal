const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const Company = require("../models/Company");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Placement = require("../models/Placement");

// @desc    Get complete placement dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Public / Authenticated
const getPlacementStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalCompanies = await Company.countDocuments();
    const activeJobs = await Job.countDocuments({ status: "Active" });
    const totalApplications = await Application.countDocuments();
    const shortlistedCount = await Application.countDocuments({
      status: { $in: ["Shortlisted", "Interview"] },
    });

    const placements = await Placement.find()
      .populate("studentId", "name email")
      .populate("companyId", "name industry logoUrl")
      .populate("jobId", "title")
      .sort({ placedAt: -1 });

    const placedStudentIds = new Set(placements.map((p) => p.studentId ? p.studentId._id.toString() : ""));
    const placedStudentsCount = placedStudentIds.size;

    const placementRate =
      totalStudents > 0 ? ((placedStudentsCount / totalStudents) * 100).toFixed(1) : 0;

    // Package metrics
    let highestPackage = 0;
    let totalPackage = 0;

    placements.forEach((p) => {
      const lpa = Number(p.packageLPA) || 0;
      if (lpa > highestPackage) highestPackage = lpa;
      totalPackage += lpa;
    });

    const averagePackage =
      placements.length > 0 ? (totalPackage / placements.length).toFixed(2) : 0;

    // If placements is empty, check jobs for estimated packages
    let displayHighestPackage = highestPackage;
    let displayAvgPackage = averagePackage;
    if (highestPackage === 0) {
      const jobs = await Job.find();
      if (jobs.length > 0) {
        displayHighestPackage = Math.max(...jobs.map((j) => j.packageLPA || 0));
        const avg = jobs.reduce((acc, curr) => acc + (curr.packageLPA || 0), 0) / jobs.length;
        displayAvgPackage = avg.toFixed(2);
      }
    }

    // Branch-wise placement distribution
    const allProfiles = await StudentProfile.find().populate("userId", "name");
    const branchStatsMap = {};

    allProfiles.forEach((profile) => {
      const branch = profile.branch || "Other";
      if (!branchStatsMap[branch]) {
        branchStatsMap[branch] = { branch, total: 0, placed: 0 };
      }
      branchStatsMap[branch].total += 1;
      if (profile.userId && placedStudentIds.has(profile.userId._id.toString())) {
        branchStatsMap[branch].placed += 1;
      }
    });

    const branchStats = Object.values(branchStatsMap).map((b) => ({
      ...b,
      rate: b.total > 0 ? Math.round((b.placed / b.total) * 100) : 0,
    }));

    // Status breakdown for applications
    const statusCounts = {
      Applied: await Application.countDocuments({ status: "Applied" }),
      UnderReview: await Application.countDocuments({ status: "Under Review" }),
      Shortlisted: await Application.countDocuments({ status: "Shortlisted" }),
      Interview: await Application.countDocuments({ status: "Interview" }),
      Selected: await Application.countDocuments({ status: "Selected" }),
      Rejected: await Application.countDocuments({ status: "Rejected" }),
    };

    return res.json({
      success: true,
      stats: {
        totalStudents,
        totalCompanies,
        activeJobs,
        totalApplications,
        shortlistedCount,
        placedStudentsCount,
        placementRate: Number(placementRate),
        highestPackage: Number(displayHighestPackage),
        averagePackage: Number(displayAvgPackage),
        branchStats,
        statusCounts,
        recentPlacements: placements.slice(0, 5),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get detailed placement records for tables and CSV export
// @route   GET /api/dashboard/records
// @access  Private (Admin, Recruiter)
const getPlacementRecords = async (req, res) => {
  try {
    const placements = await Placement.find()
      .populate("studentId", "name email")
      .populate("companyId", "name industry location")
      .populate("jobId", "title")
      .sort({ placedAt: -1 });

    const studentUserIds = placements.map((p) => p.studentId ? p.studentId._id : null).filter(Boolean);
    const profiles = await StudentProfile.find({ userId: { $in: studentUserIds } });
    const profileMap = new Map();
    profiles.forEach((p) => profileMap.set(p.userId.toString(), p));

    const records = placements.map((p) => {
      const student = p.studentId;
      const profile = student ? profileMap.get(student._id.toString()) : null;
      return {
        _id: p._id,
        studentName: student ? student.name : "N/A",
        studentEmail: student ? student.email : "N/A",
        rollNumber: profile ? profile.rollNumber : "N/A",
        branch: profile ? profile.branch : "N/A",
        cgpa: profile ? profile.cgpa : "N/A",
        companyName: p.companyId ? p.companyId.name : "N/A",
        jobTitle: p.jobId ? p.jobId.title : "N/A",
        package: p.package,
        packageLPA: p.packageLPA,
        placedAt: p.placedAt,
        joiningDate: p.joiningDate,
      };
    });

    return res.json({ success: true, count: records.length, records });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPlacementStats, getPlacementRecords };
