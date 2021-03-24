module.exports = app => {
    const invoices = require("../../controller/invoice");

    let router = require("express").Router();

    //Create a new invoice status
    router.post("/add", invoices.create);

    //Retrieve all invoices
    router.get('/', invoices.findAll);
    
    //api url route
    app.use('/api/invoices', router);

}