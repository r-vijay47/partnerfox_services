const mongoose = require('mongoose');

const WallSchema = new mongoose.Schema({
  wallName: {
    type: String,
    enum: ['North', 'South', 'East', 'West', 'NorthEast', 'NorthWest', 'SouthEast', 'SouthWest'],
    required: true
  },
  wallType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WallType',
    required: true
  },
  length: { type: Number },
  height: { type: Number },
  windows: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Window'
  }],
  doors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Door'
  }],
  lintels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lintel'
  }],
  wallCustomizations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WallCustomization'
  }],
  executionManagerComment: { type: String, default: '' },
  unit: { 
    type: String, 
    enum: ['cm', 'mm', 'inches', 'feet', 'm'], 
    required: true, 
    default: 'cm' // Default unit for window measurements
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true // Create index for projectId
  },
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true,
    index: true // Create index for leadId
  }
});

const Wall = mongoose.model('Wall', WallSchema);

module.exports = Wall;
