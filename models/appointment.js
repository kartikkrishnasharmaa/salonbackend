const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  branchId: { type: String, required: true }, // Appointment kis branch ka hai
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" }, // Kis employee ne service di
  service: { type: String, required: true },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Pending", "Completed", "Cancelled"],
    default: "Pending",
  },
});
module.exports = mongoose.model("Appointment", AppointmentSchema);
