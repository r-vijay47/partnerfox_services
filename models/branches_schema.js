const mongoose = require("mongoose");

// Define role schema
const branches = new mongoose.Schema({
    name: {
        type: String,  // The name field will be a string
        required: true, // This field is mandatory
        unique: true,   // This field must be unique across the collection
        trim: true,     // Automatically trims spaces before and after the name
        minlength: [3, 'Branch name must be at least 3 characters long'], // Minimum length validation
        maxlength: [50, 'Branch name must be at most 50 characters long'] // Maximum length validation
      }
});

const Branch = mongoose.model("Branch", branches);

module.exports = Branch