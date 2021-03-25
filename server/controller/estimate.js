const db = require("../models");
const Estimate = db.estimates;

exports.create = (req, res) => {
    //Validate request
    if(!req.body.estimate_date) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
        return
    };

    //Create a estimate
    const estimate = {
        etStatusId: req.body.etStatusId,
        customerId: req.body.customerId,
        estimate_date: req.body.estimate_date,
        exp_date: req.body.exp_date,
        sqft_measurement: req.body.sqft_measurement,
        service_name: req.body.service_name,
        price: req.body.price,
        quote_price: req.body.quote_price
    };

    //Save estimate
    Estimate.create(estimate)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occured creating Estimate info!"
            });
        });
};

exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    
    Estimate.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Estimates!."
            });
        });
};