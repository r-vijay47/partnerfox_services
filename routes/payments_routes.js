const express = require("express");
const router = express.Router();
const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');
const User = require('../models/project_schema')
const Project = require('../models/project_schema')
const Payment = require("../models/payments_schema");
const mongoose = require("mongoose");
/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payments management
 */
 
// Create a payment
/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Create a new payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       201:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
router.post("/payments", async (req, res) => {
  try {
    // Create a new Payment object from request body
    const payment = new Payment(req.body);

    // Retrieve project and SPM details
    const project = await Project.findOne({ lead: req.body.lead });
    const spm = await User.find({ "roles._id": new mongoose.Types.ObjectId("673d8e54c2549fb2e43969d6") });

    // If the project doesn't exist, create a new one
    if (!project) {
      const createProject = new Project({
        spm: [spm._id],
        quotation: req.body.quotation,
        status: "Initiated",

        lead: req.body.lead,
        client: req.body.user
      });
      await createProject.save();
    }

    // Save the payment first
    const savedPayment = await payment.save();

    // Generate PDF Invoice
    const doc = new PDFDocument();
   // const invoiceFilename = `Invoice_${savedPayment._id}.pdf`;
 
    // Dynamically set the path for the invoice folder based on the project root
    const projectRoot = path.resolve(__dirname, '../');  // Move up two levels to get to the project root
    const invoicesFolder = path.join(projectRoot, 'invoices'); // Reference the 'invoices' folder

    // Ensure that the 'invoices' folder exists
    if (!fs.existsSync(invoicesFolder)) {
      fs.mkdirSync(invoicesFolder, { recursive: true });  // Create the folder if it doesn't exist
    }

    const invoiceFilename = `Invoice_${savedPayment._id}.pdf`;
    const invoicePath = path.join(invoicesFolder, invoiceFilename); // Set the full path to the invoice file

    // Pipe the PDF into a file
    doc.pipe(fs.createWriteStream(invoicePath));

    // Add content to the PDF
    doc.fontSize(20).text('Invoice', { align: 'center' });

    doc.fontSize(12).text(`Payment ID: ${savedPayment._id}`, 100, 100);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 100, 120);
    doc.text(`Client: ${req.body.user}`, 100, 140);
    doc.text(`Lead: ${req.body.lead}`, 100, 160);
    doc.text(`Amount: ${req.body.amount}`, 100, 180);
    doc.text(`Quotation ID: ${req.body.quotation}`, 100, 200);

    doc.end();
    console.log(invoicePath);
    try {
   
      // Set the URL path to access the generated invoice
     // const invoiceUrl = `../invoices/${invoiceFilename}`;
      const invoiceUrl = `../invoices/${invoiceFilename}`;
      
      // Update the payment document with the generated invoice URL
      savedPayment.invoice_url = invoiceUrl;
      
      // Save the updated payment document with the invoice URL
      await savedPayment.save();
      
      // Send the response back to the user with the generated invoice URL
      res.status(201).json({
        message: 'Payment created successfully and invoice generated.',
        invoiceUrl: invoiceUrl,  // URL to download the invoice
        payment: savedPayment
      });
    } catch (error) {
      console.error('Error updating payment with invoice URL:', error);
      res.status(500).json({ error: 'Failed to update payment with invoice URL' });
    }
    // After the file is created, update the payment document with the URL of the generated invoice
    // doc.on('finish', async () => {
    //   console.log('PDF generation completed.');
 
    // });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Get all payments
/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Retrieve all payments
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: List of all payments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 *       500:
 *         description: Server error
 */
router.get("/payments", async (req, res) => {
  try {
    const payments = await Payment.find().populate("user lead quotation");
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a payment by ID
/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     summary: Retrieve a payment by ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the payment to retrieve
 *     responses:
 *       200:
 *         description: Payment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.get("/payments/:id", async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("user lead quotation");
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a payment
/**
 * @swagger
 * /payments/{id}:
 *   put:
 *     summary: Update a payment
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the payment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       200:
 *         description: Payment updated successfully
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.put("/payments/:id", async (req, res) => {
  try {
    const updatedPayment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedPayment) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json(updatedPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a payment
/**
 * @swagger
 * /payments/{id}:
 *   delete:
 *     summary: Delete a payment
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the payment to delete
 *     responses:
 *       200:
 *         description: Payment deleted successfully
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.delete("/payments/:id", async (req, res) => {
  try {
    const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
    if (!deletedPayment) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
