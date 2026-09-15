const express = require("express");
const router = express.Router();
const {
  applyForJob,
  getStudentApplications,
  getJobApplications,
  updateApplicationStatus,
  getAllApplications,
} = require("../controllers/applicationController");
const { protect } = require("../middleware/auth");
const { permit } = require("../middleware/roleCheck");

router.post("/:jobId", protect, permit("student"), applyForJob);
router.get("/my", protect, permit("student"), getStudentApplications);
router.get("/job/:jobId", protect, permit("admin", "recruiter"), getJobApplications);
router.get("/all", protect, permit("admin"), getAllApplications);
router.put("/:id/status", protect, permit("admin", "recruiter"), updateApplicationStatus);

module.exports = router;
