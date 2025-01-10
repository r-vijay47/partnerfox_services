const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    //   enum: [
    //     "Structure",
    //     "Walls",
    //     "Windows",
    //     "Doors",
    //     "Painting",
    //     "Plumbing",
    //     "Electrical",
    //     "Flooring",
    //     "Fabrication",
    //   ], // Predefined service names
    },
    description: {
      type: String,
      required: false, // Brief details about the service/module
    },
    cost: {
      type: Number,
    //  required: true, // Cost for the service
    },
   
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const Module = mongoose.model("SubModule", moduleSchema);

module.exports = Module;
