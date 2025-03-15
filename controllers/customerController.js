const Customer = require("../models/customer");
const bcrypt = require("bcryptjs");
exports.createCustomer = async (req, res) => {
  try {
    // Only Salon Admin can create customers
    if (!req.user || req.user.role !== "salonadmin") {
      return res.status(403).json({ message: "Unauthorized: Only salon admins can create customers." });
    }

    const { name, email, phone, password, salonId, branchId } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: "Customer with this email already exists" });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new customer
    const newCustomer = new Customer({
      name,
      email,
      phone,
      password: hashedPassword, // ✅ Secure password storage
      salonId,
      branchId: branchId || null,
      createdBy: req.user._id,
      createdByModel: "SalonAdmin",
    });

    await newCustomer.save();
    res.status(201).json({ message: "Customer created successfully", customer: newCustomer });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.signupCustomer = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: "Customer with this email already exists" });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new customer
    const newCustomer = new Customer({
      name,
      email,
      phone,
      password: hashedPassword,
      createdBy: null, // Public signup
      createdByModel: "Self",
    });

    await newCustomer.save();
    res.status(201).json({ message: "Signup successful", customer: newCustomer });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getSalonallCustomers = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "salonadmin") {
      return res.status(403).json({ message: "Access denied! Only Salon Admins can access this data" });
    }
    const salonId = req.user._id; // ✅ Fetch Salon Admin's ID
    // ✅ Fetch all customers for this salon
    const customers = await Customer.find({ salonId,...req.branchFilter });
    res.status(200).json({
      message: "Customers fetched successfully",
      customers,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

