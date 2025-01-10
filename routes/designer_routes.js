const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const router = express.Router();
const Designer = require('../models/designerforproject_schema');

// Set up Multer for file storage (here, using local storage as an example)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');  // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, Date.now() + extname);  // Use timestamp to avoid file name conflicts
  }
});

const upload = multer({ storage: storage });



/**
 * @swagger
 * tags:
 *   name: Designer
 *   description: Designer management
 */
 
// Swagger Documentation for File Uploads (Dynamic category)
/**
 * @swagger
 * /designers/{designerId}/upload/{category}:
 *   post:
 *     summary: Upload a new file for a specific category
 *     tags: 
 *       - Designer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     parameters:
 *       - name: designerId
 *         in: path
 *         required: true
 *         description: ID of the designer
 *         schema:
 *           type: string
 *       - name: category
 *         in: path
 *         required: true
 *         description: The category (e.g., plotlayout, plumbing)
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 filename:
 *                   type: string
 *                 url:
 *                   type: string
 *                 version:
 *                   type: integer
 *       400:
 *         description: Validation error or bad request
 */


// Route to upload file dynamically for different categories (plotlayout, plumbing, etc.)
router.post('/designers/:designerId/upload/:category', upload.single('file'), async (req, res) => {
  try {
    const designerId = req.params.designerId;
    const category = req.params.category;
    const file = req.file;

    // Check if file exists
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Validate that the category is allowed
    const allowedCategories = ['plotlayout', 'floorplan', 'elevation', 'structraldrawings', 'plinthlayout', 'steelBOQ', 'boq', 'electrical', 'hvac', 'plumbing'];
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category specified.' });
    }

    // Find the designer by ID
    const designer = await Designer.findById(designerId);
    if (!designer) {
      return res.status(404).json({ message: 'Designer not found' });
    }

    // Create a new versioned file entry
    const versionedFile = {
      file: {
        filename: file.originalname, // Use originalname instead of filename
        url: `/uploads/${file.filename}`,  // URL of the file (assuming it's stored locally)
        extension: path.extname(file.originalname).substring(1),  // Extract file extension from original name
      },
      ver: (designer[category] && designer[category].length > 0 ? designer[category][designer[category].length - 1].ver + 1 : 1), // Increment version
    };

    // Initialize category array if it doesn't exist
    if (!designer[category]) {
      designer[category] = [];
    }

    // Add the versioned file to the selected category
   await designer[category].push(versionedFile);

    // Save the designer with the new file version
    await designer.save();

    res.status(201).json({
      status:true,
      filename: file.originalname,
      url: `/uploads/${file.filename}`,
      version: versionedFile.ver,
    });
  } catch (error) {
    res.status(400).json({      status:false, error: error.message });
  }
});

// Swagger Documentation for Retrieve All Files for Category
/**
 * @swagger
 * /designers/{designerId}/files/{category}:
 *   get:
 *     summary: Get all files in a specific category for a designer
 *     tags: [Designer]
 *     parameters:
 *       - name: designerId
 *         in: path
 *         required: true
 *         description: Designer ID
 *       - name: category
 *         in: path
 *         required: true
 *         description: The category for the files (e.g., plotlayout, plumbing, etc.)
 *     responses:
 *       200:
 *         description: List of files for the designer in the specified category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   filename:
 *                     type: string
 *                   url:
 *                     type: string
 *                   version:
 *                     type: integer
 *       400:
 *         description: Invalid category or designer not found
 */

