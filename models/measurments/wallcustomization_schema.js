const mongoose = require('mongoose');

const WallCustomizationSchema = new mongoose.Schema({
  type: { type: String },
  description: { type: String },
  measurements: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number }
  },
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

const WallCustomization = mongoose.model('WallCustomization', WallCustomizationSchema);

module.exports = WallCustomization;
