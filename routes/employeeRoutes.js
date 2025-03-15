const express = require("express");
const {
  createSalonEmployee,
  getAllEmployees,
  assignBranchToEmployee,
  getSalonAllEmployees  
} = require("../controllers/employeeController");

const {authMiddleware,isSalonAdmin,filterByBranch} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create-employee", authMiddleware,isSalonAdmin, createSalonEmployee);

// fetch all employee
router.get("/all-employees",authMiddleware,isSalonAdmin, getAllEmployees);

// assign employee to branch
router.put("/assign-branch", assignBranchToEmployee); // Update branch for an employee

// fetch all employee by salon id with branch filter
router.get("/all/employees", authMiddleware, isSalonAdmin,filterByBranch, getSalonAllEmployees);


module.exports = router;
