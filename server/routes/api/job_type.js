module.exports = app => {
    const job_types = require("../../controller/job_type");

    let router = require("express").Router();

    //Create a new Job type
    router.post("/add", job_types.create);

    //Retrieve all Job types
    router.get('/', job_types.findAll);

    app.use('/api/job-types', router);

}