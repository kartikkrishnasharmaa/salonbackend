const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  service: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true }, // Start Time
  endTime: { type: String, required: true }, // End Time
  notes: { type: String }, // Additional Notes
  price: { type: Number }, // Service Price
  status: { type: String, enum: ["Pending", "Completed", "Cancelled"], default: "Pending" },
}, { timestamps: true });

module.exports = mongoose.model("Appointment", AppointmentSchema);
