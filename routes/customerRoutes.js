const express = require("express");
const {createCustomer,signupCustomer,getSalonallCustomers,getCustomerCountByBranch} = require("../controllers/customerController");
const router = express.Router();

const {authMiddleware, isSalonAdmin,filterByBranch} = require("../middleware/authMiddleware");

router.post("/create-customer", authMiddleware,isSalonAdmin, createCustomer);

// 🌍 Public customer signup
router.post("/customer-self-signup", signupCustomer);

router.get("/salon/customers", authMiddleware, isSalonAdmin,filterByBranch, getSalonallCustomers);

router.get("/salon/customer-count", authMiddleware, isSalonAdmin,filterByBranch, getCustomerCountByBranch);


module.exports = router; // ✅ Ensure this is correctly exported
