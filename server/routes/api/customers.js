module.exports = app => {
    const customers = require("../../controller/customer");

    let router = require("express").Router();

    //Create a new Customer
    router.post("/add", customers.create);

    // Retrieve all Customers
    router.get("/", customers.findAll);

    // Retrieve Customer by Id
    router.get("/:id", customers.findOne);

    // Delete Customer by Id
    router.delete('/:id', customers.delete);

    // Retrieve all customers by name
    // router.get("/?name=", customers.findAllByName);

    app.use('/api/customers', router);
}