const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    // Customer Details
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      mobile: { type: String, required: true },
      gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true,
      },
      lastName: { type: String, required: true },
    },
    // Salon and Branch Details
    salonAdminId: { type: mongoose.Schema.Types.ObjectId, ref: "SalonAdmin" }, // To track which salon booked this appointment
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    // Services Details
    services: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true }, // Price of the service
        time: { type: String, required: true }, // Duration of the service
      },
    ],
    // Staff Details
    staff: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],
    // Appointment Details
    date: { type: Date, required: true }, // Date of the appointment
    time: { type: String, required: true }, // Time of the appointment
    customerType: {
      type: String,
      enum: ["walkin", "appointment"],
      required: true,
    }, // Type of customer
    staffType: { type: String, enum: ["single", "multiple"], required: true }, // Type of staff assignment
    appointmentNote: { type: String, trim: true }, // Notes for the appointment
    clientNote: { type: String, trim: true }, // Notes for the client
    // Status and Payment
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending", // Default status is set to "Pending"
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
    totalPrice: { type: Number, required: true }, // Total price of all services
  },
  { timestamps: true }
);

// Validate that the staff array is not empty
AppointmentSchema.pre("save", function (next) {
  if (this.staff.length === 0) {
    return next(new Error("At least one staff member must be assigned."));
  }
  next();
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
