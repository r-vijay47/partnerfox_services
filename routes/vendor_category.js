const express = require('express');
const VendorCategory = require('../models/verndor_categoryschema'); // Ensure correct path
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     VendorCategory:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           description: The type of the vendor (e.g., Product, Service)
 *         vendortype:
 *           type: string
 *           description: The vendor type object ID
 *         description:
 *           type: string
 *           description: The description of the vendor category
 *         isActive:
 *           type: boolean
 *           description: Flag to check if the category is active or not
 *           default: true
 *         url:
 *           type: string
 *           description: URL associated with the vendor category
 *       required:
 *         - type
 *         - vendortype
 *         - description
 *         - isActive
 *         - url
 */

/**
 * @swagger
 * /vendorcategories:
 *   post:
 *     summary: Create a new Vendor Category
 *     tags: [VendorCategory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VendorCategory'
 *     responses:
 *       201:
 *         description: Vendor Category created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VendorCategory'
 */
router.post('/vendorcategories', async (req, res) => {
  try {
    const { type, vendortype, description, isActive, url } = req.body;
    
    // Ensure vendortype exists
    const vendorCategory = new VendorCategory({
      type,
      vendortype,
      description,
      isActive,
      url
    });
    
    await vendorCategory.save();
    res.status(201).json(vendorCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /vendorcategories:
 *   get:
 *     summary: Get all Vendor Categories
 *     tags: [VendorCategory]
 *     responses:
 *       200:
 *         description: A list of Vendor Categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VendorCategory'
 */
router.get('/vendorcategories', async (req, res) => {
  try {
    const categories = await VendorCategory.find().populate('vendortype');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /vendorcategories/{id}:
 *   get:
 *     summary: Get a Vendor Category by ID
 *     tags: [VendorCategory]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the Vendor Category
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vendor Category found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VendorCategory'
 *       404:
 *         description: Vendor Category not found
 */
router.get('/vendorcategories/:id', async (req, res) => {
  try {
    const category = await VendorCategory.findById(req.params.id).populate('vendortype');
    if (!category) {
      return res.status(404).json({ message: 'Vendor Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /vendorcategories/{id}:
 *   put:
 *     summary: Update a Vendor Category by ID
 *     tags: [VendorCategory]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the Vendor Category
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VendorCategory'
 *     responses:
 *       200:
 *         description: Vendor Category updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VendorCategory'
 *       404:
 *         description: Vendor Category not found
 */
router.put('/vendorcategories/:id', async (req, res) => {
  try {
    const category = await VendorCategory.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('vendortype');
    if (!category) {
      return res.status(404).json({ message: 'Vendor Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /vendorcategories/{id}:
 *   delete:
 *     summary: Delete a Vendor Category by ID
 *     tags: [VendorCategory]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the Vendor Category
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Vendor Category deleted
 *       404:
 *         description: Vendor Category not found
 */
router.delete('/vendorcategories/:id', async (req, res) => {
  try {
    const category = await VendorCategory.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Vendor Category not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
