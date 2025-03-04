const express = require("express");
const {createCustomer,signupCustomer,getSalonallCustomers} = require("../controllers/customerController");
const router = express.Router();

const {authMiddleware, isSalonAdmin} = require("../middleware/authMiddleware");

router.post("/create-customer", authMiddleware,isSalonAdmin, createCustomer);

// 🌍 Public customer signup
router.post("/customer-self-signup", signupCustomer);

router.get("/salon/customers", authMiddleware, isSalonAdmin, getSalonallCustomers);


module.exports = router; // ✅ Ensure this is correctly exported