// Get all files for a specific designer category (e.g., plotlayout, plumbing, etc.)
router.get('/:designerId/files/:category', async (req, res) => {
  try {
    const designerId = req.params.designerId;
    const category = req.params.category;

    // Validate that the category is allowed
    const allowedCategories = ['plotlayout', 'floorplan', 'elevation', 'structraldrawings', 'plinthlayout', 'steelBOQ', 'boq', 'electrical', 'hvac', 'plumbing'];
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category specified.' });
    }

    // Find the designer by ID
    const designer = await Designer.findById(designerId);
    if (!designer) {
      return res.status(404).json({ message: 'Designer not found' });
    }

    // Retrieve all files from the selected category
    const files = designer[category];
    res.status(200).json(files);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Swagger Documentation for Delete a File by ID for a Category
/**
 * @swagger
 * /designers/{designerId}/files/{category}/{fileId}:
 *   delete:
 *     summary: Delete a file by ID from a specific category for a designer
 *     tags: [ Designer ] 
 *     parameters:
 *       - name: designerId
 *         in: path
 *         required: true
 *         description: Designer ID
 *       - name: category
 *         in: path
 *         required: true
 *         description: Category from which the file will be deleted (e.g., plotlayout, plumbing, etc.)
 *       - name: fileId
 *         in: path
 *         required: true
 *         description: File ID to be deleted
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       404:
 *         description: File or designer not found
 *       400:
 *         description: Invalid category
 */

// Delete a file by ID for a designer in a specific category (e.g., plotlayout, plumbing, etc.)
router.delete('/:designerId/files/:category/:fileId', async (req, res) => {
  try {
    const { designerId, category, fileId } = req.params;

    // Validate that the category is allowed
    const allowedCategories = ['plotlayout', 'floorplan', 'elevation', 'structraldrawings', 'plinthlayout', 'steelBOQ', 'boq', 'electrical', 'hvac', 'plumbing'];
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category specified.' });
    }

    // Find the designer by ID
    const designer = await Designer.findById(designerId);
    if (!designer) {
      return res.status(404).json({ message: 'Designer not found' });
    }

    // Find and remove the file from the selected category
    const fileIndex = designer[category].findIndex(file => file._id.toString() === fileId);
    if (fileIndex === -1) {
      return res.status(404).json({ message: 'File not found' });
    }

    designer[category].splice(fileIndex, 1);
    await designer.save();

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Swagger Documentation for Get All Fields by Designer ID
/**
 * @swagger
 * /designer/{designerId}:
 *   get:
 *     summary: Get all fields by designer ID
 *     tags: [Designer] 
 *     parameters:
 *       - name: designerId
 *         in: path
 *         required: true
 *         description: Designer ID to retrieve all associated fields (e.g., plotlayout, plumbing, etc.)
 *     responses:
 *       200:
 *         description: All fields for the designer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 requirements:
 *                   type: string
 *                 description:
 *                   type: string
 *                 plotlayout:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       filename:
 *                         type: string
 *                       url:
 *                         type: string
 *                       version:
 *                         type: integer
 *                 plumbing:
 *                   type: object
 *                   properties:
 *                     pdf:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           filename:
 *                             type: string
 *                           url:
 *                             type: string
 *                           version:
 *                             type: integer
 *       404:
 *         description: Designer not found
 */
router.get('/designer/:designerId', async (req, res) => {
    try {
      const designerId = req.params.designerId;
  
      // Find the designer by ID
      const designer = await Designer.findById(designerId);
      if (!designer) {
        return res.status(404).json({ message: 'Designer not found' });
      }
  
      // Return all fields for the designer
      res.status(200).json(designer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Swagger Documentation for Get All Designers
  /**
   * @swagger
   * /designers:
   *   get:
   *     summary: Get all designers
   *     tags: [Designer] 
   *     responses:
   *       200:
   *         description: List of all designers
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   _id:
   *                     type: string
   *                   requirements:
   *                     type: string
   *                   description:
   *                     type: string
   *       400:
   *         description: Bad Request
   */
  router.get('/designers', async (req, res) => {
    try {
      // Fetch all designers
      const designers = await Designer.find();
      res.status(200).json(designers);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });


  /**
 * @swagger
 * /designers:
 *   post:
 *     summary: Create a new designer project
 *     tags: [Designer] 
 *     description: Adds a new designer project to the database.
 *     operationId: createDesigner
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Designer'
 *     responses:
 *       201:
 *         description: Designer project created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Designer'
 *       400:
 *         description: Invalid input.
 */
router.post('/designers', async (req, res) => {
  try {
    const newDesigner = new Designer(req.body);
    const savedDesigner = await newDesigner.save();
    res.status(201).json(savedDesigner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Swagger: Get all Designers
/**
 * @swagger
 * /designers:
 *   get:
 *     summary: Retrieve a list of designer projects
 *     tags: [Designer] 
 *     description: Fetch all designer projects from the database.
 *     operationId: getDesigners
 *     responses:
 *       200:
 *         description: List of all designer projects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Designer'
 */
router.get('/designers', async (req, res) => {
  try {
    const designers = await Designer.find();
    res.status(200).json(designers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Swagger: Get Designer by ID
/**
 * @swagger
 * /designers/{id}:
 *   get:
 *     summary: Get a designer project by ID
 *     tags: [Designer] 
 *     description: Fetch a designer project by its unique ID.
 *     operationId: getDesignerById
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Designer project ID
 *         schema:
 *           type: string
 *           format: objectId
 *     responses:
 *       200:
 *         description: Designer project details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Designer'
 *       404:
 *         description: Designer project not found.
 */
router.get('/designers/:id', async (req, res) => {
  try {
    const designer = await Designer.findById(req.params.id);
    if (!designer) return res.status(404).json({ message: 'Designer not found' });
    res.status(200).json(designer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Swagger: Update Designer by ID
/**
 * @swagger
 * /designers/{id}:
 *   put:
 *     summary: Update a designer project
 *     tags: [Designer]  
 *     description: Update an existing designer project by its ID.
 *     operationId: updateDesigner
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Designer project ID
 *         schema:
 *           type: string
 *           format: objectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Designer'
 *     responses:
 *       200:
 *         description: Updated designer project.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Designer'
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: Designer project not found.
 */
router.put('/designers/:id', async (req, res) => {
  try {
    const updatedDesigner = await Designer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDesigner) return res.status(404).json({ message: 'Designer not found' });
    res.status(200).json(updatedDesigner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Swagger: Delete Designer by ID
/**
 * @swagger
 * /designers/{id}:
 *   delete:
 *     summary: Delete a designer project
 *     description: Delete an existing designer project by its ID.
 *     operationId: deleteDesigner
 *     tags:
 *       - Designer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Designer project ID
 *         schema:
 *           type: string
 *           format: objectId
 *     responses:
 *       200:
 *         description: Designer project deleted successfully.
 *       404:
 *         description: Designer project not found.
 */
router.delete('/designers/:id', async (req, res) => {
  try {
    const deletedDesigner = await Designer.findByIdAndDelete(req.params.id);
    if (!deletedDesigner) return res.status(404).json({ message: 'Designer not found' });
    res.status(200).json({ message: 'Designer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// File upload endpoint
/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a file
 *     description: Endpoint to upload a file using multipart/form-data.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         description: The file to upload
 *         required: true
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: Invalid file format or no file uploaded
 */
router.post('/upload', upload.single('file'), (req, res) => {
  console.log(req)
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded.' });
  }
  res.json({ message: 'File uploaded successfully!', file: req.file });
});
module.exports = router;
