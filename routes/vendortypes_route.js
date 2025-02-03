const express = require('express');
const router = express.Router();
const Vendortype = require('../models/vendertype_schema'); // Adjust the path as needed

/**
 * @swagger
 * tags:
 *   name: VendorTypes
 *   description: The VendorTypes managing API
 */

/**
 * @swagger
 * /vendortypes:
 *   post:
 *     summary: Create a new Vendor Type
 *     tags: [VendorTypes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - description
 *             properties:
 *               type:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *                 default: true
 *               url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vendor Type created successfully
 *       400:
 *         description: Invalid input data
 */
// Create a new vendor type
router.post('/vendortypes', async (req, res) => {
    try {
        const vendortype = new Vendortype(req.body);
        await vendortype.save();
        res.status(201).json(vendortype);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


/**
 * @swagger
 * /vendortypes:
 *   get:
 *     summary: Get all Vendor Types
 *     tags: [VendorTypes]
 *     responses:
 *       200:
 *         description: List of all Vendor Types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                   description:
 *                     type: string
 *                   isActive:
 *                     type: boolean
 *                   url:
 *                     type: string
 */

// Get all vendor types
router.get('/vendortypes', async (req, res) => {
    try {
        const vendorTypes = await Vendortype.find();
        res.status(200).json(vendorTypes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /vendortypes/{id}:
 *   get:
 *     summary: Get a Vendor Type by ID
 *     tags: [VendorTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The Vendor Type ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vendor Type details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                 description:
 *                   type: string
 *                 isActive:
 *                   type: boolean
 *                 url:
 *                   type: string
 *       404:
 *         description: Vendor Type not found
 */

// Get a single vendor type by ID
router.get('/vendortypes/:id', async (req, res) => {
    try {
        const vendortype = await Vendortype.findById(req.params.id);
        if (!vendortype) {
            return res.status(404).json({ error: 'Vendor type not found' });
        }
        res.status(200).json(vendortype);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


/**
 * @swagger
 * /vendortypes/{id}:
 *   put:
 *     summary: Update a Vendor Type
 *     tags: [VendorTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The Vendor Type ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vendor Type updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Vendor Type not found
 */
// Update a vendor type by ID
router.put('/vendortypes/:id', async (req, res) => {
    try {
        const vendortype = await Vendortype.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!vendortype) {
            return res.status(404).json({ error: 'Vendor type not found' });
        }
        res.status(200).json(vendortype);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


/**
 * @swagger
 * /vendortypes/{id}:
 *   delete:
 *     summary: Delete a Vendor Type
 *     tags: [VendorTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The Vendor Type ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vendor Type deleted successfully
 *       404:
 *         description: Vendor Type not found
 */
// Delete a vendor type by ID
router.delete('/vendortypes/:id', async (req, res) => {
    try {
        const vendortype = await Vendortype.findByIdAndDelete(req.params.id);
        if (!vendortype) {
            return res.status(404).json({ error: 'Vendor type not found' });
        }
        res.status(200).json({ message: 'Vendor type deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
