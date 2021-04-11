const { Sequelize } = require("sequelize");
const db = require("../models");
const customer = require("../models/customer");
const Customer = db.customers;

exports.create = (req, res) => {
    //Validate request
    if(!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    
    //Create a Customer
    const customer = {
        name: req.body.name,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode,
        phone_number: req.body.phone_number,
        email: req.body.email,
    }

    // Save Tutorial in the database 
    Customer.create(customer)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occured while creating the Customer!"
            });
        });
};

exports.findAll = (req, res) => {
    const name = req.query.name;
    const Op = Sequelize.Op;
    console.log(name);
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    
    Customer.findAll({ where: condition})
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

exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Customer.findByPk(id)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Customer with id=" + id
        });
      });
};

exports.delete = (req, res) => {
    const id = req.params.id;
    
    Customer.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Customer was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Customer with id=${id}. Maybe Customer was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Customer with id=" + id
        });
      });
};

// exports.findAllByName = (req, res) => {
//   const name = req.query.name;
//   let condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

//   Customer.findAll({ where: name })
//   .then(data => {
//     res.send(data);
//   })
//   .catch(err => {
//     res.status(500).send({
//       message: 
//         err.message || "Some error occured while retrieving Customers."
//     });
//   });
// };