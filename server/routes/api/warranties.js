module.exports = app => {
    const warranties = require("../../controller/warranty");

    let router = require("express").Router();

    //Create a new Warranty
    router.post("/add", warranties.create);

    //Retrieve all Warramty
    router.get('/', warranties.findAll);

    app.use('/api/warranties', router);

}