// const express = require('express');
// const router = express.Router();
// const Measurement = require('../../models/measurments/measurements_schema'); // Import the Measurement model
// /**
//  * @swagger
//  * tags:
//  *   - name: Measurements
//  *     description: API endpoints for managing measurements
//  */

// /**
//  * @swagger
//  * /measurement:
//  *   get:
//  *     summary: Get all measurements
//  *     tags: [Measurement]
//  *     responses:
//  *       200:
//  *         description: List of all measurements
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/Measurement'
//  */
// router.get('/', async (req, res) => {
//   try {
//     const measurements = await Measurement.find();
//     res.status(200).json(measurements);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// /**
//  * @swagger
//  * /measurement:
//  *   post:
//  *     summary: Create a new measurement
//  *     tags: [Measurement]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/Measurement'
//  *     responses:
//  *       201:
//  *         description: Measurement created
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Measurement'
//  */
// router.post('/', async (req, res) => {
//   const measurement = new Measurement(req.body);
//   try {
//     const savedMeasurement = await measurement.save();
//     res.status(201).json(savedMeasurement);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// /**
//  * @swagger
//  * /measurement/{id}:
//  *   get:
//  *     summary: Get a specific measurement by ID
//  *     tags: [Measurement]
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         description: ID of the measurement to get
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: A specific measurement
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Measurement'
//  */
// router.get('/:id', async (req, res) => {
//   try {
//     const measurement = await Measurement.findById(req.params.id);
//     if (!measurement) return res.status(404).json({ message: 'Measurement not found' });
//     res.status(200).json(measurement);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// /**
//  * @swagger
//  * /measurement/{id}:
//  *   put:
//  *     summary: Update a measurement by ID
//  *     tags: [Measurement]
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         description: ID of the measurement to update
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/Measurement'
//  *     responses:
//  *       200:
//  *         description: Updated measurement
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Measurement'
//  */
// router.put('/:id', async (req, res) => {
//   try {
//     const updatedMeasurement = await Measurement.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updatedMeasurement) return res.status(404).json({ message: 'Measurement not found' });
//     res.status(200).json(updatedMeasurement);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// /**
//  * @swagger
//  * /measurement/{id}:
//  *   delete:
//  *     summary: Delete a measurement by ID
//  *     tags: [Measurement]
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         description: ID of the measurement to delete
//  *         schema:
//  *           type: string
//  *     responses:
//  *       204:
//  *         description: Measurement deleted
//  */
// router.delete('/:id', async (req, res) => {
//   try {
//     const deletedMeasurement = await Measurement.findByIdAndDelete(req.params.id);
//     if (!deletedMeasurement) return res.status(404).json({ message: 'Measurement not found' });
//     res.status(204).json();
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;
