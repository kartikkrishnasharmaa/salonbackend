const express = require("express");
const { createAppointment,getAppointments,checkInAppointment,cancelAppointment } = require("../controllers/bookingController");

const {authMiddleware,isSalonAdmin,filterByBranch} = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/create-booking",authMiddleware,isSalonAdmin, createAppointment); // Create new booking

router.get("/get-appointments",authMiddleware,isSalonAdmin,filterByBranch, getAppointments); // Get all appointments

router.patch("/checkin/:appointmentId",authMiddleware,isSalonAdmin, checkInAppointment); // Update appointment status to Completed

router.patch("/cancel/:appointmentId", authMiddleware, isSalonAdmin, cancelAppointment); // Cancel an appointment



module.exports = router;
