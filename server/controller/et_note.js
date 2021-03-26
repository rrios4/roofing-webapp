const db = require("../models");
const Et_Note = db.et_notes;

exports.create = (req, res) => {
    //Validate request
    if(!req.body.note_title) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
        return
    };

    //Create a Estimate Note
    const et_note = {
        estimateId: req.body.estimateId,
        note_title: req.body.note_title,
        subject: req.body.subject,
        description: req.body.description,
    };

    //Save Estimate Status 
    Et_Note.create(et_note)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occured creating Estimate Note!"
            });
        });
};

exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    
    Et_Note.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Estimate Notes!."
            });
        });
};