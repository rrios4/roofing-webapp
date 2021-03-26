const db = require("../models");
const Emp_Status = db.job_status;

exports.create = (req, res) => {
    //Validate request
    if(!req.body.status_name) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
        return
    };

    //Create a Employee Status
    const emp_status = {
        status_name: req.body.status_name,
        description: req.body.description,
    };

    //Save Job Status 
    Emp_Status.create(emp_status)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occured creating Employee Status info!"
            });
        });
};

exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    
    Emp_Status.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Employee Status!."
            });
        });
};