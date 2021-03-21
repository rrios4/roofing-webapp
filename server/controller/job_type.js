const db = require("../models");
const Job_Type = db.job_types;

exports.create = (req, res) => {
    //Validate request
    if(!req.body.type_name) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
        return
    };

    //Create a Warranty
    const job_type = {
        type_name: req.body.type_name,
        description: req.body.description,
    };

    //Save warranty 
    Job_Type.create(job_type)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occured creating Job_Type info!"
            });
        });
};

exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    
    Job_Type.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Job types!."
            });
        });
};