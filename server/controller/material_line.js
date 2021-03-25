const db = require("../models");
const Material_Line = db.material_lines;

exports.create = (req, res) => {
    //Validate request
    if(!req.body.estimateId) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
        return
    };

    //Create a Warranty
    const material_line = {
        estimateId: req.body.estimateId,
        materialId: req.body.materialId,
        qty: req.body.qty
    };

    //Save warranty 
    Material_Line.create(material_line)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occured creating Material Line info!"
            });
        });
};

exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    
    Material_Line.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Material Lines!."
            });
        });
};