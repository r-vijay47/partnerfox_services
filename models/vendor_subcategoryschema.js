const mongoose = require('mongoose');
const vendorsubcategory = new mongoose.Schema({
    type: {
        type: String,
     //  enum:['Product','Service']
    },
    vendorcategory:{
        type:[ mongoose.Schema.Types.ObjectId],
        ref: 'vendorcategory',
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
const VendorsubCategory = mongoose.model('vendorcategory', vendorsubcategory);
module.exports = VendorsubCategory                             