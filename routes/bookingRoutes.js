const express = require("express");
const { createAppointment,getAppointments } = require("../controllers/bookingController");

const {authMiddleware,isSalonAdmin} = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/create-booking",authMiddleware,isSalonAdmin, createAppointment); // Create new booking

router.get("/get-appointments",authMiddleware,isSalonAdmin, getAppointments); // Get all appointments

module.exports = router;
