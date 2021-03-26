module.exports = app => {
    const job_status = require("../../controller/job_status");

    let router = require("express").Router();

    //Create a new estimate status
    router.post("/add", job_status.create);

    //Retrieve all estimate statuses
    router.get('/', job_status.findAll);
    
    //api url route
    app.use('/api/job-statuses', router);

}