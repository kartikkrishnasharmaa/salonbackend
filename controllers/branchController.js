const Branch = require("../models/branch");
const mongoose = require("mongoose");
const Employee = require("../models/employee")

exports.getSalonBranches = async (req, res) => {
  try {
    const { salonAdminId } = req.params;

    // ✅ Validate salonAdminId
    if (!salonAdminId) {
      return res.status(400).json({ error: "Salon Admin ID is required" });
    }

    // ✅ Ensure ObjectId format is used
    const branches = await Branch.find({ salonAdminId: new mongoose.Types.ObjectId(salonAdminId) });

    if (!branches.length) {
      return res.status(404).json({ error: "No branches found for this salon admin" });
    }

    res.status(200).json({ branches });

  } catch (error) {
    console.error("❌ Error fetching branches:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.assignEmployeeToBranch = async (req, res) => {
  try {
    const { employeeId, branchId } = req.body;

    if (!employeeId || !branchId) {
      return res.status(400).json({ error: "Employee ID and Branch ID are required" });
    }

    // Check if employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Check if branch exists
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res.status(404).json({ error: "Branch not found" });
    }

    // Assign branch to employee
    employee.branchId = branchId;
    await employee.save();

    res.json({ message: "Employee assigned to branch successfully", employee });
  } catch (error) {
    console.error("❌ Error assigning employee to branch:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// get all branches by salon admin id for redux main functionality
exports.getallSalonBranches = async (req, res) => {
  try {
    const branches = await Branch.find({ salonAdminId: req.user._id });
    res.json(branches);
} catch (error) {
    res.status(500).json({ message: error.message });
}
};