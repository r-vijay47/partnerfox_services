const mongoose = require('mongoose');

// const pricingSchema = new mongoose.Schema({
//   unitOfMeasurement: {
//     type: String,
//     enum: [
//       'kg', 'g', 'ton', 'lb', 'oz', 'mg', 'cwt',  // Mass-based Units
//       'liter', 'ml', 'gallon', 'quart', 'cup', 'pint', 'fluid ounce', 'cbm', 'm3',  // Volume-based Units
//       'm', 'cm', 'mm', 'km', 'inches', 'feet', 'yard',  // Length-based Units
//       'piece', 'unit', 'per bag', 'per box', 'per pack', 'per pallet', 'per bottle',  // Count-based Units
//       'hour', 'minute', 'day', 'week', 'month', 'year',  // Time-based Units
//       'm2', 'cm2', 'ft2', 'yd2', 'acre', 'hectare',  // Area-based Units
//       'mile', 'yard', 'meter', 'kilometer',  // Distance-based Units
//       'per ton', 'per truck', 'per container',  // Capacity Units
//       'kWh', 'Wh', 'joule', 'BTU',  // Energy/Power Units
//       'per trip', 'per vehicle', 'per delivery', 'per lot',  // Other Common Units
//     ],
//     required: true,
//   },
//   pricePerUnit: {
//     type: Number,
//     required: true,
//     min: 0,  // Price should not be negative
//   },
//   cost: {
//     type: Number,
//     required: true,
//     min: 0,  // Cost should not be negative
//   },
//   gstPercentage: {
//     type: Number,
//     required: true,
//     min: 0,  // GST Percentage should be 0 or positive
//     max: 100, // GST Percentage cannot exceed 100
//   },
//   gstAmount: {
//     type: Number,
//     required: true,
//     min: 0,
//   },
//   totalAmountPerUnit: {
//     type: Number,
//     required: true,
//     min: 0,
//   },
//   totalAmountPerQty: {
//     type: Number,
//     required: true,
//     min: 0,
//   },
//   quantity: {
//     type: Number,
//     required: true, // Quantity is now explicitly required
//     min: 0,
//   },
// }, { timestamps: true });


const vendors = new mongoose.Schema({
    Vendorname: {
        type: String,
    },
    typeofvendor:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'vendortypes',
    },
    pricing:{
      unitOfMeasurement: {
        type: String,
        enum: [
          'kg', 'g', 'ton', 'lb', 'oz', 'mg', 'cwt',  // Mass-based Units
          'liter', 'ml', 'gallon', 'quart', 'cup', 'pint', 'fluid ounce', 'cbm', 'm3',  // Volume-based Units
          'm', 'cm', 'mm', 'km', 'inches', 'feet', 'yard','sqft',  // Length-based Units
          'piece', 'unit', 'per bag', 'per box', 'per pack', 'per pallet', 'per bottle',  // Count-based Units
          'hour', 'minute', 'day', 'week', 'month', 'year',  // Time-based Units
          'm2', 'cm2', 'ft2', 'yd2', 'acre', 'hectare',  // Area-based Units
          'mile', 'yard', 'meter', 'kilometer',  // Distance-based Units
          'per ton', 'per truck', 'per container',  // Capacity Units
          'kWh', 'Wh', 'joule', 'BTU',  // Energy/Power Units
          'per trip', 'per vehicle', 'per delivery', 'per lot',  // Other Common Units
        ],
        required: true,
      },
      pricePerUnit: {
        type: Number,
        required: true,
        min: 0,  // Price should not be negative
      },
      cost: {
        type: Number,
        required: true,
        min: 0,  // Cost should not be negative
      },
      gstPercentage: {
        type: Number,
        required: true,
        min: 0,  // GST Percentage should be 0 or positive
        max: 100, // GST Percentage cannot exceed 100
      },
      gstAmount: {
        type: Number,
        required: true,
        min: 0,
      },
      totalAmountPerUnit: {
        type: Number,
        required: true,
        min: 0,
      },
      totalAmountPerQty: {
        type: Number,
        required: true,
        min: 0,
      },
      quantity: {
        type: Number,
        required: true, // Quantity is now explicitly required
        min: 0,
      },
    },
      roles: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Role", // Reference to Role schema
            },
          ],
    vendorcategory:{
        type:[ mongoose.Schema.Types.ObjectId],
        ref: 'vendorcategory',
    },
    vendorteamsize: {
        type: String,
    },
    bankaccountnumber: {
        type: String,
    },
    bankaccountname: {
        type: String,
    },
    bankaccountifsc: {
        type: String,
    },
    mobile: {
        type: Number,
    },
    email: {
        type: String,
        required: false,
        unique: true,
        lowercase: true,
      },
      password: {
        type: String,
        required: true,
      },
    upiid: {
        type: String,
    },

    isActive:{
        type:Boolean,
        default:false
    },
    url: {
        type: String,
      }
});
const VendorsSchema = mongoose.model('vendors', vendors);
module.exports = VendorsSchema