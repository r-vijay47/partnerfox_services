const mongoose = require('mongoose');

const WallTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Internal', 'External'],
    required: true
  },
  thickness: {
    type: Number,
    required: true,
    default: function () {
      return this.type === 'Internal' ? 100 : 200;
    }
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

const WallType = mongoose.model('WallType', WallTypeSchema);

module.exports = WallType;
