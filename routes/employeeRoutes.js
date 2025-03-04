const express = require("express");
const {
  createSalonEmployee,
  getAllEmployees,
  assignBranchToEmployee  
} = require("../controllers/employeeController");

const {authMiddleware,isSalonAdmin} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create-employee", authMiddleware,isSalonAdmin, createSalonEmployee);

// fetch all employee
router.get("/all-employees",authMiddleware,isSalonAdmin, getAllEmployees);

// assign employee to branch
router.put("/assign-branch", assignBranchToEmployee); // Update branch for an employee


module.exports = router;
