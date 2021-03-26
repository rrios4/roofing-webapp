const db = require("../models");
const Job_Schedule = db.job_schedules;

exports.create = (req, res) => {
    //Validate request
    if(!req.body.estimateId) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
        return
    };

    //Create a Job Schedule
    const job_schedule = {
        estimateId: req.body.estimateId,
        jobStatId: req.body.jobStatId,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        et_duration: req.body.et_duration,
        description: req.body.description,
    };

    //Save Job Status 
    Job_Schedule.create(job_schedule)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occured creating Job Schedule info!"
            });
        });
};

exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    
    Job_Schedule.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Job Schedule!."
            });
        });
};