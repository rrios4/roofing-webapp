const db = require('../models');
const Employee = db.employees;

exports.create = (req, res) => {
    //Validate request
    if(!req.body.emp_name) {
        res.status(400).send({
            message: "Content can not be empty!"
        })
        return;
    }

    //Create a Employee
    const employee = {
        emp_statusId: req.body.emp_statusId,
        emp_name: req.body.emp_name,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode,
        country: req.body.country,
        email: req.body.email,
        payrate: req.body.payrate,
    }

    //Save Employee in the database
    Employee.create(employee)
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occured creating Employee!"
            });
        });
};

exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    
    Employee.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving customers."
            });
        });
};

