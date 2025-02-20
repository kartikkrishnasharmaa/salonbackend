const express = require("express");
const { signup, login } = require("../controllers/superAdminAuthController");
const router = express.Router();

// 🛠 Super Admin Signup
router.post("/sa-signup", signup);

// 🔑 Super Admin Login
router.post("/sa-login", login);

module.exports = router;
