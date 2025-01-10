const mongoose = require('mongoose');

const FloorSchema = new mongoose.Schema({
  floorNumber: { type: Number, required: true },
  rooms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  }],
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

const Floor = mongoose.model('Floor', FloorSchema);

module.exports = Floor;
