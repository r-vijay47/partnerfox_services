const express = require("express");
const router = express.Router();
const Role = require("../models/roles_schema"); // Import Role model

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Roles management
 */


/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/roles", async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const role = new Role({ name, permissions });
    await role.save();
    res.status(201).json({ message: "Role created successfully.", role });
  } catch (error) {
    res.status(500).json({ message: "Error creating role.", error: error.message });
  }
});

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Retrieve all roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: List of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       500:
 *         description: Server error
 */
router.get("/roles", async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json({ message: "Roles retrieved successfully.", roles });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving roles.", error: error.message });
  }
});

/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     summary: Retrieve a role by ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Role not found
 *       500:
 *         description: Server error
 */
router.get("/roles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }
    res.status(200).json({ message: "Role retrieved successfully.", role });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving role.", error: error.message });
  }
});

/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     summary: Update a role by ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Role not found
 *       500:
 *         description: Server error
 */
router.put("/roles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, permissions } = req.body;
    const role = await Role.findByIdAndUpdate(
      id,
      { name, permissions },
      { new: true, runValidators: true }
    );
    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }
    res.status(200).json({ message: "Role updated successfully.", role });
  } catch (error) {
    res.status(500).json({ message: "Error updating role.", error: error.message });
  }
});

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Delete a role by ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       404:
 *         description: Role not found
 *       500:
 *         description: Server error
 */
router.delete("/roles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByIdAndDelete(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }
    res.status(200).json({ message: "Role deleted successfully.", role });
  } catch (error) {
    res.status(500).json({ message: "Error deleting role.", error: error.message });
  }
});

module.exports = router;
