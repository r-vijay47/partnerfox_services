const express = require("express");
const router = express.Router();
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
    const payment = new Payment(req.body);

    const project = await Project.findOne({lead:req.body.lead});
    console.log("project");
    console.log(project);
    const spm = await User.find({"roles._id":new  mongoose.Types.ObjectId("673d8e54c2549fb2e43969d6")});
    console.log("SPM");
    console.log(spm);

    if(project){
      console.log(" Project Exists");
      console.log(project);
    }else{
     
      const createProject = new Project({spm:[spm._id],quotation:req.body.quotation,status:"Initiated",lead:req.body.lead,client:req.body.user});
     const savedproject = await createProject.save();
     console.log(savedproject);

    }
    const savedPayment = await payment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
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
