const SuperAdmin = require("../models/superAdminAuth");
const jwt = require("jsonwebtoken");

// 🔐 Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// 🛠 **Super Admin Signup**
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if Super Admin already exists
    const existingUser = await SuperAdmin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create a new Super Admin
    const user = new SuperAdmin({ name, email, password });
    await user.save();

    // Generate Token
    const token = generateToken(user);
    res.status(201).json({
      message: "Super Admin registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error during signup", error: error.message });
  }
};
// 🔑 **Super Admin Login**
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate Input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find the User
    const user = await SuperAdmin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    // Compare Passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate Token
    const token = generateToken(user);

    // Respond with User Details and Token
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error during super admin login", error: error.message });
  }
};
