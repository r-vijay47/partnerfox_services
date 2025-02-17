const mongoose = require('mongoose');
const vendorcategory = new mongoose.Schema({
    type: {
        type: String,
     //  enum:['Product','Service']
    },
    vendortype: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "vendortypes", // Reference to the User schema
            required:true
          },
    description: {
        type: String,
    },
    isActive:{
        type:Boolean,
        default:true
    },
    url: {
        type: String,
      }
});
const VendorCategory = mongoose.model('vendorcategory', vendorcategory);
module.exports = VendorCategory                             