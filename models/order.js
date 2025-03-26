const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["Processing", "Completed"],
      default: "Completed",
    }, // Default Completed
    paymentStatus: {
      type: String,
      enum: ["Paid","Pending" ],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: [
        "Cash",
        "Debit Card",
        "Credit Card",
        "UPI",
        "Paytm",
        "PhonePe",
        "Google Pay",
        "Other",
      ],
      required: true,
    },
    paymentDetails: {
      cardNumber: { type: String, trim: true }, // For Debit/Credit Cards
      cardHolderName: { type: String, trim: true },
      expiryDate: { type: String, trim: true }, // MM/YY Format
      cvv: { type: String, trim: true },
      upiId: { type: String, trim: true }, // For UPI Payments
      transactionId: { type: String, trim: true }, // For Any Digital Payment
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
