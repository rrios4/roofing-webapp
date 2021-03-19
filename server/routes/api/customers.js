module.exports = app => {
    const customers = require("../../controller/customer");

    let router = require("express").Router();

    //Create a new Customer
    router.post("/add", customers.create);

    // Retrieve all Customers
    router.get("/", customers.findAll);

    app.use('/api/customers', router);
}