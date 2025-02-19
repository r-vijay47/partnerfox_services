const mongoose = require("mongoose");

const BrickSchema = new mongoose.Schema({
  brickType: {
    type: String,
    required: true,
 //   enum: ["Red Brick", "Other Types"], // Add more types if necessary
  },
  category: {
    type: String,
    required: true,
 //   enum: ["Modular", "Non-Modular"], // Add categories if applicable
  },
  unit: {
    type: String,
    enum: ['cm', 'mm', 'inches', 'feet', 'yard'],
    required: true,
    default: 'cm'
  },
  dimensions: {
    length: {
      type: Number,
       required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    thickness: {
      type: Number,
      required: true,
    },
    wallthickness: {
      type: Number,
      required: false,
      default:0
    },
  },
}, {
  timestamps: true, // Optional: Adds createdAt and updatedAt fields
});

const Brick = mongoose.model("Bricks", BrickSchema);

module.exports = Brick;
