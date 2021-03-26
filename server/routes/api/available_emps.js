module.exports = app => {
    const available_emp = require("../../controller/available_emp");

    let router = require("express").Router();

    //Create a new Available Employee
    router.post("/add", available_emp.create);

    // Retrieve all Available Employees
    router.get("/", available_emp.findAll);

    app.use('/api/available-employees', router);
}