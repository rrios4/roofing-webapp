const db = require("../models");
const Available_Emp = db.available_emps;

exports.create = (req, res) => {
    //Validate request
    if(!req.body.status) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
        return
    };

    //Create a Employee Status
    const available_emp = {
        empId: req.body.empId,
        job_scheduleId: req.body.job_scheduleId,
        status: req.body.status,
    };

    //Save Job Status 
    Available_Emp.create(available_emp)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occured creating Available Employee info!"
            });
        });
};

exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    
    Available_Emp.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Available Employees!."
            });
        });
};