module.exports = app => {
    const job_schedule = require("../../controller/job_schedule");

    let router = require("express").Router();

    //Create a new estimate status
    router.post("/add", job_schedule.create);

    //Retrieve all estimate statuses
    router.get('/', job_schedule.findAll);
    
    //api url route
    app.use('/api/job-schedules', router);

}