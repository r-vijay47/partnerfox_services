const mongoose = require("mongoose");

// Define role schema
const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
 //   enum: ["admin", "editor", "viewer"], // Define allowed roles
  
  },
  permissions: {
    type: [String], // List of permissions like ["create", "read", "update", "delete"]
    enum: ["create", "read", "update", "delete"], 
    default: ["read"],
  },
});

const Role = mongoose.model("Role", roleSchema);

module.exports = Role