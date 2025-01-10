const mongoose = require('mongoose');

const WindowSchema = new mongoose.Schema({
  width: { type: Number },
  height: { type: Number },
  sillHeight: { type: Number },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true // Create index for projectId
  },
  unit: { 
    type: String, 
    enum: ['cm', 'mm', 'inches', 'feet', 'm'], 
    required: true, 
    default: 'cm' // Default unit for window measurements
  },
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true,
    index: true // Create index for leadId
  }
});

const Window = mongoose.model('Window', WindowSchema);

module.exports = Window;
