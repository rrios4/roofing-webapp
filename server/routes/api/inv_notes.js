module.exports = app => {
    const inv_note = require("../../controller/inv_note");

    let router = require("express").Router();

    //Create a new invoice status
    router.post("/add", inv_note.create);

    //Retrieve all Job types
    router.get('/', inv_note.findAll);

    app.use('/api/inv-notes', router);

}