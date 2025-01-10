const mongoose = require("mongoose");

const workflowSchema = new mongoose.Schema({
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module", // Reference to the Module schema
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"], // Workflow status
    default: "Pending",
  },
  notes: {
    type: String, // Optional notes for each workflow item
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assigned user
  },
  startDate: {
    type: Date, // Optional start date
  },
  endDate: {
    type: Date, // Optional end/completion date
  },
});

const projectSchema = new mongoose.Schema(
  {
     lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead", // Reference to the Lead schema
      required: true,
     },
     quotation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quotation", // Reference to the Quotation schema
      required: true,
     },
      projectmanager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assigned user
      },
      desiginerorarchiteck: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assigned user
      }],
      spg: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assigned user
      }],
    qc: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assigned user
      }],
    client: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assigned user
      }],
      eieldsengineers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assigned user
      }],
      arc: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assigned user
      }],
      measurement: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assigned user
      }],
      spm: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assigned user
      }],
     //   workflows: [workflowSchema], // Array of workflows based on modules
     status: {
      type: String,
      enum: ["Initiated", "In Progress", "Completed"], // Overall project status
      default: "Initiated",
     },
     startDate: {
      type: Date, // Project start date
     },
     completionDate: {
      type: Date, // Expected or actual completion date
     },
     notes: [{
      type: String, // General notes about the project
     }],
     createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // User who created the project
      },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
