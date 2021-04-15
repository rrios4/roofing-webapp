const db = require("../models");
const Invoice = db.invoices;

exports.create = (req, res) => {
    //Validate request
    if(!req.body.service_name) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
        return
    };

    //Create a invoice
    const invoice = {
        customerId: req.body.customerId,
        jobTypeId: req.body.jobTypeId,
        invStatusId: req.body.invStatusId,
        service_name: req.body.service_name,
        inv_date: req.body.inv_date,
        due_date: req.body.due_date,
        amount_due: req.body.amount_due
    };

    //Save warranty 
    Invoice.create(invoice)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occured creating Invoice info!"
            });
        });
};

exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    
    Invoice.findAll({ include: ['cu', 'jtype', 'invs'],})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Invoices!."
            });
        });
};

exports.findInvoiceById = (req, res) => {
    const id = req.params.id;

    Invoice.findByPk(id, {include: ['cu', 'jtype', 'invs']})
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving Invoice with id=" + id
        })
    })
}

exports.delete = (req, res) => {
    const id = req.params.id;
    
    Invoice.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Invoice was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Invoice with id=${id}. Maybe Customer was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Invoice with id=" + id
        });
      });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Invoice.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Tutorial was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id
      });
    });
};