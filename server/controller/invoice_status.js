const db = require("../models");
const Invoice_Status = db.invoice_status;

exports.create = (req, res) => {
    //Validate request
    if(!req.body.status_name) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
        return
    };

    //Create a Invoice Status
    const invoice_status = {
        status_name: req.body.status_name,
        description: req.body.description,
    };

    //Save Invoice Status 
    Invoice_Status.create(invoice_status)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occured creating Invoice Status info!"
            });
        });
};

exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    
    Invoice_Status.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Invoice_Status!."
            });
        });
};