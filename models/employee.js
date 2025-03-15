  const mongoose = require("mongoose");

  const EmployeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["staff","manager", "receptionist"], required: true },
    salonId: { type: mongoose.Schema.Types.ObjectId, ref: "SalonAdmin", required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch",}, // Updated
  }, { timestamps: true });

  module.exports = mongoose.model("Employee", EmployeeSchema);
