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