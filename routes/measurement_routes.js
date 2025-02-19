const express = require('express');

 const Measurement = require('../models/measurments/old_measurement_schema');
//const Measurements = require('../models/measurments/measurements_schema');
const Bricks = require('../models/bricks_schema');
const app = express();
app.use(express.json());
function checkIfScientific(num) {
  // Check if the number is in scientific notation
  if (num.toString().includes('e')) {
      // Return the number in fixed-point notation (with a specific number of decimals, for example 10 decimals)
      return num.toFixed(10);
  }
  // If it's not in scientific notation, just return the number as it is
  return num;
}

const convertUnits = (value, fromUnit, toUnit) => {
  const conversionRates = {
    cm: { cm: 1, mm: 10, inches: 0.393701, feet: 0.0328084, yard: 0.0109361, meter: 0.01, kilometer: 0.00001 },
    mm: { cm: 0.1, mm: 1, inches: 0.0393701, feet: 0.00328084, yard: 0.00109361, meter: 0.001, kilometer: 0.000001 },
    inches: { cm: 2.54, mm: 25.4, inches: 1, feet: 0.0833333, yard: 0.0277778, meter: 0.0254, kilometer: 0.0000254 },
    feet: { cm: 30.48, mm: 304.8, inches: 12, feet: 1, yard: 0.333333, meter: 0.3048, kilometer: 0.0003048 },
    yard: { cm: 91.44, mm: 914.4, inches: 36, feet: 3, yard: 1, meter: 0.9144, kilometer: 0.0009144 },
    meter: { cm: 100, mm: 1000, inches: 39.3701, feet: 3.28084, yard: 1.09361, meter: 1, kilometer: 0.001 },
    kilometer: { cm: 100000, mm: 1000000, inches: 39370.1, feet: 3280.84, yard: 1093.61, meter: 1000, kilometer: 1 }
  };

  if (!conversionRates[fromUnit] || !conversionRates[toUnit]) {
    throw new Error('Invalid units');
  }

  return value * conversionRates[fromUnit][toUnit];
};



/**
 * @swagger
 * tags:
 *   - name: Measurements
 *     description: API for managing project measurements
 */

/**
 * @swagger
 * /measurements:
 *   post:
 *     summary: Create a new measurement record
 *     tags: [Measurements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Measurement'
 *     responses:
 *       201:
 *         description: Measurement record created successfully
 *       400:
 *         description: Bad request
 */
