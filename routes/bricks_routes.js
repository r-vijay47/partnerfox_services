const express = require("express");
const router = express.Router();
const Brick = require("../models/bricks_schema");

/**
 * @swagger
 * tags:
 *   name: Bricks
 *   description: API for managing bricks
 */

/**
 * @swagger
 * /bricks:
 *   get:
 *     summary: Get all bricks
 *     tags: [Bricks]
 *     responses:
 *       200:
 *         description: List of all bricks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/bricks", async (req, res) => {
  try {
    const bricks = await Brick.find();
    res.json(bricks);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /bricks/{id}:
 *   get:
 *     summary: Get a brick by ID
 *     tags: [Bricks]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the brick
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Brick details
 *       404:
 *         description: Brick not found
 */
router.get("/bricks/:id", async (req, res) => {
  try {
    const brick = await Brick.findById(req.params.id);
    if (!brick) return res.status(404).send("Brick not found");
    res.json(brick);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /bricks:
 *   post:
 *     summary: Create a new brick
 *     tags: [Bricks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serialNumber:
 *                 type: number
 *               brickType:
 *                 type: string
 *               category:
 *                 type: string
 *               dimensions:
 *                 type: object
 *                 properties:
 *                   length:
 *                     type: number
 *                   width:
 *                     type: number
 *                   thickness:
 *                     type: number
 *     responses:
 *       201:
 *         description: Brick created successfully
 */
router.post("/bricks", async (req, res) => {
  try {
    const brick = new Brick(req.body);
    await brick.save();
    res.status(201).json(brick);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /bricks/{id}:
 *   put:
 *     summary: Update a brick by ID
 *     tags: [Bricks]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the brick
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brickType:
 *                 type: string
 *               category:
 *                 type: string
 *               dimensions:
 *                 type: object
 *                 properties:
 *                   length:
 *                     type: number
 *                   width:
 *                     type: number
 *                   thickness:
 *                     type: number
 *     responses:
 *       200:
 *         description: Brick updated successfully
 */
router.put("/bricks/:id", async (req, res) => {
  try {
    const brick = await Brick.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!brick) return res.status(404).send("Brick not found");
    res.json(brick);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /bricks/{id}:
 *   delete:
 *     summary: Delete a brick by ID
 *     tags: [Bricks]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the brick
 *     responses:
 *       200:
 *         description: Brick deleted successfully
 */
router.delete("/bricks/:id", async (req, res) => {
  try {
    const brick = await Brick.findByIdAndDelete(req.params.id);
    if (!brick) return res.status(404).send("Brick not found");
    res.send("Brick deleted successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
