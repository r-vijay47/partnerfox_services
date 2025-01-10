const express = require("express");
const router = express.Router();
const Lead = require("../models/lead_schema");

/**
 * @swagger
 * tags:
 *   name: Leads
 *   description: Lead management
 */
 
/**
 * @swagger
 * /leads:
 *   get:
 *     summary: Get all leads
 *     tags: [Leads]
 *     responses:
 *       200:
 *         description: List of all leads
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 lead:
 *                   $ref: '#/components/schemas/Lead'
 *       500:
 *         description: Server error
 */
router.get("/leads", async (req, res) => {
  try {
    const leads = await Lead.find().populate('branch package services');
    res.status(200).json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /leads:
 *   post:
 *     summary: Create a new lead
 *     tags: [Leads]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lead'
 *     responses:
 *       201:
 *         description: Lead created
 *       500:
 *         description: Server error
 */
router.post("/leads", async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



/**
 * @swagger
 * /leads/{id}:
 *   get:
 *     summary: Get a lead by ID
 *     tags: [Leads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lead ID
 *     responses:
 *       200:
 *         description: Lead found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 lead:
 *                   $ref: '#/components/schemas/Lead'
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Server error
 */
router.get("/leads/:id", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('branch package services');;
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.status(200).json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /leadspaginate:
 *   get:
 *     summary: Get leads with pagination
 *     tags: [Leads]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of leads to retrieve per page.
 *     responses:
 *       200:
 *         description: Leads retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Leads retrieved successfully.
 *                 leads:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Lead'
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 totalLeads:
 *                   type: integer
 *                   example: 50
 *       500:
 *         description: Server error.
 */


// Get Leads with Pagination
router.get("/leadspaginate", async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
  
      // Convert query params to numbers
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
  
      // Fetch leads with pagination
      const leads = await Lead.find().populate('branch package services')
        .skip((pageNumber - 1) * limitNumber) // Skip leads for previous pages
        .limit(limitNumber) // Limit number of leads per page
        .sort({ createdAt: -1 }); // Sort by creation date (latest first)
  
      const totalLeads = await Lead.countDocuments(); // Total count of leads
      const totalPages = Math.ceil(totalLeads / limitNumber);
  
      res.status(200).json({
        message: "Leads retrieved successfully.",
        leads,
        currentPage: pageNumber,
        totalPages,
        totalLeads,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving leads.",
        error: error.message,
      });
    }
  });



/**
 * @swagger
 * /leads/{id}:
 *   put:
 *     summary: Update a lead by ID
 *     tags: [Leads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lead ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lead'
 *     responses:
 *       200:
 *         description: Lead updated
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Server error
 */
router.put("/leads/:id", async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.status(200).json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /leads/{id}:
 *   delete:
 *     summary: Delete a lead by ID
 *     tags: [Leads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lead ID
 *     responses:
 *       200:
 *         description: Lead deleted
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Server error
 */
router.delete("/leads/:id", async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.status(200).json({ message: "Lead deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /leads/{id}/add-contact:
 *   post:
 *     summary: Add a contact to a lead
 *     tags: [Leads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lead ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: User ID to add as contact
 *                 example: "648dfc7d35e6c4f7ac1d2a33"
 *               contactnotes:
 *                 type: string
 *                 description: String 
 *                 example: "Not Picked the call / Call me later"
 *     responses:
 *       200:
 *         description: Contact added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 lead:
 *                   $ref: '#/components/schemas/Lead'
 *       404:
 *         description: Lead not found.
 *       500:
 *         description: Server error.
 */

router.post("/leads/:id/add-contact", async (req, res) => {
  try {
    const { id } = req.params; // Lead ID
    const { user,contactnotes } = req.body; // User ID to add as a contact

    // Validate input
    if (!user) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Find and update the lead
    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      {
        $push: { contacttoat: { user,contactnotes, addedAt: new Date() } },
        leadStatus:"enquiry"
      },
      { new: true, runValidators: true }
    ).populate("contacttoat.user"); // Populate user details for response

    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found." });
    }

    res.status(200).json({
      message: "Contact added successfully.",
      lead: updatedLead,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding contact.",
      error: error.message,
    });
  }
});



/**
 * @swagger
 * /leads/{id}/add-meeting:
 *   post:
 *     summary: Add a meeting to a lead
 *     tags: [Leads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lead ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: User ID for the meeting
 *                 example: "648dfc7d35e6c4f7ac1d2a33"
 *               meetingnotes:
 *                 type: string
 *                 description: Notes for the meeting
 *                 example: "Discussed budget requirements"
 *     responses:
 *       200:
 *         description: Meeting added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 lead:
 *                   $ref: '#/components/schemas/Lead'
 *       404:
 *         description: Lead not found.
 *       500:
 *         description: Server error.
 */

router.post("/leads/:id/add-meeting", async (req, res) => {
  try {
    const { id } = req.params; // Lead ID
    const { user, meetingnotes } = req.body; // Meeting details

    // Validate input
    if (!user) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Find and update the lead
    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      {
        $push: {
          meetings: { user, meetingnotes, addedAt: new Date() },
        },
         leadStatus:"enquiry"
        
      },
      { new: true, runValidators: true }
    ).populate("meetings.user"); // Populate user details for response

    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found." });
    }

    res.status(200).json({
      message: "Meeting added successfully.",
      lead: updatedLead,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding meeting.",
      error: error.message,
    });
  }
});


module.exports = router;
