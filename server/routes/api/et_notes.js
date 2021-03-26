module.exports = app => {
    const et_note = require("../../controller/et_note");

    let router = require("express").Router();

    //Create a new invoice status
    router.post("/add", et_note.create);

    //Retrieve all Job types
    router.get('/', et_note.findAll);

    app.use('/api/et-notes', router);

}