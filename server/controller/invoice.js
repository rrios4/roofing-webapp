const db = require("../models");
const Invoice = db.invoices;

exports.create = (req, res) => {
    //Validate request
    if(!req.body.service_name) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
        return
    };

    //Create a invoice
    const invoice = {
        customerId: req.body.customerId,
        jobTypeId: req.body.jobTypeId,
        invStatusId: req.body.invStatusId,
        service_name: req.body.service_name,
        inv_date: req.body.inv_date,
        due_date: req.body.due_date,
        amount_due: req.body.amount_due
    };

    //Save warranty 
    Invoice.create(invoice)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occured creating Invoice info!"
            });
        });
};

exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    
    Invoice.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Invoices!."
            });
        });
};