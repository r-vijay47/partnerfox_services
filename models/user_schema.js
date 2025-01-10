
const mongoose = require("mongoose");

// Define user schema
const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },
      password: {
        type: String,
        required: true,
      },
      roles: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Role", // Reference to Role schema
        },
      ],
      branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch", // Reference to the User schema
        required:true
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    { timestamps: true }
  );


  const User = mongoose.model("User", userSchema);

  module.exports =  User
  

