const express = require("express");
const Quotation = require("../models/quotation_schema"); // Import Quotation model
const router = express.Router();
const Lead = require('../models/lead_schema')
const mongoose = require("mongoose");
/**
 * @swagger
 * tags:
 *   name: Quotations
 *   description: API for managing quotations
 */

/**
 * @swagger
 * /quotations:
 *   post:
 *     summary: Create a new quotation
 *     tags: [Quotations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lead:
 *                 type: string
 *                 description: Reference to the Lead ID
 *               package:
 *                 type: string
 *                 description: Reference to the Package ID
 *               services:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     module:
 *                       type: string
 *                       description: Reference to the Module ID
 *               discount:
 *                 type: number
 *                 description: Discount percentage
 *               notes:
 *                 type: string
 *                 description: Optional notes
 *     responses:
 *       201:
 *         description: Quotation created successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
router.post("/quotations", async (req, res) => {
  try {
    const { lead, package,branch ,services, discount, notes } = req.body;

    const quotation = new Quotation({
      lead,
      package,
      services,
      branch,
      discount,
      notes,
    });

    var leads =  await Lead.findByIdAndUpdate(lead,{leadStatus:"lead"})  
  
    await quotation.save();

    var quote =await Quotation.findById(quotation._id).populate({path:"package",populate:{path:"services.modules_service",strictPopulate:false},strictPopulate:false})
    .populate("services.module", "name cost");
    var totalcost =0;

    quote. package.services.forEach(element => {
      
        console.log("service "+element.cost)
        totalcost +=element.cost;
        console.log(totalcost)
    });

    console.log(quote.package.ep)
    totalcost+= quote.package.ep;
    totalcost+=quote.package.office;
    totalcost+=quote.package.cp;
    totalcost+=quote.package.profit;
    console.log(totalcost)
    console.log(totalcost)
   // quote.totalCost = totalcost;

    Quotation.findByIdAndUpdate(quote._id,{totalCost:totalcost}).then((result)=>{
    console.log(result)
   }).catch((errir)=>{
    console.log(errir)
   })



    res.status(201).json({ message: "Quotation created successfully.", quotation });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error creating quotation.", error: error.message });
  }
});

/**
 * @swagger
 * /quotations:
 *   get:
 *     summary: Get all quotations
 *     tags: [Quotations]
 *     responses:
 *       200:
 *         description: Quotations retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/quotations", async (req, res) => {
  try {
    const quotations = await Quotation.find()
      .populate("lead", "name email mobile")
    //  .populate("package", "name")
    .populate({path:"package",populate:{path:"services.modules_service",strictPopulate:false},strictPopulate:false})
      .populate("services.module", "name cost");

    res.status(200).json({ message: "Quotations retrieved successfully.", quotations });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving quotations.", error: error.message });
  }
});

/**
 * @swagger
 * /quotations/{id}:
 *   get:
 *     summary: Get a quotation by ID
 *     tags: [Quotations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quotation ID
 *     responses:
 *       200:
 *         description: Quotation retrieved successfully
 *       404:
 *         description: Quotation not found
 *       500:
 *         description: Server error
 */
router.get("/quotations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const quotation = await Quotation.findById(id)
      .populate("lead", "name email mobile")
      .populate({path:"package",populate:{path:"services.modules_service",strictPopulate:false},strictPopulate:false})
      .populate("services.module", "name cost");

    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found." });
    }

    res.status(200).json({ message: "Quotation retrieved successfully.", quotation });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving quotation.", error: error.message });
  }
});

/**
 * @swagger
 * /quotations/{id}:
 *   put:
 *     summary: Update a quotation
 *     tags: [Quotations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quotation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lead:
 *                 type: string
 *                 description: Reference to the Lead ID
 *               package:
 *                 type: string
 *                 description: Reference to the Package ID
 *               services:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     module:
 *                       type: string
 *                       description: Reference to the Module ID
 *               discount:
 *                 type: number
 *                 description: Discount percentage
 *               notes:
 *                 type: string
 *                 description: Optional notes
 *     responses:
 *       200:
 *         description: Quotation updated successfully
 *       404:
 *         description: Quotation not found
 *       500:
 *         description: Server error
 */
