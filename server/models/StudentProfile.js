const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  techStack: [{ type: String }],
  githubLink: { type: String, default: "" },
  liveLink: { type: String, default: "" },
});

const certificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, default: "" },
  year: { type: String, default: "" },
  link: { type: String, default: "" },
});

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    rollNumber: {
      type: String,
      required: [true, "Roll number / College ID is required"],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    course: {
      type: String,
      default: "B.Tech",
    },
    branch: {
      type: String,
      required: [true, "Branch is required"],
      trim: true,
    },
    semester: {
      type: Number,
      default: 7,
    },
    cgpa: {
      type: Number,
      required: [true, "CGPA is required"],
      min: 0,
      max: 10,
    },
    tenthPercentage: {
      type: Number,
      required: [true, "10th Percentage is required"],
      min: 0,
      max: 100,
    },
    twelfthPercentage: {
      type: Number,
      required: [true, "12th Percentage is required"],
      min: 0,
      max: 100,
    },
    backlogs: {
      type: Number,
      default: 0,
      min: 0,
    },
    skills: [{ type: String, trim: true }],
    projects: [projectSchema],
    certifications: [certificationSchema],
    internships: [
      {
        company: String,
        role: String,
        duration: String,
        description: String,
      },
    ],
    resume: {
      filename: { type: String, default: "" },
      originalName: { type: String, default: "" },
      path: { type: String, default: "" },
      url: { type: String, default: "" },
      uploadedAt: { type: Date },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
