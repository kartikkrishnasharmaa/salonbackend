// models/Branch.js
const mongoose = require("mongoose");
const branchSchema = mongoose.Schema(
  {
    salonAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalonAdmin",
      required: true,
    },
    branchName: { type: String, required: true },
    businessName: { type: String, required: true },
    phone: { type: String },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    area: { type: String, required: true },
    // New field added
    servicesOffered: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service"
      }
    ],
    // Weekly hours (simple format)
    hours: {
      mon: { open: String, close: String, closed: Boolean },
      tue: { open: String, close: String, closed: Boolean },
      wed: { open: String, close: String, closed: Boolean },
      thu: { open: String, close: String, closed: Boolean },
      fri: { open: String, close: String, closed: Boolean },
      sat: { open: String, close: String, closed: Boolean },
      sun: { open: String, close: String, closed: Boolean },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Branch", branchSchema);