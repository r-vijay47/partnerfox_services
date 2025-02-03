const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User schema
      required: true,
    },
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead", // Reference to the Lead schema
      required: true,
    },
    quotation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quotation", // Reference to the Quotation schema
     required: true,
    },
    amount: {
      type: Number,
      required: true, // Amount paid by the user
    },
    paymentMode: {
      type: String,
      enum: ["Cash", "Credit Card", "Bank Transfer", "UPI", "Cheque"],
      required: true, // Payment method used
    },
    paymentDate: {
      type: Date,
      default: Date.now, // Date of payment
    },
    referenceNumber: {
      type: String, // Optional reference number for tracking
      required: false,
    },
    notes: {
      type: String, // Optional notes about the payment
    },
    invoice_url: {
      type: String, // Optional notes about the payment
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
