module.exports = app => {
    const estimates = require("../../controller/estimate");

    let router = require("express").Router();

    //Create a new invoice status
    router.post("/add", estimates.create);

    //Retrieve all invoices
    router.get('/', estimates.findAll);
    
    //api url route
    app.use('/api/estimates', router);

}