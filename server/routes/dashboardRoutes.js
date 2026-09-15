const express = require("express");
const router = express.Router();
const { getPlacementStats, getPlacementRecords } = require("../controllers/dashboardController");
const { protect } = require("../middleware/auth");
const { permit } = require("../middleware/roleCheck");

router.get("/stats", getPlacementStats);
router.get("/records", protect, permit("admin", "recruiter"), getPlacementRecords);

module.exports = router;
