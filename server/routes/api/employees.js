module.exports = app => {
    const employees = require("../../controller/employee");

    let router = require("express").Router();

    //Create a new Employee
    router.post("/add", employees.create);

    //Retrieve all Employees
    router.get('/', employees.findAll);

    app.use('/api/employees', router)

}