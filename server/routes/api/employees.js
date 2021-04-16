module.exports = app => {
    const employees = require("../../controller/employee");

    let router = require("express").Router();

    //Create a new Employee
    router.post("/add", employees.create);

    //Retrieve all Employees
    router.get('/', employees.findAll);

    //Find employee by id
    router.get('/:id', employees.findOne)

    //Delete employee by id
    router.delete('/:id', employees.delete);
    
    // Update customer info
    router.put('/:id', employees.update);

    app.use('/api/employees', router)

}