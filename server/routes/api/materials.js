module.exports = app => {
    const materials = require("../../controller/material");

    let router = require("express").Router();

    //Create a new Employee
    router.post("/add", materials.create);

    //Retrieve all Employees
    router.get('/', materials.findAll);

    app.use('/api/materials', router);

}