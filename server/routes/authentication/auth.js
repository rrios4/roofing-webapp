module.exports = app => {
    const admins = require("../../controller/admin");

    let router = require("express").Router();

    //Create a new Customer
    router.post("/register", admins.create);

    //Login with admin account
    router.post('/login', admins.login);

    // // Retrieve all Customers
    // router.get("/", customers.findAll);

    // // Retrieve Customer by Id
    // router.get("/:id", customers.findOne);

    // // Delete Customer by Id
    // router.delete('/:id', customers.delete);

    // // Update customer info
    // router.put('/:id', customers.update);

    app.use('/api/auth', router);
}