const express = require("express");
const router = express.Router();
const {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
} = require("../controllers/companyController");
const { protect } = require("../middleware/auth");
const { permit } = require("../middleware/roleCheck");

router.get("/", getAllCompanies);
router.get("/:id", getCompanyById);
router.post("/", protect, permit("admin", "recruiter"), createCompany);
router.put("/:id", protect, permit("admin", "recruiter"), updateCompany);
router.delete("/:id", protect, permit("admin"), deleteCompany);

module.exports = router;
