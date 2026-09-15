const jwt = require("jsonwebtoken");
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "placement_portal_jwt_secret_key_2026_secure_random",
    { expiresIn: "7d" }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role, rollNumber, branch, course, cgpa } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }

    const assignedRole = role && ["student", "recruiter", "admin"].includes(role) ? role : "student";

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
    });

    let profile = null;
    if (assignedRole === "student") {
      profile = await StudentProfile.create({
        userId: user._id,
        rollNumber: rollNumber || `COL-${Math.floor(1000 + Math.random() * 9000)}`,
        branch: branch || "Computer Science and Engineering",
        course: course || "B.Tech",
        cgpa: cgpa || 7.0,
        tenthPercentage: 75,
        twelfthPercentage: 75,
        backlogs: 0,
        skills: ["C++", "Java", "Python", "Data Structures"],
      });
    }

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      profile,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    let profile = null;

    if (user.role === "student") {
      profile = await StudentProfile.findOne({ userId: user._id });
    }

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      profile,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    let profile = null;

    if (user.role === "student") {
      profile = await StudentProfile.findOne({ userId: user._id });
    }

    return res.json({
      success: true,
      user,
      profile,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, getMe };
