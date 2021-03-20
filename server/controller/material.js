const db = require("../models");
const Material = db.materials;

exports.create = (req, res) => {
    //Validate request
    if(!req.body.material_name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    
    //Create a Material
    const material = {
        material_name: req.body.material_name,
        brand: req.body.brand,
        model: req.body.model,
        type: req.body.type,
        color: req.body.color,
        description: req.body.description,
    }

    // Save Material in the database 
    Material.create(material)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occured while creating the Material!"
            });
        });
};

exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    
    Material.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving materials."
            });
        });
};