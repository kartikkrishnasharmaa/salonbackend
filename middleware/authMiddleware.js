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
        user = await SuperAdmin.findById(decoded.id || decoded.salonAdminId);
        break;
      case "salonadmin":
        user = await SalonAdmin.findById(decoded.id || decoded.salonAdminId);
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
      console.log("User Not Found in Database");
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("JWT Verification Failed:", error.message); // ✅ Debugging Step
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

const isSalonAdmin = (req, res, next) => {

  if (!req.user) {
    return res.status(401).json({ message: "User not found" });
  }

  if (req.user.role !== "salonadmin") {
    return res.status(403).json({
      message: "Access denied! salon admin unable to access",
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
const filterByBranch = (req, res, next) => {
  if (req.user.role === 'salonadmin' && req.query.branchId) {
      req.branchFilter = { branchId: req.query.branchId };
  } else {
      req.branchFilter = {};
  }
  next();
};

module.exports = { authMiddleware, authorizeRoles, isSuperAdmin, isSalonAdmin,filterByBranch };