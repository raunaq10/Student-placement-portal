const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    resume: {
      filename: String,
      originalName: String,
      url: String,
    },
    status: {
      type: String,
      enum: ["Applied", "Under Review", "Shortlisted", "Interview", "Selected", "Rejected"],
      default: "Applied",
    },
    feedback: {
      type: String,
      default: "",
    },
    interviewDate: {
      type: Date,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent duplicate application by the same student to the same job
applicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
