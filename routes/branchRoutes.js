const express = require("express");
const { getSalonBranches,assignEmployeeToBranch } = require("../controllers/branchController");

const {authMiddleware,isSalonAdmin} = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/get-salon/:salonAdminId/branches",authMiddleware,isSalonAdmin, getSalonBranches); // Fetch branches for a salon

router.put("/assign-branch", authMiddleware, isSalonAdmin, assignEmployeeToBranch); // Assign employee to branch




module.exports = router;
