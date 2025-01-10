const express = require("express");
const router = express.Router();
const User = require("../models/user_schema"); // Import User model
const Role = require("../models/roles_schema"); // Import Role model
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth_middleware");
const Branch = require('../models/branches_schema');
const { use } = require("bcrypt/promises");
const SECRET_KEY = "your_secret_key"; // Replace with a secure key
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users management
 */


/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in a user and get a JWT token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *               password:
 *                 type: string
 *                 description: User's password
 *             example:
 *               email: user@example.com
 *               password: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Check if user exists
    const user = await User.findOne({ email }).populate("roles");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Validate password
    // const isMatch = await user.comparePassword(password);
    // if (!isMatch) {
    //   return res.status(400).json({ message: "Invalid email or password." });
    // }

    if(user.password != password){
        return res.status(400).json({ message: "Invalid email or password." });

    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, roles: user.roles.map((role) => role.name) },
      SECRET_KEY,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in.", error: error.message });
  }
});



/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error or invalid roles
 *       500:
 *         description: Server error
 */

// Create a new user
router.post("/users", async (req, res) => {
  try {
    const { name, email, password, roles, branch } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    // Validate roles
    const validRoles = await Role.find({ _id: { $in: roles } });
    if (roles && validRoles.length !== roles.length) {
      return res.status(400).json({ message: "Some roles are invalid." });
    }

    const user = new User({ name, email, password, roles ,branch});
    await user.save();
    res.status(201).json({ message: "User created successfully.", user });
  } catch (error) {
    res.status(500).json({ message: "Error creating user.", error: error.message });
  }
});


/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get logged-in user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

// Example of a protected route
router.get("/users/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("roles branch");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ message: "User profile retrieved successfully.", user });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user profile.", error: error.message });
  }
});


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 */
// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().populate("roles branch"); // Populate roles for each user
    res.status(200).json({ message: "Users retrieved successfully.", users });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users.", error: error.message });
  }
});


/**
 * @swagger
 * /usersbybranch/{branchId}:
 *   get:
 *     summary: Get all users by branch ID
 *     tags: [Users]
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
router.get("/usersbybranch/:branchId", async (req, res) => {
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


/**
 * @swagger
 * /users/paginate:
 *   get:
 *     summary: Retrieve users with pagination
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users to return per page (default is 10)
 *     responses:
 *       200:
 *         description: List of users in the requested page
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                   description: Total number of users
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid page or limit parameter
 *       500:
 *         description: Server error
 */
router.get("/users/paginate", async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
  
      // Convert query params to integers
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
  
      if (pageNumber <= 0 || limitNumber <= 0) {
        return res.status(400).json({ message: "Page and limit must be positive integers." });
      }
  
      // Calculate total users
      const totalUsers = await User.countDocuments();
  
      // Retrieve paginated users
      const users = await User.find()
        .populate("roles branch")
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);
  
      const totalPages = Math.ceil(totalUsers / limitNumber);
  
      res.status(200).json({
        totalUsers,
        totalPages,
        currentPage: pageNumber,
        users,
      });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving paginated users.", error: error.message });
    }
  });
  


/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

router.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("roles branch");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User retrieved successfully.", user });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user.", error: error.message });
  }
});


/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error or invalid roles
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
// Update a user
router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, roles, isActive } = req.body;

    // Validate roles if provided
    if (roles) {
      const validRoles = await Role.find({ _id: { $in: roles } });
      if (validRoles.length !== roles.length) {
        return res.status(400).json({ message: "Some roles are invalid." });
      }
    }

    const user = await User.findByIdAndUpdate(
      id,
      { name, email, password, roles, isActive },
      { new: true, runValidators: true } // Return updated document and validate fields
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User updated successfully.", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user.", error: error.message });
  }
});


/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
// Delete a user
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully.", user });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user.", error: error.message });
  }
});





module.exports = router;
