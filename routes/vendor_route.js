const VendorsSchema = require('../models/vendor_schema'); // assuming this is in a `models` folder
const Vendors = require('../models/vendor_schema'); // assuming this is in a `models` folder
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();
const JWT_SECRET = "KrisHna@547"

/**
 * @swagger
 * components:
 *   schemas:
 *     Vendor:
 *       type: object
 *       properties:
 *         Vendorname:
 *           type: string
 *         typeofvendor:
 *           type: array
 *           items:
 *             type: string
 *         pricing:
 *           type: object
 *           properties:
 *             unitOfMeasurement:
 *               type: string
 *             pricePerUnit:
 *               type: number
 *             cost:
 *               type: number
 *             gstPercentage:
 *               type: number
 *             gstAmount:
 *               type: number
 *             totalAmountPerUnit:
 *               type: number
 *             totalAmountPerQty:
 *               type: number
 *             quantity:
 *               type: number
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *         vendorcategory:
 *           type: array
 *           items:
 *             type: string
 *         vendorteamsize:
 *           type: string
 *         bankaccountnumber:
 *           type: string
 *         bankaccountname:
 *           type: string
 *         bankaccountifsc:
 *           type: string
 *         mobile:
 *           type: number
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         upiid:
 *           type: string
 *         isActive:
 *           type: boolean
 *         url:
 *           type: string
 */

/**
 * @swagger
 * /vendors:
 *   post:
 *     summary: Create a new vendor
 *     tags: [Vendors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vendor'
 *     responses:
 *       201:
 *         description: Vendor created successfully
 */
router.post('/vendors', async (req, res) => {
  try {
    const newVendor = new Vendors(req.body);
    await newVendor.save();
    res.status(201).json(newVendor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /vendors/{id}:
 *   get:
 *     summary: Get a vendor by ID
 *     tags: [Vendors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Vendor ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vendor found
 *       404:
 *         description: Vendor not found
 */
router.get('/vendors/:id', async (req, res) => {
  try {
    const vendor = await Vendors.findById(req.params.id).populate('typeofvendor roles vendorcategory');
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.json(vendor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /vendors:
 *   get:
 *     summary: Get a vendor by ID
 *     tags: [Vendors]
 *     responses:
 *       200:
 *         description: Vendor found
 *       404:
 *         description: Vendor not found
 */
router.get('/vendors', async (req, res) => {
  try {
    const vendor = await Vendors.find().populate('typeofvendor roles vendorcategory');
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.json(vendor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /vendors/{id}:
 *   put:
 *     summary: Update a vendor by ID
 *     tags: [Vendors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Vendor ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vendor'
 *     responses:
 *       200:
 *         description: Vendor updated successfully
 *       404:
 *         description: Vendor not found
 */
router.put('/vendors/:id', async (req, res) => {
  try {
    const updatedVendor = await Vendors.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.json(updatedVendor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /vendors/{id}:
 *   delete:
 *     summary: Delete a vendor by ID
 *     tags: [Vendors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Vendor ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vendor deleted successfully
 *       404:
 *         description: Vendor not found
 */
router.delete('/vendors/:id', async (req, res) => {
  try {
    const deletedVendor = await Vendors.findByIdAndDelete(req.params.id);
    if (!deletedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});




// Login Vendor
loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body)

    // Check if vendor exists
    const vendor = await VendorsSchema.findOne({ email: email });
    if (!vendor) return res.status(400).json({ message: 'Vendor not found' });

    // Check password

   // const isMatch = await bcrypt.compare(password, vendor.password);
   if(password!=vendor.password)
   {
    //if (!isMatch) 
        return res.status(400).json({ message: 'Invalid credentials' });

   }
    // Create and assign JWT token
    const token = jwt.sign({ id: vendor._id }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ token, });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



// Forgot Password (Request)
forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const vendor = await VendorsSchema.findOne({ email: email });
    if (!vendor) return res.status(400).json({ message: 'Vendor not found' });

    // Generate a password reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    vendor.resetPasswordToken = resetToken;
    vendor.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await vendor.save();

    // Send reset token to vendor email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
      }
    });

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const mailOptions = {
      to: vendor.email,
      from: 'your-email@gmail.com',
      subject: 'Password Reset Request',
      text: `Click the following link to reset your password: ${resetUrl}`
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Password reset link sent' });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// Reset Password (Process)
resetPassword = async (req, res) => {
    const { token, password } = req.body;
  
    try {
      const vendor = await VendorsSchema.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });
  
      if (!vendor) return res.status(400).json({ message: 'Password reset token is invalid or expired' });
  
      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 10);
      vendor.password = hashedPassword;
      vendor.resetPasswordToken = undefined;
      vendor.resetPasswordExpires = undefined;
      await vendor.save();
  
      return res.status(200).json({ message: 'Password reset successfully' });
  
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

  // Approve Vendor / Change Status to Active
approveVendor = async (req, res) => {
    try {
      const vendor = await VendorsSchema.findById(req.params.id);
      if (!vendor) return res.status(404).json({ message: "Vendor not found" });
  
      vendor.isActive = true;
      await vendor.save();
      return res.status(200).json({ message: "Vendor approved and status set to active" });
  
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };


//  router.post('/vendors', createVendor);

//   router.get('/vendors', getAllVendors);


//   router.get('/vendors/:id', getVendorById);


//   router.put('/vendors/:id', updateVendor);
 
//   router.delete('/vendors/:id', deleteVendor);
  

/**
 * @swagger
 * /vendors/login:
 *   post:
 *     summary: Vendor login
 *     tags: [Vendors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns a JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 vendor:
 *                   type: object
 *                   properties:
 *                     Vendorname:
 *                       type: string
 *                     email:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *       400:
 *         description: Invalid credentials
 */

  // Login
  router.post('/vendors/login', loginVendor);
  
  // Forgot Password and Reset
  /**
 * @swagger
 * /vendors/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Vendors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset link sent to email
 *       400:
 *         description: Vendor not found
 */
  router.post('/vendors/forgot-password', forgotPassword);
  /**
 * @swagger
 * /vendors/reset-password:
 *   post:
 *     summary: Reset vendor password
 *     tags: [Vendors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired reset token
 */

  router.post('/vendors/reset-password', resetPassword);
  
  // Approve Vendor (Change status to active)
  /**
 * @swagger
 * /vendors/approve/{id}:
 *   put:
 *     summary: Approve vendor and change status to active
 *     tags: [Vendors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Vendor ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vendor approved and status set to active
 *       404:
 *         description: Vendor not found
 */
  router.put('/vendors/approve/:id', approveVendor);
  
  module.exports = router;
    