const express = require("express");
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
  uploadResumeFile,
  getAllStudents,
} = require("../controllers/profileController");
const { protect } = require("../middleware/auth");
const { permit } = require("../middleware/roleCheck");
const { uploadResume } = require("../middleware/upload");

router.get("/me", protect, permit("student"), getMyProfile);
router.put("/me", protect, permit("student"), updateMyProfile);
router.post("/resume", protect, permit("student"), uploadResume.single("resume"), uploadResumeFile);
router.get("/all", protect, permit("admin", "recruiter"), getAllStudents);

module.exports = router;