app.post('/measurements', async (req, res) => {
    try {
      const newMeasurement = new Measurement(req.body);
      await newMeasurement.save();
      res.status(201).json(newMeasurement);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  

  /**
   * @swagger
   * /measurements/conversion:
   *   post:
   *     summary: Convert a measurement value from one unit to another
   *     tags: [Measurements]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               value:
   *                 type: number
   *               fromUnit:
   *                 type: string
   *                 enum: [cm, mm, inches, feet, yard]
   *               toUnit:
   *                 type: string
   *                 enum: [cm, mm, inches, feet, yard]
   *             required:
   *               - value
   *               - fromUnit
   *               - toUnit
   *     responses:
   *       200:
   *         description: Conversion successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 result:
   *                   type: number
   *       400:
   *         description: Bad request
   */

  app.post('/measurements/conversion', async (req, res) => {

    try {
      const { value, fromUnit, toUnit } = req.body;
      const result = convertUnits(value, fromUnit, toUnit);
      res.status(200).json({ result });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  })




  /**
   * @swagger
   *  /measurements:
   *   get:
   *     summary: Get all measurements
   *     tags: [Measurements]
   *     responses:
   *       200:
   *         description: List of all measurements
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Measurement'
   *       500:
   *         description: Internal server error
   */
  app.get('/measurements', async (req, res) => {
    try {
      const measurements = await Measurement.find();
      res.status(200).json(measurements);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  
  /**
   * @swagger
   * /measurements/{id}:
   *   get:
   *     summary: Get a measurement by ID
   *     tags: [Measurements]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: objectId
   *         description: The measurement ID
   *     responses:
   *       200:
   *         description: Measurement record found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Measurements'
   *       404:
   *         description: Measurement not found
   */
  app.get('/measurements/:id', async (req, res) => {
    try {
      const measurement = await Measurement.findById(req.params.id);
      if (!measurement) return res.status(404).json({ message: 'Measurement not found' });
      else{
         var summary ={};

         var volume = {};

         var walllenght = 0;
         var wallheight = 0;  
                 var wallthickness = 0;  
         var motormix ={
          cement : 1,
          sand:4,
          Dust:0
         };



         

         summary["totalfloors"]=measurement.floors.length;
         summary["unit"]=measurement.unit;
       //  console.log(measurement.floors[0].rooms[0].walls[0].length);
        // console.log(measurement.floors[0].rooms[0].walls[0].height);

         var sqft = 0;

         var motormixtotal = motormix.cement+motormix.sand+motormix.Dust; 
         motormix.motormixtotal = motormixtotal;
         
       //  sqft = ((measurement.floors[0].rooms[0].walls[0].length/304.8)*(measurement.floors[0].rooms[0].walls[0].height/304.8));

     //  console.log(measurement.floors.length);  
      





     measurement.floors.forEach(floors => {
         
         


      floors.rooms.forEach(rooms => {

rooms.walls.forEach(walls => {
console.log(walls.unit);
sqft = sqft + ((convertUnits(walls.length,walls.unit,measurement.unit)/304.8)*(convertUnits(walls.height,walls.unit,measurement.unit)/304.8));

//  console.log(sqft);
walllenght = walllenght + walls.length;
wallheight = wallheight + walls.height;
wallthickness = wallthickness +walls.wallType.thickness;


walls.windows.forEach(windows => {
//  console.log(sqft);
//  console.log(windows.width);
//   console.log(windows.height);
//   console.log((windows.width/304.8)*(windows.height/304.8));

sqft = sqft - ((convertUnits(windows.width,windows.unit,measurement.unit)/304.8)*(convertUnits(windows.height,windows.unit,measurement.unit)/304.8));
// sqft = sqft - ((windows.width/304.8)*(windows.height/304.8));

// console.log("aftert windows "+sqft);
})
walls.doors.forEach(doors => {
 
 sqft = sqft - ((convertUnits(doors.length,doors.unit,measurement.unit)/304.8)*(convertUnits(doors.height,doors.unit,measurement.unit)/304.8));
//  sqft = sqft - ((doors.length/304.8)*(doors.height/304.8));
//  console.log("aftert doors "+sqft);
})

// console.log(   walls);

walls.lintels.forEach(lintel => {

  sqft = sqft - ((convertUnits(lintel.width,lintel.unit,measurement.unit)/304.8)*(convertUnits(lintel.thickness,lintel.unit,measurement.unit)/304.8));
//  sqft = sqft - ((lintel.width/304.8)*(lintel.thickness/304.8));
//console.log("aftert lintels "+sqft);
})



});
})
     });


     summary["sqft"]=sqft;
            
     volume["length"] = walllenght/1000;
     volume["depth"] = wallheight/1000;
     volume["wallthickness"] = wallthickness/1000;
      var m3 =  volume["length"] * volume["depth"] * volume["wallthickness"];


      var bricks =await Bricks.findOne();

      var brickss  = {};

   
   //   console.log(bricks)
      console.log( convertUnits(bricks.dimensions.thickness,bricks.unit,measurement.unit))
      brickss.length = (convertUnits(bricks.dimensions.length,bricks.unit,measurement.unit)/1000);
      brickss.width = convertUnits(bricks.dimensions.width,bricks.unit,measurement.unit)/1000;
      brickss.thickness  =convertUnits(bricks.dimensions.thickness,bricks.unit,measurement.unit)/1000;
      brickss.brickvolume =  checkIfScientific(  ( brickss.length *  brickss.width*    brickss.thickness ));
 
    

          var motor = {};


          motor.length =   brickss.length+0.01;
          motor.width =   brickss.width+0.01;
          motor.thickness =   brickss.thickness+0.01;
          motor.motorvolume =  (motor.length * motor.width * motor.thickness);  
          var nofbricks = m3/ motor.motorvolume;
            var wastage = nofbricks * 0.08;
            var quantityofbricks = nofbricks + wastage;
            var volumeofbrickmotor = nofbricks *   brickss.brickvolume;

            var motorqty={};
            motorqty. mototequantity = m3 - volumeofbrickmotor;
            motorqty. wastage =  motorqty. mototequantity * 0.15;
            motorqty. totalmotorqunty =  motorqty. mototequantity +      motorqty. wastage;
            motorqty. dryvolume =    motorqty. totalmotorqunty  * 0.25;
            motorqty. finalmotorquantity =         motorqty. totalmotorqunty +  motorqty. dryvolume;



            var cement ={};




            cement.amountofcement =(  motormix.cement /      motormix.motormixtotal) * motorqty.finalmotorquantity;
            cement.cementdensity =cement.amountofcement *1440;
            cement.umberofcementbags =     cement.cementdensity /50;
         
            var sand ={};


            sand.amountofsand =(  motormix.sand /      motormix.motormixtotal) * motorqty.finalmotorquantity;
            sand.sanddensity =sand.amountofsand *1500;
            sand.numberoftonssand =         sand.sanddensity  /1000;
         
       
       
            res.status(200).json({summary,motormix,volume,m3,motor,brickss,nofbricks,wastage,quantityofbricks,volumeofbrickmotor,motorqty,volumeofbrickmotor,cement,sand,walllenght,wallheight,measurement});

      }



  
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
     
  /**
   * @swagger
   * /measurements/{id}:
   *   put:
   *     summary: Update a measurement by ID
   *     tags: [Measurements]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: objectId
   *         description: The measurement ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Measurement'
   *     responses:
   *       200:
   *         description: Measurement updated successfully
   *       400:
   *         description: Bad request
   *       404:
   *         description: Measurement not found
   */
  app.put('/measurements/:id', async (req, res) => {
    try {
      const measurement = await Measurement.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!measurement) return res.status(404).json({ message: 'Measurement not found' });
      res.status(200).json(measurement);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  /**
 * @swagger
 * /measurements/{measurementId}/floors:
 *   post:
 *     summary: Add a floor to a measurement by measurementId
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The measurement ID to add the floor to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Floor'
 *     responses:
 *       201:
 *         description: Floor added successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Measurement not found
 */
app.post('/measurements/:measurementId/floors', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.measurementId);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });

    // Add the floor to the measurement
    measurement.floors.push(req.body);
    await measurement.save();

    res.status(201).json(measurement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


/**
 * @swagger
 * /measurements/{measurementId}/floors:
 *   get:
 *     summary: Get all floors of a measurement by measurementId
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The measurement ID to fetch floors for
 *     responses:
 *       200:
 *         description: Floors fetched successfully
 *       404:
 *         description: Measurement not found
 */
app.get('/measurements/:measurementId/floors', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.measurementId);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });
    
    res.status(200).json(measurement.floors);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


/**
 * @swagger
 * /measurements/{measurementId}/floors/{floorId}:
 *   put:
 *     summary: Update a floor in a measurement by measurementId and floorId
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The measurement ID for updating the floor
 *       - in: path
 *         name: floorId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The floor ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Floor'
 *     responses:
 *       200:
 *         description: Floor updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Floor or Measurement not found
 */
app.put('/measurements/:measurementId/floors/:floorId', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.measurementId);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });

    const floor = measurement.floors.id(req.params.floorId);
    if (!floor) return res.status(404).json({ message: 'Floor not found' });

    // Update floor details
    Object.assign(floor, req.body);
    await measurement.save();

    res.status(200).json(measurement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /measurements/{measurementId}/floors/{floorId}:
 *   delete:
 *     summary: Delete a floor from a measurement by measurementId and floorId
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The measurement ID to delete the floor
 *       - in: path
 *         name: floorId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The floor ID to delete
 *     responses:
 *       200:
 *         description: Floor deleted successfully
 *       404:
 *         description: Floor or Measurement not found
 */
app.delete('/measurements/:measurementId/floors/:floorId', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.measurementId);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });

    const floor = measurement.floors.id(req.params.floorId);
    if (!floor) return res.status(404).json({ message: 'Floor not found' });

    // Remove the floor
    floor.remove();
    await measurement.save();

    res.status(200).json({ message: 'Floor deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


/**
 * @swagger
 * /measurements/{measurementId}/floors/{floorId}/rooms:
 *   post:
 *     summary: Add a room to a floor under a measurement by measurementId and floorId
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The measurement ID to add the room to
 *       - in: path
 *         name: floorId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The floor ID to add the room to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       201:
 *         description: Room added successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Floor or Measurement not found
 */
app.post('/measurements/:measurementId/floors/:floorId/rooms', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.measurementId);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });

    const floor = measurement.floors.id(req.params.floorId);
    if (!floor) return res.status(404).json({ message: 'Floor not found' });

    // Add the room to the floor
    floor.rooms.push(req.body);
    await measurement.save();

    res.status(201).json(measurement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


/**
 * @swagger
 * /measurements/{measurementId}/floors/{floorId}/rooms:
 *   get:
 *     summary: Get all rooms in a floor of a measurement by measurementId and floorId
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The measurement ID to fetch rooms for
 *       - in: path
 *         name: floorId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The floor ID to fetch rooms for
 *     responses:
 *       200:
 *         description: Rooms fetched successfully
 *       404:
 *         description: Floor or Measurement not found
 */
app.get('/measurements/:measurementId/floors/:floorId/rooms', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.measurementId);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });

    const floor = measurement.floors.id(req.params.floorId);
    if (!floor) return res.status(404).json({ message: 'Floor not found' });

    res.status(200).json(floor.rooms);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});




/**
 * @swagger
 * /measurements/{measurementId}/floors/{floorId}/rooms/{roomId}:
 *   put:
 *     summary: Update a room in a floor under a measurement by measurementId, floorId, and roomId
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The measurement ID to update the room
 *       - in: path
 *         name: floorId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The floor ID to update the room
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The room ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       200:
 *         description: Room updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Room or Floor or Measurement not found
 */
app.put('/measurements/:measurementId/floors/:floorId/rooms/:roomId', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.measurementId);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });

    const floor = measurement.floors.id(req.params.floorId);
    if (!floor) return res.status(404).json({ message: 'Floor not found' });

    const room = floor.rooms.id(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    // Update room details
    Object.assign(room, req.body);
    await measurement.save();

    res.status(200).json(measurement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


/**
 * @swagger
 * /measurements/{measurementId}/floors/{floorId}/rooms/{roomId}:
 *   delete:
 *     summary: Delete a room from a floor under a measurement by measurementId, floorId, and roomId
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The measurement ID to delete the room
 *       - in: path
 *         name: floorId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The floor ID to delete the room
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The room ID to delete
 *     responses:
 *       200:
 *         description: Room deleted successfully
 *       404:
 *         description: Room or Floor or Measurement not found
 */
app.delete('/measurements/:measurementId/floors/:floorId/rooms/:roomId', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.measurementId);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });

    const floor = measurement.floors.id(req.params.floorId);
    if (!floor) return res.status(404).json({ message: 'Floor not found' });

    const room = floor.rooms.id(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    // Remove the room
    room.remove();
    await measurement.save();

    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


/**
 * @swagger
 * /measurements/{measurementId}/floors/{floorId}/rooms/{roomId}/walls:
 *   post:
 *     summary: Add a wall to a room in a floor under a measurement by measurementId, floorId, and roomId
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The measurement ID to add the wall to
 *       - in: path
 *         name: floorId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The floor ID to add the wall to
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The room ID to add the wall to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Wall'
 *     responses:
 *       201:
 *         description: Wall added successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Room, Floor, or Measurement not found
 */
app.post('/measurements/:measurementId/floors/:floorId/rooms/:roomId/walls', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.measurementId);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });

    const floor = measurement.floors.id(req.params.floorId);
    if (!floor) return res.status(404).json({ message: 'Floor not found' });

    const room = floor.rooms.id(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    // Add the wall to the room
    room.walls.push(req.body);
    await measurement.save();

    res.status(201).json(measurement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


/**
 * @swagger
 * /measurements/{measurementId}/floors/{floorId}/rooms/{roomId}/walls:
 *   get:
 *     summary: Get all walls in a room of a floor under a measurement by measurementId, floorId, and roomId
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The measurement ID to fetch walls for
 *       - in: path
 *         name: floorId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The floor ID to fetch walls for
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The room ID to fetch walls for
 *     responses:
 *       200:
 *         description: Walls fetched successfully
 *       404:
 *         description: Room, Floor, or Measurement not found
 */
app.get('/measurements/:measurementId/floors/:floorId/rooms/:roomId/walls', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.measurementId);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });

    const floor = measurement.floors.id(req.params.floorId);
    if (!floor) return res.status(404).json({ message: 'Floor not found' });

    const room = floor.rooms.id(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    res.status(200).json(room.walls);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /measurements/{measurementId}/floors/{floorId}/rooms/{roomId}/walls/{wallId}:
 *   put:
 *     summary: Update a wall in a room under a floor by measurementId, floorId, roomId, and wallId
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The measurement ID to update the wall
 *       - in: path
 *         name: floorId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The floor ID to update the wall
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The room ID to update the wall
 *       - in: path
 *         name: wallId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The wall ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Wall'
 *     responses:
 *       200:
 *         description: Wall updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Wall, Room, Floor, or Measurement not found
 */
app.put('/measurements/:measurementId/floors/:floorId/rooms/:roomId/walls/:wallId', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.measurementId);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });

    const floor = measurement.floors.id(req.params.floorId);
    if (!floor) return res.status(404).json({ message: 'Floor not found' });

    const room = floor.rooms.id(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const wall = room.walls.id(req.params.wallId);
    if (!wall) return res.status(404).json({ message: 'Wall not found' });

    // Update the wall details
    Object.assign(wall, req.body);
    await measurement.save();

    res.status(200).json(wall);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /measurements/{measurementId}/floors/{floorId}/rooms/{roomId}/walls/{wallId}:
 *   delete:
 *     summary: Delete a wall from a room under a floor by measurementId, floorId, roomId, and wallId
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The measurement ID to delete the wall
 *       - in: path
 *         name: floorId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The floor ID to delete the wall
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The room ID to delete the wall
 *       - in: path
 *         name: wallId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The wall ID to delete
 *     responses:
 *       200:
 *         description: Wall deleted successfully
 *       404:
 *         description: Wall, Room, Floor, or Measurement not found
 */
app.delete('/measurements/:measurementId/floors/:floorId/rooms/:roomId/walls/:wallId', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.measurementId);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });

    const floor = measurement.floors.id(req.params.floorId);
    if (!floor) return res.status(404).json({ message: 'Floor not found' });

    const room = floor.rooms.id(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const wall = room.walls.id(req.params.wallId);
    if (!wall) return res.status(404).json({ message: 'Wall not found' });

    // Remove the wall
    wall.remove();
    await measurement.save();

    res.status(200).json({ message: 'Wall deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


/**
 * @swagger
 * /measurements/{measurementId}/floors/{floorId}/rooms/{roomId}/walls/{wallId}/customizations:
 *   post:
 *     summary: Add a customization to a wall in a room under a floor by measurementId, floorId, roomId, and wallId
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The measurement ID to add the customization to
 *       - in: path
 *         name: floorId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The floor ID to add the customization to
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The room ID to add the customization to
 *       - in: path
 *         name: wallId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The wall ID to add the customization to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WallCustomization'
 *     responses:
 *       201:
 *         description: Customization added successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Wall, Room, Floor, or Measurement not found
 */
app.post('/measurements/:measurementId/floors/:floorId/rooms/:roomId/walls/:wallId/customizations', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.measurementId);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });

    const floor = measurement.floors.id(req.params.floorId);
    if (!floor) return res.status(404).json({ message: 'Floor not found' });

    const room = floor.rooms.id(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const wall = room.walls.id(req.params.wallId);
    if (!wall) return res.status(404).json({ message: 'Wall not found' });

    // Add the customization to the wall
    wall.wallCustomizations.push(req.body);
    await measurement.save();

    res.status(201).json(measurement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


/**
 * @swagger
 * /measurements/{measurementId}/floors/{floorId}/rooms/{roomId}/walls/{wallId}/customizations:
 *   get:
 *     summary: Get all customizations for a wall in a room under a floor by measurementId, floorId, roomId, and wallId
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The measurement ID to fetch customizations for
 *       - in: path
 *         name: floorId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The floor ID to fetch customizations for
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The room ID to fetch customizations for
 *       - in: path
 *         name: wallId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The wall ID to fetch customizations for
 *     responses:
 *       200:
 *         description: Customizations fetched successfully
 *       404:
 *         description: Wall, Room, Floor, or Measurement not found
 */
app.get('/measurements/:measurementId/floors/:floorId/rooms/:roomId/walls/:wallId/customizations', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.measurementId);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });

    const floor = measurement.floors.id(req.params.floorId);
    if (!floor) return res.status(404).json({ message: 'Floor not found' });

    const room = floor.rooms.id(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const wall = room.walls.id(req.params.wallId);
    if (!wall) return res.status(404).json({ message: 'Wall not found' });

    res.status(200).json(wall.wallCustomizations);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /measurements/{measurementId}/floors/{floorId}/rooms/{roomId}/walls/{wallId}/customizations:
 *   get:
 *     summary: Get all customizations for a specific wall in a room under a floor by measurementId, floorId, roomId, and wallId
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The measurement ID to fetch customizations for
 *       - in: path
 *         name: floorId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The floor ID to fetch customizations for
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The room ID to fetch customizations for
 *       - in: path
 *         name: wallId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The wall ID to fetch customizations for
 *     responses:
 *       200:
 *         description: Customizations fetched successfully
 *       404:
 *         description: Wall, Room, Floor, or Measurement not found
 */
app.get('/measurements/:measurementId/floors/:floorId/rooms/:roomId/walls/:wallId/customizations', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.measurementId);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });

    const floor = measurement.floors.id(req.params.floorId);
    if (!floor) return res.status(404).json({ message: 'Floor not found' });

    const room = floor.rooms.id(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const wall = room.walls.id(req.params.wallId);
    if (!wall) return res.status(404).json({ message: 'Wall not found' });

    res.status(200).json(wall.wallCustomizations);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


/**
 * @swagger
 * /measurements/{measurementId}/floors/{floorId}/rooms/{roomId}/walls/{wallId}/customizations/{customizationId}:
 *   put:
 *     summary: Update a wall customization by measurementId, floorId, roomId, wallId, and customizationId
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The measurement ID to update the customization
 *       - in: path
 *         name: floorId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The floor ID to update the customization
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The room ID to update the customization
 *       - in: path
 *         name: wallId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The wall ID to update the customization
 *       - in: path
 *         name: customizationId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The customization ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WallCustomization'
 *     responses:
 *       200:
 *         description: Customization updated successfully
 *       404:
 *         description: Wall, Room, Floor, Customization, or Measurement not found
 */
app.put('/measurements/:measurementId/floors/:floorId/rooms/:roomId/walls/:wallId/customizations/:customizationId', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.measurementId);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });

    const floor = measurement.floors.id(req.params.floorId);
    if (!floor) return res.status(404).json({ message: 'Floor not found' });

    const room = floor.rooms.id(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const wall = room.walls.id(req.params.wallId);
    if (!wall) return res.status(404).json({ message: 'Wall not found' });

    const customization = wall.wallCustomizations.id(req.params.customizationId);
    if (!customization) return res.status(404).json({ message: 'Customization not found' });

    // Update the customization
    Object.assign(customization, req.body);
    await measurement.save();

    res.status(200).json(customization);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

  
/**
 * @swagger
 * /measurements/{measurementId}/floors/{floorId}/rooms/{roomId}/walls/{wallId}/customizations/{customizationId}:
 *   delete:
 *     summary: Delete a wall customization by measurementId, floorId, roomId, wallId, and customizationId
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The measurement ID to delete the customization
 *       - in: path
 *         name: floorId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The floor ID to delete the customization
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The room ID to delete the customization
 *       - in: path
 *         name: wallId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The wall ID to delete the customization
 *       - in: path
 *         name: customizationId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The customization ID to delete
 *     responses:
 *       200:
 *         description: Customization deleted successfully
 *       404:
 *         description: Wall, Room, Floor, Customization, or Measurement not found
 */
app.delete('/measurements/:measurementId/floors/:floorId/rooms/:roomId/walls/:wallId/customizations/:customizationId', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.measurementId);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });

    const floor = measurement.floors.id(req.params.floorId);
    if (!floor) return res.status(404).json({ message: 'Floor not found' });

    const room = floor.rooms.id(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const wall = room.walls.id(req.params.wallId);
    if (!wall) return res.status(404).json({ message: 'Wall not found' });

    const customization = wall.wallCustomizations.id(req.params.customizationId);
    if (!customization) return res.status(404).json({ message: 'Customization not found' });

    // Remove the customization
    customization.remove();
    await measurement.save();

    res.status(200).json({ message: 'Customization deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



  /**
   * @swagger
   * /measurements/{id}:
   *   delete:
   *     summary: Delete a measurement by ID
   *     tags: [Measurements]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: objectId
   *         description: The measurement ID
   *     responses:
   *       200:
   *         description: Measurement deleted successfully
   *       404:
   *         description: Measurement not found
   */
  app.delete('/measurements/:id', async (req, res) => {
    try {
      const measurement = await Measurement.findByIdAndDelete(req.params.id);
      if (!measurement) return res.status(404).json({ message: 'Measurement not found' });
      res.status(200).json({ message: 'Measurement deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  


  /**
 * @swagger
 * /measurements/{measurementId}/floors/{floorId}/rooms/{roomId}/walls/{wallId}/windows:
 *   get:
 *     summary: Get all windows for a specific wall in a room under a floor by measurementId, floorId, roomId, and wallId
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The measurement ID to fetch windows for
 *       - in: path
 *         name: floorId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The floor ID to fetch windows for
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The room ID to fetch windows for
 *       - in: path
 *         name: wallId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The wall ID to fetch windows for
 *     responses:
 *       200:
 *         description: Windows fetched successfully
 *       404:
 *         description: Wall, Room, Floor, or Measurement not found
 */
app.get('/measurements/:measurementId/floors/:floorId/rooms/:roomId/walls/:wallId/windows', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.measurementId);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });

    const floor = measurement.floors.id(req.params.floorId);
    if (!floor) return res.status(404).json({ message: 'Floor not found' });

    const room = floor.rooms.id(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const wall = room.walls.id(req.params.wallId);
    if (!wall) return res.status(404).json({ message: 'Wall not found' });

    res.status(200).json(wall.windows);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /measurements/{measurementId}/floors/{floorId}/rooms/{roomId}/walls/{wallId}/windows:
 *   post:
 *     summary: Add a window to a wall in a room under a floor by measurementId, floorId, roomId, and wallId
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The measurement ID to add the window
 *       - in: path
 *         name: floorId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The floor ID to add the window
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The room ID to add the window
 *       - in: path
 *         name: wallId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The wall ID to add the window
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Window'
 *     responses:
 *       201:
 *         description: Window added successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Wall, Room, Floor, or Measurement not found
 */
app.post('/measurements/:measurementId/floors/:floorId/rooms/:roomId/walls/:wallId/windows', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.measurementId);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });

    const floor = measurement.floors.id(req.params.floorId);
    if (!floor) return res.status(404).json({ message: 'Floor not found' });

    const room = floor.rooms.id(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const wall = room.walls.id(req.params.wallId);
    if (!wall) return res.status(404).json({ message: 'Wall not found' });

    // Add new window to the wall

    wall.windows.push(req.body);
    await measurement.save();

    res.status(201).json(measurement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /measurements/{measurementId}/floors/{floorId}/rooms/{roomId}/walls/{wallId}/windows/{windowId}:
 *   put:
 *     summary: Update a window in a wall under a room and floor by measurementId, floorId, roomId, wallId, and windowId
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The measurement ID to update the window
 *       - in: path
 *         name: floorId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The floor ID to update the window
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The room ID to update the window
 *       - in: path
 *         name: wallId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The wall ID to update the window
 *       - in: path
 *         name: windowId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The window ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Window'
 *     responses:
 *       200:
 *         description: Window updated successfully
 *       404:
 *         description: Window, Wall, Room, Floor, or Measurement not found
 */
app.put('/measurements/:measurementId/floors/:floorId/rooms/:roomId/walls/:wallId/windows/:windowId', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.measurementId);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });

    const floor = measurement.floors.id(req.params.floorId);
    if (!floor) return res.status(404).json({ message: 'Floor not found' });

    const room = floor.rooms.id(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const wall = room.walls.id(req.params.wallId);
    if (!wall) return res.status(404).json({ message: 'Wall not found' });

    const window = wall.windows.id(req.params.windowId);
    if (!window) return res.status(404).json({ message: 'Window not found' });

    // Update window
    Object.assign(window, req.body);
    await measurement.save();

    res.status(200).json(window);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /measurements/{measurementId}/floors/{floorId}/rooms/{roomId}/walls/{wallId}/windows/{windowId}:
 *   delete:
 *     summary: Delete a window from a wall in a room under a floor by measurementId, floorId, roomId, wallId, and windowId
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The measurement ID to delete the window
 *       - in: path
 *         name: floorId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The floor ID to delete the window
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The room ID to delete the window
 *       - in: path
 *         name: wallId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The wall ID to delete the window
 *       - in: path
 *         name: windowId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The window ID to delete
 *     responses:
 *       200:
 *         description: Window deleted successfully
 *       404:
 *         description: Window, Wall, Room, Floor, or Measurement not found
 */
app.delete('/measurements/:measurementId/floors/:floorId/rooms/:roomId/walls/:wallId/windows/:windowId', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.measurementId);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });

    const floor = measurement.floors.id(req.params.floorId);
    if (!floor) return res.status(404).json({ message: 'Floor not found' });

    const room = floor.rooms.id(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const wall = room.walls.id(req.params.wallId);
    if (!wall) return res.status(404).json({ message: 'Wall not found' });

    const window = wall.windows.id(req.params.windowId);
    if (!window) return res.status(404).json({ message: 'Window not found' });

    // Remove window
    window.remove();
    await measurement.save();

    res.status(200).json({ message: 'Window deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /measurements/{measurementId}/floors/{floorId}/rooms/{roomId}/walls/{wallId}/doors:
 *   get:
 *     summary: Get all doors for a specific wall in a room under a floor by measurementId, floorId, roomId, and wallId
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The measurement ID to fetch doors for
 *       - in: path
 *         name: floorId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The floor ID to fetch doors for
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The room ID to fetch doors for
 *       - in: path
 *         name: wallId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The wall ID to fetch doors for
 *     responses:
 *       200:
 *         description: Doors fetched successfully
 *       404:
 *         description: Wall, Room, Floor, or Measurement not found
 */
app.get('/measurements/:measurementId/floors/:floorId/rooms/:roomId/walls/:wallId/doors', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.measurementId);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });

    const floor = measurement.floors.id(req.params.floorId);
    if (!floor) return res.status(404).json({ message: 'Floor not found' });

    const room = floor.rooms.id(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const wall = room.walls.id(req.params.wallId);
    if (!wall) return res.status(404).json({ message: 'Wall not found' });

    res.status(200).json(wall.doors);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /measurements/{measurementId}/floors/{floorId}/rooms/{roomId}/walls/{wallId}/doors:
 *   post:
 *     summary: Add a door to a wall in a room under a floor by measurementId, floorId, roomId, and wallId
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The measurement ID to add the door
 *       - in: path
 *         name: floorId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The floor ID to add the door
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The room ID to add the door
 *       - in: path
 *         name: wallId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The wall ID to add the door
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Door'
 *     responses:
 *       201:
 *         description: Door added successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Wall, Room, Floor, or Measurement not found
 */
app.post('/measurements/:measurementId/floors/:floorId/rooms/:roomId/walls/:wallId/doors', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.measurementId);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });

    const floor = measurement.floors.id(req.params.floorId);
    if (!floor) return res.status(404).json({ message: 'Floor not found' });

    const room = floor.rooms.id(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const wall = room.walls.id(req.params.wallId);
    if (!wall) return res.status(404).json({ message: 'Wall not found' });

    // Add new door to the wall
  //  const newDoor = new Door(req.body);
    wall.doors.push(req.body);
    await measurement.save();

    res.status(201).json(measurement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


/**
 * @swagger
 * /measurements/{measurementId}/floors/{floorId}/rooms/{roomId}/walls/{wallId}/doors/{doorId}:
 *   put:
 *     summary: Update a door in a wall under a room and floor by measurementId, floorId, roomId, wallId, and doorId
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The measurement ID to update the door
 *       - in: path
 *         name: floorId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The floor ID to update the door
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The room ID to update the door
 *       - in: path
 *         name: wallId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The wall ID to update the door
 *       - in: path
 *         name: doorId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The door ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Door'
 *     responses:
 *       200:
 *         description: Door updated successfully
 *       404:
 *         description: Door, Wall, Room, Floor, or Measurement not found
 */
app.put('/measurements/:measurementId/floors/:floorId/rooms/:roomId/walls/:wallId/doors/:doorId', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.measurementId);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });

    const floor = measurement.floors.id(req.params.floorId);
    if (!floor) return res.status(404).json({ message: 'Floor not found' });

    const room = floor.rooms.id(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const wall = room.walls.id(req.params.wallId);
    if (!wall) return res.status(404).json({ message: 'Wall not found' });

    const door = wall.doors.id(req.params.doorId);
    if (!door) return res.status(404).json({ message: 'Door not found' });

    // Update door
    Object.assign(door, req.body);
    await measurement.save();

    res.status(200).json(door);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


/**
 * @swagger
 * /measurements/{measurementId}/floors/{floorId}/rooms/{roomId}/walls/{wallId}/doors/{doorId}:
 *   delete:
 *     summary: Delete a door from a wall in a room under a floor by measurementId, floorId, roomId, wallId, and doorId
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The measurement ID to delete the door
 *       - in: path
 *         name: floorId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The floor ID to delete the door
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The room ID to delete the door
 *       - in: path
 *         name: wallId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The wall ID to delete the door
 *       - in: path
 *         name: doorId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The door ID to delete
 *     responses:
 *       200:
 *         description: Door deleted successfully
 *       404:
 *         description: Door, Wall, Room, Floor, or Measurement not found
 */
app.delete('/measurements/:measurementId/floors/:floorId/rooms/:roomId/walls/:wallId/doors/:doorId', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.measurementId);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });

    const floor = measurement.floors.id(req.params.floorId);
    if (!floor) return res.status(404).json({ message: 'Floor not found' });

    const room = floor.rooms.id(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const wall = room.walls.id(req.params.wallId);
    if (!wall) return res.status(404).json({ message: 'Wall not found' });

    const door = wall.doors.id(req.params.doorId);
    if (!door) return res.status(404).json({ message: 'Door not found' });

    // Remove door
    door.remove();
    await measurement.save();

    res.status(200).json({ message: 'Door deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



/**
 * @swagger
 * /measurements/{measurementId}/floors/{floorId}/rooms/{roomId}/walls/{wallId}/lintels:
 *   get:
 *     summary: Get all lintels for a specific wall in a room under a floor by measurementId, floorId, roomId, and wallId
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The measurement ID to fetch lintels for
 *       - in: path
 *         name: floorId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The floor ID to fetch lintels for
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The room ID to fetch lintels for
 *       - in: path
 *         name: wallId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The wall ID to fetch lintels for
 *     responses:
 *       200:
 *         description: Lintels fetched successfully
 *       404:
 *         description: Wall, Room, Floor, or Measurement not found
 */
app.get('/measurements/:measurementId/floors/:floorId/rooms/:roomId/walls/:wallId/lintels', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.measurementId);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });

    const floor = measurement.floors.id(req.params.floorId);
    if (!floor) return res.status(404).json({ message: 'Floor not found' });

    const room = floor.rooms.id(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const wall = room.walls.id(req.params.wallId);
    if (!wall) return res.status(404).json({ message: 'Wall not found' });

    res.status(200).json(wall.lintels);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


/**
 * @swagger
 * /measurements/{measurementId}/floors/{floorId}/rooms/{roomId}/walls/{wallId}/lintels:
 *   post:
 *     summary: Add a lintel to a wall in a room under a floor by measurementId, floorId, roomId, and wallId
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The measurement ID to add the lintel
 *       - in: path
 *         name: floorId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The floor ID to add the lintel
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The room ID to add the lintel
 *       - in: path
 *         name: wallId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The wall ID to add the lintel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lintel'
 *     responses:
 *       201:
 *         description: Lintel added successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Wall, Room, Floor, or Measurement not found
 */
app.post('/measurements/:measurementId/floors/:floorId/rooms/:roomId/walls/:wallId/lintels', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.measurementId);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });

    const floor = measurement.floors.id(req.params.floorId);
    if (!floor) return res.status(404).json({ message: 'Floor not found' });

    const room = floor.rooms.id(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const wall = room.walls.id(req.params.wallId);
    if (!wall) return res.status(404).json({ message: 'Wall not found' });

    // Add new lintel to the wall
//    const newLintel = new Lintel(req.body);
    wall.lintels.push(req.body);
    await measurement.save();

    res.status(201).json(measurement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


/**
 * @swagger
 * /measurements/{measurementId}/floors/{floorId}/rooms/{roomId}/walls/{wallId}/lintels/{lintelId}:
 *   put:
 *     summary: Update a lintel in a wall under a room and floor by measurementId, floorId, roomId, wallId, and lintelId
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The measurement ID to update the lintel
 *       - in: path
 *         name: floorId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The floor ID to update the lintel
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The room ID to update the lintel
 *       - in: path
 *         name: wallId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The wall ID to update the lintel
 *       - in: path
 *         name: lintelId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The lintel ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lintel'
 *     responses:
 *       200:
 *         description: Lintel updated successfully
 *       404:
 *         description: Lintel, Wall, Room, Floor, or Measurement not found
 */
app.put('/measurements/:measurementId/floors/:floorId/rooms/:roomId/walls/:wallId/lintels/:lintelId', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.measurementId);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });

    const floor = measurement.floors.id(req.params.floorId);
    if (!floor) return res.status(404).json({ message: 'Floor not found' });

    const room = floor.rooms.id(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const wall = room.walls.id(req.params.wallId);
    if (!wall) return res.status(404).json({ message: 'Wall not found' });

    const lintel = wall.lintels.id(req.params.lintelId);
    if (!lintel) return res.status(404).json({ message: 'Lintel not found' });

    // Update lintel
    Object.assign(lintel, req.body);
    await measurement.save();

    res.status(200).json(lintel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


/**
 * @swagger
 * /measurements/{measurementId}/floors/{floorId}/rooms/{roomId}/walls/{wallId}/lintels/{lintelId}:
 *   delete:
 *     summary: Delete a lintel from a wall in a room under a floor by measurementId, floorId, roomId, wallId, and lintelId
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The measurement ID to delete the lintel
 *       - in: path
 *         name: floorId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The floor ID to delete the lintel
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The room ID to delete the lintel
 *       - in: path
 *         name: wallId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The wall ID to delete the lintel
 *       - in: path
 *         name: lintelId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The lintel ID to delete
 *     responses:
 *       200:
 *         description: Lintel deleted successfully
 *       404:
 *         description: Lintel, Wall, Room, Floor, or Measurement not found
 */
app.delete('/measurements/:measurementId/floors/:floorId/rooms/:roomId/walls/:wallId/lintels/:lintelId', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.measurementId);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });

    const floor = measurement.floors.id(req.params.floorId);
    if (!floor) return res.status(404).json({ message: 'Floor not found' });

    const room = floor.rooms.id(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const wall = room.walls.id(req.params.wallId);
    if (!wall) return res.status(404).json({ message: 'Wall not found' });

    const lintel = wall.lintels.id(req.params.lintelId);
    if (!lintel) return res.status(404).json({ message: 'Lintel not found' });

    // Remove lintel
    lintel.remove();
    await measurement.save();

    res.status(200).json({ message: 'Lintel deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

  module.exports = app;