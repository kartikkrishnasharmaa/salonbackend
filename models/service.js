const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    salonAdminId: { type: mongoose.Schema.Types.ObjectId, ref: "SalonAdmin", required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    category: { type: String, enum: ["Hair", "Skin", "Nails", "Spa", "Makeup"], required: true },
    name: { type: String, required: true }, 
    description: { type: String },
    type: { type: String, enum: ["Basic", "Premium", "Luxury"], required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true }, // Duration in minutes
    startTime: { type: String, required: true }, // Example: "10:00 AM"
    endTime: { type: String, required: true },   // Example: "11:00 AM"
    assignedEmployee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee",},
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
