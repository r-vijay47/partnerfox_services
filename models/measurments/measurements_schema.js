const mongoose = require('mongoose');

const MeasurementSchema = new mongoose.Schema({
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
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  unit: { 
    type: String, 
    enum: ['cm', 'mm', 'inches', 'feet', 'm', 'yard'], 
    required: true, 
    default: 'cm' // Default unit for measurements
  },
  totalFloors: { type: Number, required: true },
  floors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Floor'
  }]
}, {
  timestamps: true
});

const Measurement = mongoose.model('Measurement', MeasurementSchema);

module.exports = Measurement;
