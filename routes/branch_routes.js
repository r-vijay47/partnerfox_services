const express = require('express');
const Branch = require('../models/branches_schema');
const User = require("../models/user_schema");
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Branch
 *   description: Branch management
 */
 
/**
 * @swagger
 * /branches:
 *   get:
 *     summary: Get all branches
 *     tags: [Branch]
 *     responses:
 *       200:
 *         description: A list of branches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Branch'
 */
router.get('/branches', async (req, res) => {
  try {
    const branches = await Branch.find();
    res.status(200).json(branches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /branches/{id}:
 *   get:
 *     summary: Get a single branch by ID
 *     tags: [Branch]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The branch ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A branch
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 *       404:
 *         description: Branch not found
 */
router.get('/branches/:id', async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    res.status(200).json(branch);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /branches:
 *   post:
 *     summary: Create a new branch
*     tags: [Branch]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Branch'
 *     responses:
 *       201:
 *         description: Branch created
 *       400:
 *         description: Invalid input
 */
router.post('/branches', async (req, res) => {
  const { name } = req.body;
  const branch = new Branch({ name });

  try {
    const newBranch = await branch.save();
    res.status(201).json(newBranch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /branches/{id}:
 *   put:
 *     summary: Update a branch by ID
 *     tags: [Branch]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The branch ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Branch'
 *     responses:
 *       200:
 *         description: Branch updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Branch not found
 */
router.put('/branches/:id', async (req, res) => {
  try {
    const updatedBranch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBranch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    res.status(200).json(updatedBranch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /branches/{id}:
 *   delete:
 *     summary: Delete a branch by ID
 *     tags: [Branch] 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The branch ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Branch deleted
 *       404:
 *         description: Branch not found
 */
router.delete('/branches/:id', async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    res.status(200).json({ message: 'Branch deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




/**
 * @swagger
 * /branches/{branchId}/users:
 *   get:
 *     summary: Get all users by branch ID
 *     tags: [Branch]
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the branch
 *     responses:
 *       200:
 *         description: A list of users in the branch
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */
router.get("/branches/:branchId/users", async (req, res) => {
  const { branchId } = req.params;

  try {
    // Check if the branch exists
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    // Find users associated with the branch
    const users = await User.find({ branch: branchId }).populate("roles branch");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
module.exports = router;
