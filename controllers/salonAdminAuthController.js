const jwt = require("jsonwebtoken");
const Branch = require("../models/branch");
const SuperAdmin = require("../models/superAdminAuth");
const SalonAdmin = require("../models/salonAdminAuth");
const Employee = require("../models/employee");
const { validationResult } = require("express-validator"); // For input validation


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

// Function to get salon branches for a specific admin
exports.getSalonBranches = async (req, res) => {
  try {
    const { salonAdminId } = req.params;
    const salonAdmin = await SalonAdmin.findById(salonAdminId).populate("branches");
    if (!salonAdmin) {
      return res.status(404).json({ message: "Salon Admin not found" });
    }
    res.status(200).json({ branches: salonAdmin.branches });
  } catch (error) {
    res.status(500).json({ message: "Error fetching branches", error: error.message });
  }
};

// Create a new salon admin (only super admin can do this)
exports.createSalonAdmin = async (req, res) => {
  try {
    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if the logged-in user is super admin
    if (req.user.role !== "superAdmin") {
      return res.status(403).json({ message: "Only SuperAdmin can create Salon Admin" });
    }

    const {
      ownerName,
      email,
      password,
      phone,
      address,
      salonName,
      salonType,
      servicesOffered,
      businessEmail,
      businessPhone,
      businessWebsite,
      establishedYear,
    } = req.body;

    // Check if the salon admin already exists
    const existingAdmin = await SalonAdmin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Salon Admin already exists with this email" });
    }

    // Create and save the new salon admin
    const newSalonAdmin = new SalonAdmin({
      ownerName,
      email,
      password,
      phone,
      address,
      salonName,
      salonType,
      servicesOffered,
      businessEmail,
      businessPhone,
      businessWebsite,
      establishedYear,
      createdBy: req.user.id,  // Linking the super admin
    });

    await newSalonAdmin.save();
    res.status(201).json({ message: "Salon Admin created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating Salon Admin", error: error.message });
  }
};

