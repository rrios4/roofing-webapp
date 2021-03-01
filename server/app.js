const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mysql = require('mysql');
const fs = require('fs');


//init the express app
const app = express()

//Connection to mysql db
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'roofing_db',
    // ssl: {
    //     ca   : fs.readFileSync('./ssl/server-ca.pem'), // should be enough for AWS
    //     key  : fs.readFileSync('./ssl/client-key.pem'), // required for google mysql cloud db
    //     cert : fs.readFileSync('./ssl/client-cert.pem'), // required for google mysql cloud db
    // }
});

db.connect(function(err) {
    if(err) throw err;
    console.log('Connected to mysql!');
})

//Middleware
app.use(cors())
app.use(morgan('tiny'));
app.use(bodyParser.json())

//Routes
app.get('/', (req, res) => {
    res.send("Hello World");
})

//Error handling middleware
app.use(function(err, request, response, next) {
    //console.log(err);
    response.status(442).send({error: err.message});
});

//Handle for production
//Litsen for port
const port = process.env.PORT || 3001;
app.listen(port,() => console.log(`Server started on port ${port}`));
