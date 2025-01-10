const mongoose = require("mongoose");

const quotationSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead", // Reference to the Lead schema
      required: true,
      unique:true
    },
    package: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Package", // Reference to the User schema
      },

      ground_stilt:{
        ground_stilt:{type:String},
        ground_stiltsqft:{type:Number},
        ground_stiltcost:{type:Number}
      },

      floors_wise:[
        {
          floornumber:{type:String},
          ground_stiltsqftf:{type:Number},
          ground_stiltcostf:{type:Number}
        },
      ],
    services: [
      {
        module: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Module", // Reference to the Module schema
          required: true,
        },
        cost: {
          type: Number,
          required: true, // Cost of the selected service
        },
      },
    ],
    discount: {
      type: Number,
      default: 0, // Discount in percentage
    },
    totalCost: {
      type: Number,
      required: true,
      default: 0, // Total cost including discount
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch", // Reference to the User schema
      required:true
    },
    notes:[ {
        type: String, // Optional notes for the quotation
      },{timestamps:true}
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },

  { timestamps: true }
);

// // Pre-save middleware to calculate total cost
// quotationSchema.pre("save", function (next) {
//   const servicesCost = this.services.reduce((sum, service) => {
//     return sum + service.cost * service.quantity;
//   }, 0);

//   // Apply discount
//   const discountAmount = (servicesCost * this.discount) / 100;
//   this.totalCost = servicesCost - discountAmount;

//   next();
// });

const Quotation = mongoose.model("Quotation", quotationSchema);

module.exports = Quotation;
