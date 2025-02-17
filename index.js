const express = require('express')
const app = express()
const port = 9840
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
// To parse JSON bodies
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const authMiddleware = require("./middlewares/auth_middleware");

// Swagger setup
var options = {

  customCss: '.swagger-ui .topbar { display: none }'
};
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, options));
app.use(express.json()); 

app.use(express.static(path.join(__dirname, 'public')));

const branchRoutes = require('./routes/branch_routes');
const userRoutes = require("./routes/user_route"); // Path to the user routes file

const roles = require('./routes/roles_route')

const leadRoutes = require("./routes/leads_routes");
const moduleRoutes = require("./routes/modules_routes");
const packageRoutes = require("./routes/package_routes");
const quotationRoutes = require("./routes/quotation_routes");
const paymentRoutes = require("./routes/payments_routes");
const designerRoutes = require("./routes/designer_routes");
const projectRoutes = require("./routes/project_route");
const measuremeent_routes = require("./routes/measurement_routes");
const desiginermeasuremeent_routes = require("./routes/desiginer_measurement_route");
const bricks_routes = require("./routes/bricks_routes");
const verndortypes_routes = require("./routes/vendortypes_route");
const verndor_routes = require("./routes/vendor_route");
const verndor_category = require("./routes/vendor_category");

//const measurementRoutes = require('./routes/measurment_routes/measurement_route');
//const floorRoutes = require('./routes/measurment_routes/floorRoutes');

app.use("/api", paymentRoutes);
app.use("/api", quotationRoutes);
app.use("/api", branchRoutes);
app.use("/api", moduleRoutes);
app.use("/api", packageRoutes);
app.use("/api", leadRoutes);
app.use("/api", designerRoutes);
app.use("/api/", projectRoutes);
app.use("/api/", measuremeent_routes);
app.use("/api/", desiginermeasuremeent_routes);
app.use("/api/", bricks_routes);
app.use("/api", verndortypes_routes);
app.use("/api", verndor_routes);
app.use("/api", verndor_category);
//app.use("/api/", measurementRoutes);
//app.use("/api/", floorRoutes);

   app.use("/api", userRoutes);
app.use('/api',roles)

app.get('/', (req, res) => res.send('Hello World!'))

mongoose.set('strictQuery', false);

mongoose.connect('mongodb+srv://vijay:5NtraJ5a85Ib1zzr@taskmanager.cnw2n.mongodb.net/cannan_space?retryWrites=true&w=majority', {

})
  .then(() => {
    console.log('Connected to MongoDB successfully');
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); 
 });