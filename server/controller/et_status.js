const db = require("../models");
const Et_Status = db.et_status;

exports.create = (req, res) => {
    //Validate request
    if(!req.body.status_name) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
        return
    };

    //Create a Estimate Status
    const et_status = {
        status_name: req.body.status_name,
        description: req.body.description,
    };

    //Save Estimate Status 
    Et_Status.create(et_status)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occured creating Estimate Status info!"
            });
        });
};

exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    
    Et_Status.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Estimate Statuses!."
            });
        });
};