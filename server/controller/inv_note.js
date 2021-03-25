const db = require("../models");
const Inv_Note = db.inv_notes;

exports.create = (req, res) => {
    //Validate request
    if(!req.body.note_title) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
        return
    };

    //Create a Invoice Note
    const inv_note = {
        invoiceId: req.body.invoiceId,
        note_title: req.body.note_title,
        subject: req.body.subject,
        description: req.body.description,
    };

    //Save Invoice Status 
    Inv_Note.create(inv_note)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occured creating Invoice Note!"
            });
        });
};

exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    
    Inv_Note.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Invoice Notes!."
            });
        });
};