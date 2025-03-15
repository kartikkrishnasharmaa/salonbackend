const Employee = require("../models/employee");

exports.createSalonEmployee=async(req,res)=>{

  try {
    const { name, email, phone, password, role, branchId } = req.body;
    if (!name || !email || !phone || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (!["manager", "staff", "receptionist"].includes(role)) {
      console.log("Invalid Role Received:", role); // Debugging Step
      return res.status(400).json({ message: "Invalid role provided" });
    }

    // पहले से मौजूद email check करें
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
        return res.status(400).json({ message: "Employee with this email already exists" });
    }

    // नया Employee बनाएँ
    const newEmployee = new Employee({
        name,
        email,
        phone,
        password,
        role,
        salonId: req.user._id, // Salon Admin का ID
        branchId: branchId || null, // अगर branch ID दी गई है तो ही जोड़ें
    });

    await newEmployee.save();
    res.status(201).json({ message: "Employee created successfully", employee: newEmployee });

} catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
}
};
// fetch all employee
exports.getAllEmployees = async (req, res) => {
    try {
      const employees = await Employee.find().populate("salonId", "name").populate("branchId", "branchName");
      res.status(200).json({ success: true, employees });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
// fetch all employee by salon id with branch filter
  exports.getSalonAllEmployees = async (req, res) => {
    try {
      if (!req.user || req.user.role !== "salonadmin") {
        return res.status(403).json({ message: "Access denied! Only Salon Admins can access this data" });
      }
      
      const salonId = req.user._id; // ✅ Fetch Salon Admin's ID
  
      // ✅ Fetch all employees for this salon
      const employees = await Employee.find({ salonId, ...req.branchFilter });
  
      res.status(200).json({
        message: "Employees fetched successfully",
        employees,
      });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
  

exports.assignBranchToEmployee = async (req, res) => {
    try {
      const { employeeId, branchId } = req.body;
  
      if (!employeeId || !branchId) {
        return res.status(400).json({ message: "Employee ID and Branch ID are required" });
      }
  
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
  
      employee.branchId = branchId;
      await employee.save();
  
      res.status(200).json({ message: "Employee assigned to branch successfully", employee });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };