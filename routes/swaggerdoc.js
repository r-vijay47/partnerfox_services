/**
 * @swagger
 * components:
 *   schemas:
 *     Quotation:
 *       type: object
 *       properties:
 *         lead:
 *           type: string
 *           description: Reference to the Lead schema.
 *           example: "648dfc7d35e6c4f7ac1d2a33"
 *         package:
 *           type: string
 *           description: Reference to the Package schema.
 *           example: "648dfc8f67e7b2a8bdc2d123"
 *         services:
 *           type: array
 *           description: List of services/modules included in the quotation.
 *           items:
 *             type: object
 *             properties:
 *               module:
 *                 type: string
 *                 description: Reference to the Module schema.
 *                 example: "648dfc7d35e6c4f7ac1d2a11"
 *               cost:
 *                 type: number
 *                 description: Cost of the selected module/service.
 *                 example: 5000
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the selected service.
 *                 example: 2
 *         discount:
 *           type: number
 *           description: Discount applied to the total cost in percentage.
 *           example: 10
 *         notes:
 *           type: array
 *           description: Optional notes for the quotation.
 *           items:
 *             type: string
 *             example: "Urgent delivery required."
 *         totalCost:
 *           type: number
 *           description: Total cost of the quotation after applying discount.
 *           example: 9000
 *       required:
 *         - lead
 *         - services
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the user
 *         name:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *           description: List of role IDs assigned to the user
 *         branch:
 *           type: string
 *           description: The ref ID of the branch
 *         isActive:
 *           type: boolean
 *           description: User active status
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         name: John Doe
 *         email: john.doe@example.com
 *         password: password123
 *         roles: ["61b7b7f6e9d1a62078bc5d3a"]
 *         branch: "61b7b7f6e9d1a62078bc5d3a"
 *         isActive: true
 */



/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the role
 *         name:
 *           type: string
 *           enum: ["admin", "editor", "viewer"]
 *           description: Name of the role
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *             enum: ["create", "read", "update", "delete"]
 *           description: Permissions assigned to the role
 *       example:
 *         name: editor
 *         permissions: ["read", "update"]
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Lead:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         mobile:
 *           type: string
 *         email:
 *           type: string
 *         location:
 *           type: string
 *         buildingType:
 *           type: string
 *         propertyType:
 *           type: string
 *         looking:
 *           type: string
 *         possesionin:
 *           type: string
 *         siteDetails:
 *           type: string
 *         cameFrom:
 *           type: string
 *         contacttoat:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               contactnotes:
 *                 type: string
 *               addedAt:
 *                 type: string
 *         meetings:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               meetingnotes:
 *                 type: string
 *               addedAt:
 *                 type: string
 *         package:
 *           type: string
 *         plotSqYards:
 *           type: number
 *         measurement:
 *           type: object
 *           properties:
 *            ground_stilt:
 *             type: string
 *            noof_floors:
 *             type: array
 *             items:
 *              type: number
 *         services:
 *           type: array
 *           items:
 *             type: string
 *         branch:
 *           type: string
 *           description: The ref ID of the branch
 *         generateOptions:
 *           type: array
 *           items:
 *             type: string
 *         leadStatus:
 *           type: string
 *           enum: ["refer", "enquiry", "lead", "project"]
 *       required:
 *         - name
 *         - mobile
 *         - email
 *         - location
 *         - plotSqYards
 *         - buildingType
 *         - propertyType
 *         - looking
 *         - cameFrom
 *         - leadStatus
 *     Module:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           enum: ["Structure", "Walls", "Windows", "Doors", "Painting", "Plumbing", "Electrical", "Flooring", "Fabrication"]
 *         description:
 *           type: string
 *         cost:
 *           type: number
 *     Package:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         services:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               modules_service:
 *                 type: string
 *               cost:
 *                 type: number
 *               sub_modules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     sub_modules:
 *                      type: string              
 *                     cost:
 *                      type: number     
 *         description:
 *           type: string
 *         ep:
 *           type: number
 *         office:
 *           type: number
 *         cp:
 *           type: number
 *         profit:
 *           type: number
 */



/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - user
 *         - lead
 *         - quotation
 *         - amount
 *         - paymentMode
 *       properties:
 *         user:
 *           type: string
 *           description: ID of the user making the payment
 *           example: "63fb1f2f5dff5c4b9d4a67a9"
 *         lead:
 *           type: string
 *           description: ID of the lead associated with the payment
 *           example: "63fb1f2f5dff5c4b9d4a67b2"
 *         quotation:
 *           type: string
 *           description: ID of the quotation linked to the payment
 *           example: "63fb1f2f5dff5c4b9d4a67c3"
 *         amount:
 *           type: number
 *           description: Payment amount
 *           example: 50000
 *         paymentMode:
 *           type: string
 *           description: Mode of payment
 *           enum: [Cash, Credit Card, Bank Transfer, UPI, Cheque]
 *           example: "UPI"
 *         paymentDate:
 *           type: string
 *           format: date-time
 *           description: Date of payment
 *           example: "2024-11-20T10:30:00Z"
 *         referenceNumber:
 *           type: string
 *           description: Optional transaction reference number
 *           example: "TXN12345678"
 *         notes:
 *           type: string
 *           description: Additional notes about the payment
 *           example: "Partial payment for quotation #123"
 *         invoice_url:
 *           type: string
 *           description: Additional invoce url
 *           example: "Http://localhost:3000/uploads/invoice.pdf"
 *       example:
 *         user: "63fb1f2f5dff5c4b9d4a67a9"
 *         lead: "63fb1f2f5dff5c4b9d4a67b2"
 *         quotation: "63fb1f2f5dff5c4b9d4a67c3"
 *         amount: 50000
 *         paymentMode: "UPI"
 *         paymentDate: "2024-11-20T10:30:00Z"
 *         referenceNumber: "TXN12345678"
 *         notes: "Partial payment for quotation #123"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - lead
 *         - quotation
 *       properties:
 *         lead:
 *           type: string
 *           description: ID of the lead associated with the project
 *         quotation:
 *           type: string
 *           description: ID of the quotation associated with the project
 *         projectmanager:
 *           type: string
 *           description: ID of the project manager
 *         desiginerorarchiteck:
 *           type: string
 *           description: ID of the designer or architect
 *         spg:
 *           type: string
 *           description: ID of the SPG user
 *         status:
 *           type: string
 *           enum: [Initiated, In Progress, Completed]
 *           default: Initiated
 *         startDate:
 *           type: string
 *           format: date-time
 *         completionDate:
 *           type: string
 *           format: date-time
 *         notes:
 *           type: array
 *           items:
 *             type: string
 *           description: Notes related to the project
 *         createdBy:
 *           type: string
 *           description: ID of the user who created the project
 */


