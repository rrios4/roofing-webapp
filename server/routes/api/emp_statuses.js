module.exports = app => {
    const emp_status = require("../../controller/emp_status");

    let router = require("express").Router();

    //Create a new estimate status
    router.post("/add", emp_status.create);

    //Retrieve all estimate statuses
    router.get('/', emp_status.findAll);
    
    //api url route
    app.use('/api/emp-status', router);

}