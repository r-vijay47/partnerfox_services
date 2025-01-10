const mongoose = require("mongoose");

const packageschema = new mongoose.Schema(
 
  {
    name: {
      type: String,
      required: true,
    },
    services:[{

       modules_service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Module", // Reference to the User schema
          },
          sub_modules:[{
           submodule: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "SubModule ", // Reference to the User schema
            },
            cost: {
              type: Number,
              required: true, // Cost for the service
            },
          }
          ],
          cost: {
            type: Number,
            required: true, // Cost for the service
          },
        }
    ],
    description: {
      type: String,
      required: false, // Brief details about the service/module
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch", // Reference to the User schema
      required:true
    },
    cost: {
      type: Number,
      required: true, // Cost for the service
    },
        
    // office: {
    //     type: Number,
    //     required: true, // Cost for the service
    //   },
          
    // cp: {
    //     type: Number,
    //     required: true, // Cost for the service
    //   },
          
    // profit: {
    //     type: Number,
    //     required: true, // Cost for the service
    //   },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const Packageschema = mongoose.model("Package", packageschema);

module.exports = Packageschema;
