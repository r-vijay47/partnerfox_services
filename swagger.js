const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Partner Fox API",
      version: "1.0.0",
      description: "API documentation for managing users and roles in the application",
    },
    servers: [
      {
        url: "https://patnerfox-api.redmatter.tech/api",
        description: "Production",
      },
      {
        url: "http://localhost:9840/api",
        description: "Local server",
      },
    ],
    components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        "schemas": {

        "Road":{
          "type":"object",
          "properties":{
            "name": {
              "type": "string",
              "description": "The name of the branch"
            }

          }
        },
        "Branch": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "The name of the branch"
            }
          },
          "required": ["name"]
        },  
        }
     
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
  
  apis: ["./routes/*.js"], // Path to your route files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
