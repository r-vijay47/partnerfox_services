const mongoose = require('mongoose');

// Schema for window measurements
const WindowSchema = new mongoose.Schema({
  width: Number,
  height: Number,
  sillHeight: Number,
  unit: {
    type: String,
    enum: ['cm', 'mm', 'inches', 'feet', 'yard'],
    required: true,
        default: 'cm'
  },
  windowType: {
    type: String,
    enum:['Sliding', 'Casement', 'Fixed', 'French', 'Bay', 'Awning', 'Hopper', 'Jalousie', 'Louvered', 'Picture', 'Round', 'Transom', 'Garden', 'Skylight', 'Storm', 'Combination', 'Egress', 'Glass Block', 'Shutters'],
    required: false,
  },
  windowGranite: {
    type: String,
    required: false,
  }
});

// Schema for door measurements
const DoorSchema = new mongoose.Schema({
  width: Number,
  height: Number,
  unit: {
    type: String,
    enum: ['cm', 'mm', 'inches', 'feet', 'yard'],
    required: true,
        default: 'cm'
  },
  doorType: {
    type: String,
    required: false,
    enum:['Sliding', 'Swing', 'Folding', 'Revolving', 'Flush', 'Panel', 'Louvered', 'French', 'Dutch', 'Pocket', 'Bypass', 'Barn']
  },
});

// Schema for lintel measurements
const LintelSchema = new mongoose.Schema({
  height: Number,
  width: Number,
  thickness: {
    type: Number,
    required: false,
  },
  unit: {
    type: String,
    enum: ['cm', 'mm', 'inches', 'feet', 'yard'],
    required: true,
        default: 'cm'
  }
});

// Schema for wall customizations
const WallCustomizationSchema = new mongoose.Schema({
  type: String,
  description: String,
  unit: {
    type: String,
    enum: ['cm', 'mm', 'inches', 'feet', 'yard'],
    required: true,
        default: 'cm'
  },
  measurements: {
    length: Number,
    width: Number,
    height: Number,

  }
});

// Schema for wall type
const WallTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Internal', 'External'],
    required: true
  },
  thickness: {
    type: Number,
    required: true,
    default: function() {
      return this.type === 'Internal' ? 100 : 200;
    }
  },
  unit: {
    type: String,
    enum: ['cm', 'mm', 'inches', 'feet', 'yard'],
    required: true,
        default: 'cm'
  }
});

// Schema for wall measurements
const WallSchema = new mongoose.Schema({
  wallName: {
    type: String,
    enum: ['North', 'South', 'East', 'West', 'NorthEast', 'NorthWest', 'SouthEast', 'SouthWest'],
    required: true
  },
  wallType: {
    type: WallTypeSchema,
    required: true
  },
  length: Number,
  height: Number,
  unit: {
    type: String,
    enum: ['cm', 'mm', 'inches', 'feet', 'yard'],
    required: true,
        default: 'cm'
  },
  windows: [WindowSchema],
  doors: [DoorSchema],
  lintels: [LintelSchema],
  wallCustomizations: [WallCustomizationSchema],
  executionManagerComment: {
    type: String,
    default: ''
  }
});

// Schema for room measurements
const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    enum: ['cm', 'mm', 'inches', 'feet', 'yard'],
    required: true,
        default: 'cm'
  },
  walls: [WallSchema]
});

// Schema for floor measurements
const FloorSchema = new mongoose.Schema({
  floorNumber: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    enum: ['cm', 'mm', 'inches', 'feet', 'yard'],
    required: true,
        default: 'cm'
  },
  rooms: [RoomSchema]
});

const MeasurementSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
    index: true
  },
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead", 
    required: true
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  totalFloors: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    enum: ['cm', 'mm', 'inches', 'feet', 'yard'],
    required: true,
    default: 'cm'
  },
  floors: [FloorSchema],
  status: {
    type: String,
    enum: ["Initiated","Accepted", "Working", "InProgress", "Completed","Waitingforapproval","Waitingforfileuploads"], 
    default: "Initiated",// Example sources
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Measurements', MeasurementSchema);
