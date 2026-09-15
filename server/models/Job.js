const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    salary: {
      type: String,
      required: [true, "Salary package is required"],
    },
    packageLPA: {
      type: Number,
      required: true,
      default: 5.0,
    },
    location: {
      type: String,
      default: "Pan India / Remote",
    },
    minimumCGPA: {
      type: Number,
      default: 6.0,
      min: 0,
      max: 10,
    },
    minTenthPercentage: {
      type: Number,
      default: 60.0,
      min: 0,
      max: 100,
    },
    minTwelfthPercentage: {
      type: Number,
      default: 60.0,
      min: 0,
      max: 100,
    },
    branches: [
      {
        type: String,
        trim: true,
      },
    ],
    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    maxBacklogs: {
      type: Number,
      default: 0,
      min: 0,
    },
    deadline: {
      type: Date,
      required: [true, "Application deadline is required"],
    },
    driveDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Active", "Closed"],
      default: "Active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
