const mongoose = require("mongoose");



const measurement = new mongoose.Schema({

  ground_stilt: {
    type: String,
    enum: ["Stilt", "Ground",], // Workflow status
    default: "Ground",
  },
  noof_floors: [{
    type: Number, // Optional notes for each workflow item
  },],

});





const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[6-9]\d{9}$/.test(v); // Validate Indian mobile numbers
        },
        message: (props) => `${props.value} is not a valid mobile number!`,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    location: {
      type: String,
      required: true,
    },
    plotSqYards: {
      type: Number,
      required: true,
    },
    measurement:measurement,
    buildingType: {
      type: String,
      required: true,
    },
    propertyType: {
      type: String,
      required: true,
    },
    looking: {
      type: String,
      required: true,
    },
    possesionin: {
      type: String,
      required: true,
    },
    siteDetails: {
      type: String,
    },
    cameFrom: {
      type: String,
      enum: ["Advertisement", "Referral", "Website", "Other"], // Example sources
      required: true,
    },
    contacttoat: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to the User schema
          },  
           contactnotes:   {
            type: String,
            required: false,
          },
          addedAt: {
            type: Date,
            default: Date.now, // Automatically set the timestamp when a contact is added
          },
        },
      ],
    // firstPersonContacted: {
    //   type: String,
    //   required: true,
    // },
    // secondPersonContacted: {
    //   type: String,
    // },
    meetings:  [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to the User schema
          },
          meetingnotes:   {
            type: String,
            required: false,
          },
          addedAt: {
            type: Date,
            default: Date.now, // Automatically set the timestamp when a contact is added
          },
        },
      ],
      branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch", // Reference to the User schema
        required:true
      },
    package: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Package", // Reference to the User schema
      },
      services:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Module", // Reference to the User schema
          },
      ],
    generateOptions: {
      type: [String],
      enum: ["whatsapp", "email", "printout"], // Generate options
    },
    leadStatus: {
      type: String,
      enum: ["refer", "enquiry", "lead", "project"], // Define allowed statuses
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Lead = mongoose.model("Lead", leadSchema);

module.exports = Lead;
