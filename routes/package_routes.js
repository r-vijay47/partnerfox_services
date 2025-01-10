const express = require("express");
const router = express.Router();
const Package = require("../models/packages_schema");

/**
 * @swagger
 * tags:
 *   name: Packages
 *   description: Package management
 */

/**
 * @swagger
 * /packages:
 *   get:
 *     summary: Get all packages
 *     tags: [Packages]
 *     responses:
 *       200:
 *         description: List of all packages
 *       500:
 *         description: Server error
 */
router.get("/packages", async (req, res) => {
  try {
    const packages = await Package.find().populate("services.modules_service branch services.sub_modules");
    res.status(200).json(packages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /packages:
 *   post:
 *     summary: Create a new package
 *     tags: [Packages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Package'
 *     responses:
 *       201:
 *         description: Package created
 *       500:
 *         description: Server error
 */
router.post("/packages", async (req, res) => {
  try {
    const package = new Package(req.body);
    await package.save();
    res.status(201).json(package);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /packages/{id}:
 *   get:
 *     summary: Get a package by ID
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Package ID
 *     responses:
 *       200:
 *         description: Package found
 *       404:
 *         description: Package not found
 *       500:
 *         description: Server error
 */
router.get("/packages/:id", async (req, res) => {
  try {
    const package = await Package.findById(req.params.id).populate("services.modules_service");
    if (!package) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.status(200).json(package);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /packages/{id}:
 *   put:
 *     summary: Update a package by ID
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Package ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Package'
 *     responses:
 *       200:
 *         description: Package updated
 *       404:
 *         description: Package not found
 *       500:
 *         description: Server error
 */
router.put("/packages/:id", async (req, res) => {
  try {
    const package = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!package) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.status(200).json(package);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /packages/{id}:
 *   delete:
 *     summary: Delete a package by ID
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Package ID
 *     responses:
 *       200:
 *         description: Package deleted
 *       404:
 *         description: Package not found
 *       500:
 *         description: Server error
 */
router.delete("/packages/:id", async (req, res) => {
  try {
    const package = await Package.findByIdAndDelete(req.params.id);
    if (!package) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.status(200).json({ message: "Package deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
