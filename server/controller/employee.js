const db = require('../models');
const { Sequelize } = require("sequelize");
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
        phone_number: req.body.phone_number
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
    const Op = Sequelize.Op;
    var condition = name ? { emp_name: { [Op.like]: `%${name}%` } } : null;
    console.log(name)
    
    Employee.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving employees."
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Employee.findByPk(id)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Employee with id=" + id
        });
      });
};

exports.delete = (req, res) => {
    const id = req.params.id;
    
    Employee.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Employee was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Employee with id=${id}. Maybe Customer was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Employee with id=" + id
        });
      });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Employee.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Employees was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update employees with id=${id}. Maybe customer was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating employees with id=" + id
      });
    });
};
