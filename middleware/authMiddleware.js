const jwt = require("jsonwebtoken");
const SuperAdmin = require("../models/superAdminAuth");
const SalonAdmin = require("../models/salonAdminAuth");
const Employee = require("../models/employee");
const Customer = require("../models/customer");

const authMiddleware = async (req, res, next) => {
  let token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    let user;
    switch (decoded.role) {
      case "superAdmin":
        user = await SuperAdmin.findById(decoded.id);
        break;
      case "salonAdmin":
        user = await SalonAdmin.findById(decoded.id);
        break;
      case "manager":
      case "staff":
      case "receptionist":
        user = await Employee.findById(decoded.id);
        break;
      case "customer":
        user = await Customer.findById(decoded.id);
        break;
      default:
        return res.status(403).json({ message: "Invalid role" });
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // Now req.user has full user details
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const isSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not found" });
  }

  if (req.user.role !== "superAdmin") {
    return res.status(403).json({
      message: "Access denied! Only SuperAdmin can view the count of SalonAdmins",
    });
  }

  next();
};



// 🛡 Role-based Authorization Middleware
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    next();
  };
};

module.exports = { authMiddleware, authorizeRoles, isSuperAdmin };
