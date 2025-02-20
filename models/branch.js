// models/Branch.js
const mongoose = require("mongoose");
const branchSchema = mongoose.Schema(
    {
      salonAdminId: { type: mongoose.Schema.Types.ObjectId, ref: "SalonAdmin", required: true },
      branchName: { type: String, required: true },
      phone: { type: String },
      address: { type: String, required: true }
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("Branch", branchSchema);