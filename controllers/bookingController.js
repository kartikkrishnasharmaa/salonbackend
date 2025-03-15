const Appointment = require("../models/appointment");

// Create New Appointment
exports.createAppointment = async (req, res) => {
  try {
    const { customerId, employeeId, service, date, startTime, endTime, notes, price, branchId } = req.body;

    if (!branchId) {
      return res.status(400).json({ message: "Branch ID is required" });
    }

    const newAppointment = new Appointment({
      customerId,
      employeeId,
      service,
      date,
      startTime,
      endTime,
      notes,
      price,
      branchId,
    });

    await newAppointment.save();
    res.status(201).json({ message: "Appointment created successfully", appointment: newAppointment });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const { branchId } = req.query;
    if (!branchId) return res.status(400).json({ message: "Branch ID required" });

    const appointments = await Appointment.find({ branchId })
      .populate("customerId", "name")  // Populate customer name
      .populate("employeeId", "name")  // Populate employee name
      .populate("branchId", "name");     // Populate branch name

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
