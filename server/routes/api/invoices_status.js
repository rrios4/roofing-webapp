module.exports = app => {
    const invoice_status = require("../../controller/invoice_status");

    let router = require("express").Router();

    //Create a new invoice status
    router.post("/add", invoice_status.create);

    //Retrieve all Job types
    router.get('/', invoice_status.findAll);

    app.use('/api/invoice-stat', router);

}