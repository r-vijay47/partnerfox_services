const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  walls: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wall'
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

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;
