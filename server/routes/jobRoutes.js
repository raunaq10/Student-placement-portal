const express = require("express");
const router = express.Router();
const {
  getAllJobs,
  getJobById,
  checkEligibility,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");
const { protect, optionalProtect } = require("../middleware/auth");
const { permit } = require("../middleware/roleCheck");

router.get("/", optionalProtect, getAllJobs);
router.get("/:id", optionalProtect, getJobById);
router.get("/:id/eligibility", protect, permit("student"), checkEligibility);
router.post("/", protect, permit("admin", "recruiter"), createJob);
router.put("/:id", protect, permit("admin", "recruiter"), updateJob);
router.delete("/:id", protect, permit("admin", "recruiter"), deleteJob);

module.exports = router;
