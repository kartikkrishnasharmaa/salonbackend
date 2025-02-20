const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, unique: true },
  salonId: { type: mongoose.Schema.Types.ObjectId, ref: "SalonAdmin", required: true },
  branchId: { type: String, required: true }, // Customer kis branch ka hai
});

module.exports = mongoose.model("Customer", CustomerSchema);
