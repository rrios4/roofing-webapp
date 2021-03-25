module.exports = app => {
    const material_line = require("../../controller/material_line");

    let router = require("express").Router();

    //Create a new estimate status
    router.post("/add", material_line.create);

    //Retrieve all estimate statuses
    router.get('/', material_line.findAll);
    
    //api url route
    app.use('/api/material-lines', router);

}