// Log in as Salon Admin (SuperAdmin logs in as salon admin)
exports.loginasSalonAdmin = async (req, res) => {
  try {
    // 🟢 1. Super Admin Verify Karein
    if (!req.user || req.user.role !== "superAdmin") {
      return res.status(403).json({ message: "Access denied! Only SuperAdmin can perform this action" });
    }

    const { salonAdminId } = req.params;
    console.log("Salon Admin ID:", salonAdminId);

    // 🟢 2. Salon Admin Find Karein
    const salonAdmin = await SalonAdmin.findById(salonAdminId).select("-password");
    if (!salonAdmin) {
      return res.status(404).json({ message: "Salon Admin not found" });
    }

    // 🟢 3. New Token Generate Karein for Salon Admin
    const salonAdminToken = jwt.sign(
      { userId: salonAdmin._id, role: "salonadmin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 🟢 4. Response Return Karein with New Token
    res.status(200).json({
      token: salonAdminToken,
      user: salonAdmin,
      message: `Successfully logged in as ${salonAdmin.salonName}`,
    });

  } catch (error) {
    console.error("Error in Super Admin Direct Login:", error.message);
    res.status(500).json({ message: "Error logging in as Salon Admin", error: error.message });
  }
};

// Middleware for creating a branch (limits to superadmin)
exports.createBranch = async (req, res) => {
  const { 
    salonAdminId, 
    branchName, 
    address, 
    phone,
    businessName,
    city,
    state,
    pincode,
    area,
    servicesOffered,
    hours
  } = req.body;
  
  try {
    const salonAdmin = await SalonAdmin.findById(salonAdminId);
    if (!salonAdmin) {
      return res.status(404).json({ message: "Salon Admin not found" });
    }

    const existingBranches = await Branch.find({ salonAdminId });
    if (existingBranches.length >= 6) {
      return res.status(400).json({ message: "Maximum of 6 branches can be created" });
    }

    const newBranch = new Branch({
      salonAdminId,
      branchName,
      businessName,
      address,
      phone,
      city,
      state,
      pincode,
      area,
      servicesOffered,
      hours
    });

    await newBranch.save();
    res.status(200).json({ message: "Branch created successfully", branch: newBranch });
  } catch (error) {
    res.status(500).json({ message: "Error creating branch", error: error.message });
  }
};

// Function to view all salon admins with their branches
exports.getAllSalonAdminsWithBranches = async (req, res) => {
  try {
    const salonAdmins = await SalonAdmin.find().lean();
    const salonAdminIds = salonAdmins.map(admin => admin._id);

    const branches = await Branch.find({ salonAdminId: { $in: salonAdminIds } }).lean();

    const response = salonAdmins.map(admin => {
      return {
        ...admin,
        branches: branches.filter(branch => branch.salonAdminId.toString() === admin._id.toString())
      };
    });

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching salon admins with branches", error: error.message });
  }
};

// Example of Login for Salon Admin (with JWT)
exports.salonAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const salonAdmin = await SalonAdmin.findOne({ email: email.trim().toLowerCase() });


    if (!salonAdmin) {
      return res.status(400).json({ message: "Salon Admin not found" });
    }

    const isMatch = await salonAdmin.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ salonAdminId: salonAdmin._id,role: salonAdmin.role, }, process.env.JWT_SECRET, { expiresIn: '9h' });

    res.status(200).json({
      message: "Login successful",
      token,
      salonAdmin: {
        _id: salonAdmin._id,
        name: salonAdmin.ownerName,
        email: salonAdmin.email,
        role: salonAdmin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error during salon admin login", error: error.message });
  }
};

// Middleware for verifying if user is super admin
exports.verifySuperAdmin = (req, res, next) => {
  if (req.user.role !== "superAdmin") {
    return res.status(403).json({ message: "Access denied! Only SuperAdmin can perform this action" });
  }
  next();
};


// Get total salon admin count (only super admin)
exports.getTotalSalonAdminsCount = async (req, res) => {
  try {
    if (req.user.role !== "superAdmin") {
      return res.status(403).json({ message: "Access denied! Only SuperAdmin can view the count of SalonAdmins" });
    }

    const totalSalonAdmins = await SalonAdmin.countDocuments();

    res.status(200).json({ totalSalonAdmins });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving salon admin count", error: error.message });
  }
};

// Middleware to verify if a salon admin exists
exports.verifySalonAdminExists = async (req, res, next) => {
  const salonAdminId = req.params.adminId;
  const salonAdmin = await SalonAdmin.findById(salonAdminId);
  
  if (!salonAdmin) {
    return res.status(404).json({ message: "Salon Admin not found" });
  }
  
  next();
};

// Function to view a specific salon admin by ID (only super admin)
exports.viewSalonAdmin = async (req, res) => {
  try {
    const salonAdmin = await SalonAdmin.findById(req.params.adminId);
    if (!salonAdmin) {
      return res.status(404).json({ message: "Salon Admin not found" });
    }
    res.status(200).json({ salonAdmin });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving salon admin", error: error.message });
  }
};

// Function to update salon admin fields (only super admin)
exports.updateSalonAdmin = async (req, res) => {
  const { id } = req.params;
  const { ownerName, email, phone, address, salonName, salonType, businessEmail, businessPhone, businessWebsite, establishedYear, servicesOffered } = req.body;

  try {
    const salonAdmin = await SalonAdmin.findById(id);

    if (!salonAdmin) {
      return res.status(404).json({ message: "Salon Admin not found" });
    }

    salonAdmin.ownerName = ownerName || salonAdmin.ownerName;
    salonAdmin.email = email || salonAdmin.email;
    salonAdmin.phone = phone || salonAdmin.phone;
    salonAdmin.address = address || salonAdmin.address;
    salonAdmin.salonName = salonName || salonAdmin.salonName;
    salonAdmin.salonType = salonType || salonAdmin.salonType;
    salonAdmin.businessEmail = businessEmail || salonAdmin.businessEmail;
    salonAdmin.businessPhone = businessPhone || salonAdmin.businessPhone;
    salonAdmin.businessWebsite = businessWebsite || salonAdmin.businessWebsite;
    salonAdmin.establishedYear = establishedYear || salonAdmin.establishedYear;
    salonAdmin.servicesOffered = servicesOffered || salonAdmin.servicesOffered;
    
    await salonAdmin.save();

    res.status(200).json({ message: "Salon Admin updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating Salon Admin", error: error.message });
  }
};

// Function to delete salon admin by ID (only super admin)
exports.deleteSalonAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const salonAdmin = await SalonAdmin.findById(id);
    
    if (!salonAdmin) {
      return res.status(404).json({ message: "Salon Admin not found" });
    }

    await salonAdmin.deleteOne();

    res.status(200).json({ message: "Salon Admin deleted permanently" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Salon Admin", error: error.message });
  }
};

exports.getSalonAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;  // Getting the user ID from the request (set by authMiddleware)
    
    const adminProfile = await SalonAdmin.findById(adminId).select("-password"); // Exclude password field

    if (!adminProfile) {
      return res.status(404).json({ message: "Salon Admin not found!" });
    }

    return res.status(200).json(adminProfile);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};

exports.viewAllSalonAdmins = async (req, res) => {
  try {
    const allSalonAdmins = await SalonAdmin.find().select("-password"); // Fetch all admins, exclude passwords

    if (!allSalonAdmins.length) {
      return res.status(404).json({ message: "No salon admins found!" });
    }

    return res.status(200).json(allSalonAdmins);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching salon admins", error: error.message });
  }
};