const mongoose = require('mongoose');

// File Schema
const FileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  extension: {
    type: String,
    required: true,
    enum: ['pdf', 'xlsx', 'jpg', 'png'], // Adjust file types as needed
    message: '{VALUE} is not a valid file extension.',
  },
},{
  timestamps: true, // Automatically add `createdAt` and `updatedAt`
});

// Versioned File Schema
const VersionedFileSchema = new mongoose.Schema({
  file: { 
    type: FileSchema, 
    required: false, 
  },
  ver: {
    type: Number,
    default: 0, // Default version is 0
  },
  isSelected: {
    type: Boolean,
    default: false, // Indicates if this version is active/selected
  },
  canview: {
    type: Boolean,
    default: true, // Indicates if this version is active/selected
  },
},{
  timestamps: true, // Automatically add `createdAt` and `updatedAt`
});

// Designer Schema
const DesignerSchema = new mongoose.Schema({

  designer: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "vendors", // User who created the project
  },],
  // lead: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Lead", // Reference to the Lead schema
  //   required: true,
  //  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    index:true // Reference to the User schema
  },
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead", // Reference to the User schema
  },
  description: {
    type: String,
    required: false, // Optional description field
  },
  requirements: {
    type: String,
    required: false, // Optional field for text input
  },
  plotlayout: [VersionedFileSchema], // Array of versioned files for elevation
  floorplan: [VersionedFileSchema], // Array of versioned files for elevation
  elevation: [VersionedFileSchema], // Array of versioned files for elevation
  structraldrawings: [VersionedFileSchema], // Array of versioned files for elevation
  plinthlayout: [VersionedFileSchema], // Array of versioned files for elevation
  steelBOQ: [VersionedFileSchema], // Array of versioned files for steel BOQ
  boq: [VersionedFileSchema], // Array of versioned files for steel BOQ
  electrical: [VersionedFileSchema], // Array of versioned files for steel BOQ
  hvac: {
    pdf: [VersionedFileSchema], // Versioned PDFs for HVAC
    excel: [VersionedFileSchema], // Versioned Excel files for HVAC
  },
  plumbing: {
    pdf: [VersionedFileSchema], // Versioned PDFs for Plumbing
    excel: [VersionedFileSchema], // Versioned Excel files for Plumbing
  },
  status: {
    type: String,
    enum: ["Initiated","Accepted", "Working", "InProgress", "Completed","Waitingforapproval","Waitingforfileuploads"], 
    default: "Initiated",// Example sources
    required: true,
  },
  clientconformation: {
    type: Boolean,
    default: false, // Indicates if this version is active/selected
  },
}, {
  timestamps: true, // Automatically add `createdAt` and `updatedAt`
});

module.exports = mongoose.model('Designerforprojects', DesignerSchema);