router.put("/quotations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { lead, package, services, discount, notes } = req.body;

    const quotation = await Quotation.findByIdAndUpdate(
      id,
      { lead, package, services, discount, notes },
      { new: true, runValidators: true }
    );

    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found." });
    }

    res.status(200).json({ message: "Quotation updated successfully.", quotation });
  } catch (error) {
    res.status(500).json({ message: "Error updating quotation.", error: error.message });
  }
});

/**
 * @swagger
 * /quotations/{id}:
 *   delete:
 *     summary: Delete a quotation
 *     tags: [Quotations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quotation ID
 *     responses:
 *       200:
 *         description: Quotation deleted successfully
 *       404:
 *         description: Quotation not found
 *       500:
 *         description: Server error
 */
router.delete("/quotations/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const quotation = await Quotation.findByIdAndDelete(id);

    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found." });
    }

    res.status(200).json({ message: "Quotation deleted successfully.", quotation });
  } catch (error) {
    res.status(500).json({ message: "Error deleting quotation.", error: error.message });
  }
});


/**
 * @swagger
 * /quotations/{id}/leadgenerate:
 *   post:
 *     summary: Update a quotation
 *     tags: [Quotations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quotation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lead:
 *                 type: string
 *                 description: Reference to the Lead ID
 *               package:
 *                 type: string
 *                 description: Reference to the Package ID
 *               services:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     module:
 *                       type: string
 *                       description: Reference to the Module ID
 *                   cost:
 *                     module:
 *                       type: string
 *                       description: Reference to the Module ID
 *               discount:
 *                 type: number
 *                 description: Discount percentage
 *               notes:
 *                 type: string
 *                 description: Optional notes
 *     responses:
 *       200:
 *         description: Quotation updated successfully
 *       404:
 *         description: Quotation not found
 *       500:
 *         description: Server error
 */
