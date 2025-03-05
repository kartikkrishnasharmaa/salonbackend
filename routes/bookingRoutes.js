const express = require("express");
const { createbooking,getallappointments } = require("../controllers/bookingController");

const {authMiddleware,isSalonAdmin} = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/create-booking",authMiddleware,isSalonAdmin, createbooking); // Create new booking

router.get("/get-all-appointments",authMiddleware,isSalonAdmin, getallappointments); // Get all bookings



module.exports = router;
