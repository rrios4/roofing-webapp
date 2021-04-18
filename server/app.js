const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
//const mysql = require('mysql');
//const fs = require('fs');


//init the express app
const app = express()
let corsOptions = {
    origin: "http://localhost:3000"
};

//init sequilize models
const db = require('./models');
db.sequelize.sync(/*{ force: true }).then(() => { console.log("Drop and re-sync db.");}*/);

//Connection to mysql db
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'password',
//     database: 'roofing_db',
//     // ssl: {
//     //     ca   : fs.readFileSync('./ssl/server-ca.pem'), // should be enough for AWS
//     //     key  : fs.readFileSync('./ssl/client-key.pem'), // required for google mysql cloud db
//     //     cert : fs.readFileSync('./ssl/client-cert.pem'), // required for google mysql cloud db
//     // }
// });

// db.connect(function(err) {
//     if(err) throw err;
//     console.log('Connected to mysql!');
// })

//Middleware
app.use(cors(corsOptions));
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
app.get("/", (req, res) => {
 res.json({ message: "Welcome to Rios Roofing Web App Backend!"})
});
require("./routes/api/customers")(app);
require("./routes/api/employees")(app);
require("./routes/api/materials")(app);
require("./routes/api/warranties")(app);
require("./routes/api/job_type")(app);
require("./routes/api/invoices_status")(app);
require("./routes/api/inv_notes")(app);
require("./routes/api/invoices")(app);
require("./routes/api/estimates")(app);
require("./routes/api/et_statuses")(app);
require("./routes/api/material_lines")(app);
require("./routes/api/job_schedule")(app);
require("./routes/api/job_statuses")(app);
require("./routes/api/et_notes")(app);
require("./routes/api/emp_statuses")(app);
require("./routes/api/available_emps")(app);
require("./routes/authentication/auth")(app);

//Error handling middleware
// app.use(function(err, request, response, next) {
//     //console.log(err);
//     response.status(442).send({error: err.message});
// });

//Handle for production

//Litsen for port
const port = process.env.PORT || 8081;
app.listen(port,() => console.log(`Server started on port ${port}`));