router.post("/quotations/:id/leadgenerate", async (req, res) => {
  try {
    const { id } = req.params;
    const { lead, package, services, discount, notes,branch } = req.body;
    
    console.log(req.body)
    const presentlead = await Lead.findById(id).populate("package services");

    if(!presentlead)
    {
      res.status(200).json({ message: "Lead Not Found ", qt: presentlead });
    
    }else{

      var ground_stiltsqft = 0;
      var ground_stiltcost = 0;
      var floorwisecost = []

      if(presentlead.package!=null){

        
        ground_stiltsqft = presentlead.plotSqYards * 9 * 0.76

        if( presentlead.measurement.ground_stilt="Stilt"){
          ground_stiltcost = ground_stiltsqft *presentlead.package.cost * 0.76
        }else{
          ground_stiltcost = ground_stiltsqft *presentlead.package.cost
        }
  
        console.log(ground_stiltcost)
     
        presentlead.measurement.noof_floors.forEach((element)=>{
    
          var ground_stiltsqftf  =0;
          var ground_stiltcostf  =0;
    
          console.log(presentlead.plotSqYards * 9 * 0.76)
          console.log(ground_stiltsqftf  * presentlead.package.cost)
          ground_stiltsqftf =  presentlead.plotSqYards * 9 * 0.76
          floorwisecost.push({
            floornumber:element,
            ground_stiltsqftf : ground_stiltsqftf,
            ground_stiltcostf : ground_stiltsqftf  * presentlead.package.cost,
    
          })
    
        })
        var totalCost = 0;
        const quotationis =await Quotation.findOne({lead:id})
        console.log(quotationis)
        if(quotationis){
      

          totalCost += ground_stiltcost ;
          floorwisecost.forEach((elel)=>{
            totalCost+= elel.ground_stiltcostf

          })
          totalCost -= discount;
        await  Quotation.findOneAndUpdate({lead:id},{discount,$push:{notes:notes},totalCost,services,floors_wise:floorwisecost,ground_stilt:{ground_stilt:presentlead.measurement.ground_stilt,ground_stiltcost:ground_stiltcost,ground_stiltsqft:ground_stiltsqft}})

        }else{
   

          totalCost += ground_stiltcost ;
          floorwisecost.forEach((elel)=>{
            totalCost+= elel.ground_stiltcostf
          })
          totalCost-=discount;
          await  Quotation.create({lead:id,discount,$push:{notes:notes},branch:presentlead.branch,totalCost:totalCost,package:package,services,floors_wise:floorwisecost,ground_stilt:{ground_stilt:presentlead.measurement.ground_stilt,ground_stiltcost:ground_stiltcost,ground_stiltsqft:ground_stiltsqft}})

        }
    
        res.status(200).json({ message: "Quotation updated successfully.", package:presentlead.package,ground_stiltsqft,ground_stiltcost,totalCost,floorwisecost });
    
        return;

      }else{
        console.log("At else")
        var allservicecost = 0;
        ground_stiltsqft = presentlead.plotSqYards * 9 * 0.76
        console.log( presentlead.services)
    
        services.forEach((bodyservice)=>{
         // console.log(bodyservice)
          presentlead.services.forEach((leadservices)=>{
            console.log(bodyservice.module)
            console.log(leadservices._id)
            // ObjectId from Mongoose
            const objectId =new mongoose.Types.ObjectId(bodyservice.module);
           if( objectId.equals(leadservices._id)){
            console.log(bodyservice.cost)
            allservicecost = allservicecost+bodyservice.cost;
            console.log(allservicecost)
           }
          })
        })

        console.log(allservicecost)


        if( presentlead.measurement.ground_stilt="Stilt"){
          ground_stiltcost = ground_stiltsqft *presentlead.package.cost * 0.76
        }else{
          ground_stiltcost = ground_stiltsqft *presentlead.package.cost
        }
  
         //  ground_stiltcost = ground_stiltsqft *allservicecost* 0.7
        
        presentlead.measurement.noof_floors.forEach((element)=>{
    
          var ground_stiltsqftf  =0;
          var ground_stiltcostf  =0;
    
     
          ground_stiltsqftf =  presentlead.plotSqYards * 9 * 0.76
          floorwisecost.push({
            floornumber:element,
            ground_stiltsqftf : ground_stiltsqftf,
            ground_stiltcostf : ground_stiltsqftf  * allservicecost,
    
          })
    
        })
        var totalCost = 0;
        const quotationis =await Quotation.findOne({lead:id})
        console.log(quotationis)
        if(quotationis){
    
          totalCost += ground_stiltcost ;
          floorwisecost.forEach((elel)=>{
            totalCost+= elel.ground_stiltcostf

          })
          totalCost-=discount;
        await  Quotation.findOneAndUpdate({lead:id},{$push:{notes:notes},discount,totalCost,services,floors_wise:floorwisecost,ground_stilt:{ground_stilt:presentlead.measurement.ground_stilt,ground_stiltcost:ground_stiltcost,ground_stiltsqft:ground_stiltsqft}})

        }else{
   

          totalCost += ground_stiltcost ;
          floorwisecost.forEach((elel)=>{
            totalCost+= elel.ground_stiltcostf
          })
          totalCost-=discount;
          await  Quotation.create({lead:id,discount,$push:{notes:notes},branch:presentlead.branch,totalCost:totalCost,package:package,services,floors_wise:floorwisecost,ground_stilt:{ground_stilt:presentlead.measurement.ground_stilt,ground_stiltcost:ground_stiltcost,ground_stiltsqft:ground_stiltsqft}})

        }
    
        res.status(200).json({ message: "Quotation updated successfully.", package:presentlead.package,services:presentlead.services,ground_stiltsqft,ground_stiltcost,floorwisecost });
    
        return;
  
      }

  

    }

 return;

    res.status(200).json({ message: "Quotation updated successfully.", qt: presentlead });
    return ;
    const quotation = await Quotation.create(
      id,
      { lead, package, services, discount, notes },
      { new: true, runValidators: true }
    );

    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found." });
    }

    res.status(200).json({ message: "Quotation updated successfully.", quotation });
  } catch (error) {
    res.status(500).json({ message: "Error updating quotation.", error: error.message });
  }
});


module.exports = router;