// Swagger Definitions
/**
 * @swagger
 * components:
 *   schemas:
 *     File:
 *       type: object
 *       properties:
 *         filename:
 *           type: string
 *         url:
 *           type: string
 *         extension:
 *           type: string
 *           enum: [pdf, xlsx, jpg, png]
 *     VersionedFile:
 *       type: object
 *       properties:
 *         file:
 *           $ref: '#/components/schemas/File'
 *         ver:
 *           type: integer
 *         isSelected:
 *           type: boolean
 *         canview:
 *           type: boolean
 *     Designer:
 *       type: object
 *       required:
 *         - lead
 *         - status
 *       properties:
 *         designer:
 *           type: array
 *           items:
 *             type: string
 *             format: objectId
 *           description: List of designers assigned to the project.
 *         lead:
 *           type: string
 *           format: objectId
 *           description: ID of the lead (person responsible for the project).
 *         project:
 *           type: string
 *           format: objectId
 *           description: Reference to the project associated with the design.
 *         description:
 *           type: string
 *           description: Optional description of the project.
 *         requirements:
 *           type: string
 *           description: Optional requirements for the project.
 *         plotlayout:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VersionedFile'
 *           description: Array of versioned plot layout files.
 *         floorplan:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VersionedFile'
 *           description: Array of versioned floorplan files.
 *         elevation:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VersionedFile'
 *           description: Array of versioned elevation files.
 *         structraldrawings:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VersionedFile'
 *           description: Array of versioned structural drawings files.
 *         plinthlayout:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VersionedFile'
 *           description: Array of versioned plinth layout files.
 *         steelBOQ:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VersionedFile'
 *           description: Array of versioned steel Bill of Quantities (BOQ) files.
 *         boq:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VersionedFile'
 *           description: Array of versioned Bill of Quantities (BOQ) files.
 *         electrical:
 *           type: object
 *           properties:
 *             pdf:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VersionedFile'
 *               description: Versioned PDFs for electrical.
 *             excel:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VersionedFile'
 *               description: Versioned Excel files for electrical.
 *         hvac:
 *           type: object
 *           properties:
 *             pdf:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VersionedFile'
 *               description: Versioned PDFs for HVAC.
 *             excel:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VersionedFile'
 *               description: Versioned Excel files for HVAC.
 *         plumbing:
 *           type: object
 *           properties:
 *             pdf:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VersionedFile'
 *               description: Versioned PDFs for plumbing.
 *             excel:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VersionedFile'
 *               description: Versioned Excel files for plumbing.
 *         status:
 *           type: string
 *           enum: ["Initiated","Accepted", "Working", "InProgress", "Completed","Waitingforapproval","Waitingforfileuploads"]
 *           description: Status of the designer project.
 *           default: "Initiated"
 *         clientconformation:
 *           type: boolean
 */



// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     Measurement:
//  *       type: object
//  *       required:
//  *         - projectId
//  *         - leadId
//  *         - totalFloors
//  *       properties:
//  *         projectId:
//  *           type: string
//  *           description: ID of the project.
//  *         leadId:
//  *           type: string
//  *           description: ID of the lead.
//  *         users:
//  *           type: array
//  *           items:
//  *             type: string
//  *           description: List of user IDs.
//  *         totalFloors:
//  *           type: number
//  *           description: Total number of floors.
//  *         units:
//  *           type: string
//  *           enum:
//  *             - cm
//  *             - mm
//  *             - inchies
//  *           description: Name of the wall.
//  *         floors:
//  *           type: array
//  *           items:
//  *             $ref: '#/components/schemas/Floor'
//  *           description: Array of floor details.
//  * 
//  *     Floor:
//  *       type: object
//  *       required:
//  *         - floorNumber
//  *       properties:
//  *         floorNumber:
//  *           type: number
//  *           description: The floor number.
//  *         rooms:
//  *           type: array
//  *           items:
//  *             $ref: '#/components/schemas/Room'
//  *           description: Array of room details.
//  * 
//  *     Room:
//  *       type: object
//  *       required:
//  *         - name
//  *       properties:
//  *         name:
//  *           type: string
//  *           description: The name of the room.
//  *         walls:
//  *           type: array
//  *           items:
//  *             $ref: '#/components/schemas/Wall'
//  *           description: Array of wall details.
//  * 
//  *     Wall:
//  *       type: object
//  *       required:
//  *         - wallName
//  *         - wallType
//  *       properties:
//  *         wallName:
//  *           type: string
//  *           enum:
//  *             - North
//  *             - South
//  *             - East
//  *             - West
//  *             - NorthEast
//  *             - NorthWest
//  *             - SouthEast
//  *             - SouthWest
//  *           description: Name of the wall.
//  *         wallType:
//  *           $ref: '#/components/schemas/WallType'
//  *         length:
//  *           type: number
//  *           description: Length of the wall.
//  *         height:
//  *           type: number
//  *           description: Height of the wall.
//  *         windows:
//  *           type: array
//  *           items:
//  *             $ref: '#/components/schemas/Window'
//  *           description: Array of window details.
//  *         doors:
//  *           type: array
//  *           items:
//  *             $ref: '#/components/schemas/Door'
//  *           description: Array of door details.
//  *         lintels:
//  *           type: array
//  *           items:
//  *             $ref: '#/components/schemas/Lintel'
//  *           description: Array of lintel details.
//  *         wallCustomizations:
//  *           type: array
//  *           items:
//  *             $ref: '#/components/schemas/WallCustomization'
//  *           description: Array of wall customizations.
//  *         executionManagerComment:
//  *           type: array
//  *           items:
//  *             type: string
//  *           description: Comment from the execution manager.
//  * 
//  *     WallType:
//  *       type: object
//  *       required:
//  *         - type
//  *         - thickness
//  *       properties:
//  *         type:
//  *           type: string
//  *           enum:
//  *             - Internal
//  *             - External
//  *           description: Type of the wall.
//  *         thickness:
//  *           type: number
//  *           description: Thickness of the wall.
//  * 
//  *     Window:
//  *       type: object
//  *       properties:
//  *         width:
//  *           type: number
//  *           description: Width of the window.
//  *         height:
//  *           type: number
//  *           description: Height of the window.
//  *         sillHeight:
//  *           type: number
//  *           description: Height of the sill.
//  * 
//  *     Door:
//  *       type: object
//  *       properties:
//  *         width:
//  *           type: number
//  *           description: Width of the door.
//  *         height:
//  *           type: number
//  *           description: Height of the door.
//  * 
//  *     Lintel:
//  *       type: object
//  *       properties:
//  *         height:
//  *           type: number
//  *           description: Height of the lintel.
//  *         width:
//  *           type: number
//  *           description: Width of the lintel.
//  * 
//  *     WallCustomization:
//  *       type: object
//  *       properties:
//  *         type:
//  *           type: string
//  *           description: Type of customization.
//  *         description:
//  *           type: string
//  *           description: Description of the customization.
//  *         measurements:
//  *           type: object
//  *           properties:
//  *             length:
//  *               type: number
//  *               description: Length of the customization.
//  *             width:
//  *               type: number
//  *               description: Width of the customization.
//  *             height:
//  *               type: number
//  *               description: Height of the customization.
//  */




// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     Measurement:
//  *       type: object
//  *       required:
//  *         - projectId
//  *         - leadId
//  *         - unit
//  *         - totalFloors
//  *       properties:
//  *         projectId:
//  *           type: string
//  *           description: "ID of the project"
//  *         leadId:
//  *           type: string
//  *           description: "ID of the lead"
//  *         unit:
//  *           type: string
//  *           enum: ["cm", "mm", "inches", "feet", "m"]
//  *           description: "Unit of measurement for dimensions"
//  *         totalFloors:
//  *           type: integer
//  *           description: "Total number of floors in the project"
//  *         floors:
//  *           type: array
//  *           items:
//  *             $ref: '#/components/schemas/Floor'
//  *           description: "List of floors in the project"
//  * 
//  *     Floor:
//  *       type: object
//  *       required:
//  *         - floorNumber
//  *         - rooms
//  *       properties:
//  *         floorNumber:
//  *           type: integer
//  *           description: "Floor number"
//  *         rooms:
//  *           type: array
//  *           items:
//  *             $ref: '#/components/schemas/Room'
//  *           description: "List of rooms in the floor"
//  *
//  *     Room:
//  *       type: object
//  *       required:
//  *         - name
//  *         - walls
//  *       properties:
//  *         name:
//  *           type: string
//  *           description: "Room name"
//  *         walls:
//  *           type: array
//  *           items:
//  *             $ref: '#/components/schemas/Wall'
//  *           description: "List of walls in the room"
//  *
//  *     Wall:
//  *       type: object
//  *       required:
//  *         - wallName
//  *         - wallType
//  *         - length
//  *         - height
//  *       properties:
//  *         wallName:
//  *           type: string
//  *           enum: ["North", "South", "East", "West", "NorthEast", "NorthWest", "SouthEast", "SouthWest"]
//  *           description: "The direction or name of the wall"
//  *         wallType:
//  *           type: string
//  *           enum: ["Internal", "External"]
//  *           description: "Type of wall (Internal/External)"
//  *         length:
//  *           type: number
//  *           description: "Length of the wall"
//  *         height:
//  *           type: number
//  *           description: "Height of the wall"
//  *         windows:
//  *           type: array
//  *           items:
//  *             $ref: '#/components/schemas/Window'
//  *           description: "List of windows in the wall"
//  *         doors:
//  *           type: array
//  *           items:
//  *             $ref: '#/components/schemas/Door'
//  *           description: "List of doors in the wall"
//  *         wallCustomizations:
//  *           type: array
//  *           items:
//  *             $ref: '#/components/schemas/WallCustomization'
//  *           description: "List of customizations on the wall (e.g., windows, doors, etc.)"
//  * 
//  *     Window:
//  *       type: object
//  *       required:
//  *         - width
//  *         - height
//  *         - unit
//  *       properties:
//  *         width:
//  *           type: number
//  *           description: "Width of the window"
//  *         height:
//  *           type: number
//  *           description: "Height of the window"
//  *         sillHeight:
//  *           type: number
//  *           description: "Height from the floor to the bottom of the window sill"
//  *         unit:
//  *           type: string
//  *           enum: ["cm", "mm", "inches", "feet", "m"]
//  *           description: "Unit of measurement for window dimensions"
//  * 
//  *     Door:
//  *       type: object
//  *       required:
//  *         - width
//  *         - height
//  *       properties:
//  *         width:
//  *           type: number
//  *           description: "Width of the door"
//  *         height:
//  *           type: number
//  *           description: "Height of the door"
//  * 
//  *     WallCustomization:
//  *       type: object
//  *       required:
//  *         - type
//  *         - description
//  *         - measurements
//  *       properties:
//  *         type:
//  *           type: string
//  *           description: "Type of customization (e.g., window, door)"
//  *         description:
//  *           type: string
//  *           description: "Description of the customization"
//  *         measurements:
//  *           type: object
//  *           properties:
//  *             length:
//  *               type: number
//  *               description: "Length of the customization"
//  *             width:
//  *               type: number
//  *               description: "Width of the customization"
//  *             height:
//  *               type: number
//  *               description: "Height of the customization"
//  * 
//  *     WallType:
//  *       type: object
//  *       required:
//  *         - type
//  *         - thickness
//  *       properties:
//  *         type:
//  *           type: string
//  *           enum: ["Internal", "External"]
//  *           description: "The type of wall"
//  *         thickness:
//  *           type: number
//  *           description: "Thickness of the wall in mm"
//  *         defaultThickness:
//  *           type: number
//  *           description: "Default thickness based on the type"
//  * 
//  *     Lead:
//  *       type: object
//  *       properties:
//  *         name:
//  *           type: string
//  *           description: "Name of the lead"
//  *         email:
//  *           type: string
//  *           description: "Email of the lead"
//  *         phone:
//  *           type: string
//  *           description: "Phone number of the lead"
//  * 
//  *     Project:
//  *       type: object
//  *       properties:
//  *         name:
//  *           type: string
//  *           description: "Name of the project"
//  *         description:
//  *           type: string
//  *           description: "Description of the project"
//  *         location:
//  *           type: string
//  *           description: "Location of the project"
//  */


// Swagger documentation for the Measurements schema

