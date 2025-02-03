const mongoose = require('mongoose');


const vendors = new mongoose.Schema({
    Vendorname: {
        type: String,
    },
    email: {
        type: String,
     //   required: true,
     //    unique: true,
     //   lowercase: true,
      },
      password: {
        type: String,
     //   required: true,
      },
    typeofvendor:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'vendortypes',
    },
      roles: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Role", // Reference to Role schema
            },
          ],
    vendorcategory:{
        type:[ mongoose.Schema.Types.ObjectId],
        ref: 'category',
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