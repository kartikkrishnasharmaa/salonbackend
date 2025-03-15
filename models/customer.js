const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    salonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Salon",
      default: null,
    }, // ✅ Optional salonId
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" }, // Updated

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "createdByModel",
      default: null,
    },
    createdByModel: {
      type: String,
      enum: ["SalonAdmin", "Manager", "Self"],
      default: "SalonAdmin",
    }, // ✅ Fixed enum
  },
  { timestamps: true } // ✅ Add timestamps (createdAt, updatedAt)
);

// ✅ Password Hashing Middleware (Before Saving)
customerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("Customer", customerSchema);
