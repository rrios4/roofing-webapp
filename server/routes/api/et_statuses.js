module.exports = app => {
    const et_status = require("../../controller/et_status");

    let router = require("express").Router();

    //Create a new estimate status
    router.post("/add", et_status.create);

    //Retrieve all estimate statuses
    router.get('/', et_status.findAll);
    
    //api url route
    app.use('/api/et-status', router);

}