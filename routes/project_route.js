const express = require("express");
const router = express.Router();
const Project = require("../models/project_schema");
const Measurement = require("../models/measurments/measurements_schema");
const Designerforprojects = require('../models/designerforproject_schema')
const User = require("../models/user_schema"); 

// Middleware to verify user roles
const verifyRole = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id); // Assuming req.user contains the authenticated user
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!requiredRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Unauthorized role' });
      }

      next();
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Server error' });
    }
  };
};

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: API for managing projects
 */

/**
 * @swagger
 * /projects:
 *   post:
 *     tags: [Projects]
 *     summary: Create a new project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Validation error
 */
router.post("/projects", async (req, res) => {
  try {
    const project = new Project(req.body);
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /projects:
 *   get:
 *     tags: [Projects]
 *     summary: Retrieve all projects
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 */
router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find().populate("lead quotation projectmanager desiginerorarchiteck spg measurement createdBy spm");
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     tags: [Projects]
 *     summary: Retrieve a project by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 */
router.get("/projects/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("lead quotation projectmanager desiginerorarchiteck spg createdBy");
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     tags: [Projects]
 *     summary: Update a project
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       404:
 *         description: Project not found
 */
router.put("/projects/:id", async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProject) return res.status(404).json({ error: "Project not found" });
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     tags: [Projects]
 *     summary: Delete a project
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 */
router.delete("/projects/:id", async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) return res.status(404).json({ error: "Project not found" });
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/**
 * @swagger
 * /projects/{id}/assign-role:
 *   put:
 *     tags: [Projects]
 *     summary: Assign users to a specific role in a project
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *       - in: query
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [desiginerorarchiteck, spg, qc, client, eieldsengineers, arc, measurement, spm]
 *         description: Role to assign
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               users:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of user IDs to assign to the role
 *     responses:
 *       200:
 *         description: Role assigned successfully
 *       404:
 *         description: Project not found
 *       400:
 *         description: Invalid role or request body
 */
router.put("/projects/:id/assign-role", async (req, res) => {
  const { role } = req.query;
  const { users } = req.body;

  const validRoles = [
    "desiginerorarchiteck",
    "spg",
    "qc",
    "client",
    "eieldsengineers",
    "arc",
    "measurement",
    "spm",
  ];

  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: "Invalid role specified" });
  }

  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if(role =="desiginerorarchiteck"){

        await Designerforprojects.create({status:"Initiated",lead:project.lead,project:project._id,designer:users})

    }
    else if(role =="measurement"){

        await Measurement.create({projectId:project._id,users:users,leadId:project.lead,unit:"cm",totalFloors:1})
    }
    project[role] = users;
    await project.save();

    res.status(200).json({ message: `Role '${role}' updated successfully`, project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /projects/{id}/get-role:
 *   get:
 *     tags: [Projects]
 *     summary: Get assigned users for a specific role in a project
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *       - in: query
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [desiginerorarchiteck, spg, qc, client, eieldsengineers, arc, measurement, spm]
 *         description: Role to retrieve
 *     responses:
 *       200:
 *         description: List of users assigned to the role
 *       404:
 *         description: Project not found
 *       400:
 *         description: Invalid role
 */
router.get("/projects/:id/get-role", async (req, res) => {
  const { role } = req.query;

  const validRoles = [
    "desiginerorarchiteck",
    "spg",
    "qc",
    "client",
    "eieldsengineers",
    "arc",
    "measurement",
    "spm",
  ];

  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: "Invalid role specified" });
  }

  try {
    const project = await Project.findById(req.params.id).populate(role);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json({ role, users: project[role] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Example API route to update project status
/**
 * @swagger
 * /project/{id}/status:
 *   put:
 *     tags: [Projects]
 *     summary: Update the status of a project to "In Progress"
 *     description: Only "Project Manager" or "SPM" can change the status of a project to "In Progress"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the project to update.
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [inprogress, completed, qc, client, eieldsengineers, arc, measurement, spm]
 *         description: Role to retrieve
 *     responses:
 *       200:
 *         description: Successfully updated project status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid request, either project is already in progress or status is invalid.
 *       403:
 *         description: Unauthorized user role (only "Project Manager" or "SPM" can change the status).
 *       404:
 *         description: Project not found.
 *       500:
 *         description: Server error.
 */
// API to change the project status
router.put('/project/:id/status', async (req, res) => {
  console.log(req.body)
  try {
    const { id } = req.params;
    const { status } = req.query;

   
    // Validate the status change request
    // if (status !== 'InProgress') {
    //   return res.status(400).json({ message: 'Only "In Progress" status change is allowed here' });
    // }

    // Find the project by ID
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the current status is not already "In Progress"
    if (project.status === 'In Progress') {
      return res.status(400).json({ message: 'Project is already in progress' });
    }

    // Update project status to "In Progress"
    project.status = 'In Progress';
    await project.save();

    return res.status(200).json({ message: 'Project status updated to In Progress', project });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});


/**
 * @swagger
 * /projects/{id}/remove-role:
 *   delete:
 *     tags: [Projects]
 *     summary: Remove users from a specific role in a project
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *       - in: query
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [desiginerorarchiteck, spg, qc, client, eieldsengineers, arc, measurement, spm]
 *         description: Role to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               users:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of user IDs to remove from the role
 *     responses:
 *       200:
 *         description: Users removed from role successfully
 *       404:
 *         description: Project not found
 *       400:
 *         description: Invalid role or request body
 */
router.delete("/projects/:id/remove-role", async (req, res) => {
  const { role } = req.query;
  const { users } = req.body;

  const validRoles = [
    "desiginerorarchiteck",
    "spg",
    "qc",
    "client",
    "eieldsengineers",
    "arc",
    "measurement",
    "spm",
  ];

  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: "Invalid role specified" });
  }

  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    project[role] = project[role].filter((userId) => !users.includes(userId.toString()));
    await project.save();

    res.status(200).json({ message: `Users removed from role '${role}' successfully`, project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
