const Service = require("../models/service");
const Branch = require("../models/branch");

// 🎯 CREATE SERVICE - Salon Admin Only
exports.createservice = async (req, res) => {
  try {
    const { branchId, name, category, type, price, duration, startTime, endTime, description } = req.body;

    //  Validate Required Fields
    if (!branchId || !name || !category || !type || !price || !duration || !startTime || !endTime) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔍 Check if the branch exists & belongs to the salon admin
    const branch = await Branch.findOne({ _id: branchId, salonAdminId: req.user._id });
    if (!branch) {
      return res.status(404).json({ message: "Branch not found or unauthorized" });
    }

    // 🕒 Validate Time Range
    if (startTime >= endTime) {
      return res.status(400).json({ message: "End time must be after start time" });
    }

    // 🚀 Create New Service
    const newService = new Service({
      salonAdminId: req.user._id,
      branchId,
      name,
      category,
      type,
      price,
      duration,
      startTime,
      endTime,
      description,
    });

    await newService.save();
    res.status(201).json({ message: "Service created successfully", service: newService });
  } catch (error) {
    console.error("Service Creation Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getServicesByBranch = async (req, res) => {
  try {
    const { branchId } = req.query; // Query params se branchId lo

    if (!branchId) {
      return res.status(400).json({ message: "Branch ID is required" });
    }

    // ✅ Fetch services for the given branch
    const services = await Service.find({ branchId });

    if (!services.length) {
      return res.status(404).json({ message: "No services found for this branch" });
    }

    res.status(200).json({ services });
  } catch (error) {
    console.error("Fetch Services Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 👥 GET ALL EMPLOYEES WITH SERVICES
exports.getAllEmployeesWithServices = async (req, res) => {
  try {
    const { branchId } = req.query;
    
    const query = { salonAdminId: req.user._id };
    if (branchId) {
      query.branchId = branchId;
    }

    const employees = await Employee.find(query)
      .populate("branchId", "branchName")
      .populate("services", "name duration price category type");

    res.status(200).json({ employees });
  } catch (error) {
    console.error("Get Employees Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ➕ ASSIGN SERVICE TO EMPLOYEE
exports.assignServiceToEmployee = async (req, res) => {
  try {
    const { employeeId, serviceId } = req.body;

    // Check if employee exists and belongs to the salon admin
    const employee = await Employee.findOne({ 
      _id: employeeId, 
      salonAdminId: req.user._id 
    });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found or unauthorized" });
    }

    // Check if service exists and belongs to the salon admin
    const service = await Service.findOne({ 
      _id: serviceId, 
      salonAdminId: req.user._id 
    });
    if (!service) {
      return res.status(404).json({ message: "Service not found or unauthorized" });
    }

    // Check if service is already assigned
    if (employee.services.includes(serviceId)) {
      return res.status(400).json({ message: "Service already assigned to this employee" });
    }

    // Assign the service
    employee.services.push(serviceId);
    await employee.save();

    // Update the service's assignedEmployee
    service.assignedEmployee = employeeId;
    await service.save();

    const updatedEmployee = await Employee.findById(employeeId)
      .populate("services", "name duration price");

    res.status(200).json({ 
      message: "Service assigned successfully",
      employee: updatedEmployee
    });
  } catch (error) {
    console.error("Assign Service Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
