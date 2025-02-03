const mongoose = require('mongoose');
const vendortype = new mongoose.Schema({
    type: {
        type: String,
     //  enum:['Product','Service']
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
const Vendortype = mongoose.model('vendortypes', vendortype);
module.exports = Vendortype                             