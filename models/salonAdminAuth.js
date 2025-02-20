// models/SalonAdmin.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const salonAdminSchema = mongoose.Schema(
  {
    ownerName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, unique: true },
    address: {
      mapaddress: { type: String },
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String }
    },
    salonName: { type: String },
    salonType: { type: String, enum: ["Men", "Women", "Unisex"] },
    businessEmail: { type: String },
    businessPhone: { type: String },
    businessWebsite: { type: String },
    establishedYear: { type: Number },
    servicesOffered: [{ type: String }],
    role: { type: String, default: "salonadmin" },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "SuperAdmin" },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

salonAdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

salonAdminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("SalonAdmin", salonAdminSchema);