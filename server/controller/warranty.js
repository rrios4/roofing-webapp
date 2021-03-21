const db = require("../models");
const Warranty = db.warranties;

exports.create = (req, res) => {
    //Validate request
    if(!req.body.warr_exp_date) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
        return
    };

    //Create a Warranty
    const warranty = {
        warr_exp_date: req.body.warr_exp_date,
        warr_start_date: req.body.warr_start_date,
        description: req.body.description
    };

    //Save warranty 
    Warranty.create(warranty)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occured creating Warranty info!"
            });
        });
};

exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    
    Warranty.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving warranties!."
            });
        });
};