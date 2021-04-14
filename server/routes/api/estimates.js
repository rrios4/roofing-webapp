module.exports = app => {
    const estimates = require("../../controller/estimate");

    let router = require("express").Router();

    //Create a new estimate
    router.post("/add", estimates.create);

    //Retrieve all estimates
    router.get('/', estimates.findAll);

    // Retrieve estimate by id
    router.get('/:id', estimates.findEstimateById);
    
    //api url route
    app.use('/api/estimates', router);

}