/**
 * @swagger
 * components:
 *   schemas:
 *     Measurements:
 *       type: object
 *       properties:
 *         projectId:
 *           type: string
 *         leadId:
 *           type: string
 *         users:
 *           type: array
 *           items:
 *             type: string
 *         totalFloors:
 *           type: number
 *         unit:
 *           type: string
 *           enum: [cm, mm, inches, feet, yard]
 *           default: cm
 *         floors:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Floor'
 *     Window:
 *       type: object
 *       properties:
 *         width:
 *           type: number
 *         height:
 *           type: number
 *         sillHeight:
 *           type: number
 *         unit:
 *           type: string
 *           enum: [cm, mm, inches, feet, yard]
 *           default: cm
 *         windowType:
 *           type: string
 *           enum: [Sliding, Casement, Fixed, French, Bay, Awning, Hopper, Jalousie, Louvered, Picture, Round, Transom, Garden, Skylight, Storm, Combination, Egress, Glass Block, Shutters]
 *         windowGranite:
 *           type: string
 *     Door:
 *       type: object
 *       properties:
 *         width:
 *           type: number
 *         height:
 *           type: number
 *         unit:
 *           type: string
 *           enum: [cm, mm, inches, feet, yard]
 *           default: cm
 *         doorType:
 *           type: string
 *           enum: [Sliding, Swing, Folding, Revolving, Flush, Panel, Louvered, French, Dutch, Pocket, Bypass, Barn]
 *     Lintel:
 *       type: object
 *       properties:
 *         height:
 *           type: number
 *         width:
 *           type: number
 *         thickness:
 *           type: number
 *         unit:
 *           type: string
 *           enum: [cm, mm, inches, feet, yard]
 *           default: cm
 *     WallCustomization:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *         description:
 *           type: string
 *         unit:
 *           type: string
 *           enum: [cm, mm, inches, feet, yard]
 *           default: cm
 *         measurements:
 *           type: object
 *           properties:
 *             length:
 *               type: number
 *             width:
 *               type: number
 *             height:
 *               type: number
 *     WallType:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [Internal, External]
 *         thickness:
 *           type: number
 *           default: 100
 *         unit:
 *           type: string
 *           enum: [cm, mm, inches, feet, yard]
 *           default: cm
 *     Wall:
 *       type: object
 *       properties:
 *         wallName:
 *           type: string
 *           enum: [North, South, East, West, NorthEast, NorthWest, SouthEast, SouthWest]
 *         wallType:
 *           $ref: '#/components/schemas/WallType'
 *         length:
 *           type: number
 *         height:
 *           type: number
 *         unit:
 *           type: string
 *           enum: [cm, mm, inches, feet, yard]
 *           default: cm
 *         windows:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Window'
 *         doors:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Door'
 *         lintels:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Lintel'
 *         wallCustomizations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WallCustomization'
 *         executionManagerComment:
 *           type: string
 *     Room:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         unit:
 *           type: string
 *           enum: [cm, mm, inches, feet, yard]
 *           default: cm
 *         walls:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Wall'
 *     Floor:
 *       type: object
 *       properties:
 *         floorNumber:
 *           type: number
 *         unit:
 *           type: string
 *           enum: [cm, mm, inches, feet, yard]
 *           default: cm
 *         rooms:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Room'
 */



/**
 * @swagger
 * components:
 *   schemas:
 *     Brick:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the brick.
 *         brickType:
 *           type: string
 *           description: The type of brick (e.g., Red Brick, Other Types).
 *         category:
 *           type: string
 *           description: The category of the brick (e.g., Modular, Non-Modular).
 *         dimensions:
 *           type: object
 *           properties:
 *             length:
 *               type: number
 *               description: The length of the brick in mm.
 *             width:
 *               type: number
 *               description: The width of the brick in mm.
 *             thickness:
 *               type: number
 *               description: The thickness of the brick in mm.
 *       example:
 *         id: "61e8f8f2d4d9f6001c2e0c42"
 *         serialNumber: 1
 *         brickType: "Red Brick"
 *         category: "Modular"
 *         dimensions:
 *           length: 200
 *           width: 100
 *           thickness: 100
 */
