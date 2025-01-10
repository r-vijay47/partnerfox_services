// const express = require('express');
// const router = express.Router();
// const Floor = require('../../models/measurments/floor_schema'); // Import the Floor model


// /**
//  * @swagger
//  * tags:
//  *   - name: Floors
//  *     description: API endpoints for managing measurements
//  */

// /**
//  * @swagger
//  * /floors:
//  *   get:
//  *     summary: Get all floors
//  *     tags: [Floors]
//  *     responses:
//  *       200:
//  *         description: List of all floors
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/Floor'
//  */
// router.get('/', async (req, res) => {
//   try {
//     const floors = await Floor.find();
//     res.status(200).json(floors);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// /**
//  * @swagger
//  * /floors:
//  *   post:
//  *     summary: Create a new floor
//  *     tags: [Floors]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/Floor'
//  *     responses:
//  *       201:
//  *         description: Floor created
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Floor'
//  */
// router.post('/', async (req, res) => {
//   const floor = new Floor(req.body);
//   try {
//     const savedFloor = await floor.save();
//     res.status(201).json(savedFloor);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// /**
//  * @swagger
//  * /floors/{id}:
//  *   get:
//  *     summary: Get a specific floor by ID
//  *     tags: [Floors]
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         description: ID of the floor to get
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: A specific floor
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Floor'
//  */
// router.get('/:id', async (req, res) => {
//   try {
//     const floor = await Floor.findById(req.params.id);
//     if (!floor) return res.status(404).json({ message: 'Floor not found' });
//     res.status(200).json(floor);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// /**
//  * @swagger
//  * /floors/{id}:
//  *   put:
//  *     summary: Update a floor by ID
//  *     tags: [Floors]
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         description: ID of the floor to update
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/Floor'
//  *     responses:
//  *       200:
//  *         description: Updated floor
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Floor'
//  */
// router.put('/:id', async (req, res) => {
//   try {
//     const updatedFloor = await Floor.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updatedFloor) return res.status(404).json({ message: 'Floor not found' });
//     res.status(200).json(updatedFloor);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// /**
//  * @swagger
//  * /floors/{id}:
//  *   delete:
//  *     summary: Delete a floor by ID
//  *     tags: [Floors]
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         description: ID of the floor to delete
//  *         schema:
//  *           type: string
//  *     responses:
//  *       204:
//  *         description: Floor deleted
//  */
// router.delete('/:id', async (req, res) => {
//   try {
//     const deletedFloor = await Floor.findByIdAndDelete(req.params.id);
//     if (!deletedFloor) return res.status(404).json({ message: 'Floor not found' });
//     res.status(204).json();
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;
