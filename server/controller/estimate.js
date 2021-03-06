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
    
    Estimate.findAll({ include: ['cu', 'ets'], order: [['etStatusId', 'ASC']]})
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

exports.findEstimateById = (req, res) => {
    const id = req.params.id;

    Estimate.findByPk(id, {include: ['cu', 'ets']})
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving Estimate with id=" + id
        })
    })
}

exports.delete = (req, res) => {
    const id = req.params.id;
    
    Estimate.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Estimate was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Estimate with id=${id}. Maybe Estimate was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Estimate with id=" + id
        });
      });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Estimate.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Estimate was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update estimate with id=${id}. Maybe estimate was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating estimate with id=" + id
      });
    });
};