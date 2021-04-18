const { Sequelize } = require('sequelize');
const db = require("../models");
const Admin = db.admin;
const bcrypt = require('bcrypt');

exports.create = async(req, res) => {
    const {username} = req.body;
    const password = bcrypt.hashSync(req.body.password, 10);

    //Validate that the user already exits
    const alreadyExists = await Admin.findOne({where: {username} }).catch((err) => {
        console.log("Error: ", err);
    });

    if(alreadyExists) {
        return res.json({message: 'Admin with username already exists!' });
    }
    const newAdmin = new Admin({username, password});

    const savedAdmin = await newAdmin.save().catch((err) => {
        console.log("Error: ", err);
        res.json({ error: "Cannot register admin user at the moment"})
    })

    if(savedAdmin) res.json({ message: 'Thanks for registering'});

};

exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    
    Admin.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Estimate Notes!."
            });
        });
};

exports.login = async(req, res) => {
    const {username, password} = req.body;
    console.log(password)
    const matchUsername = await Admin.findOne({where: {username}}).catch((err) => {
        console.log("Error: ", err);
    })
    const validPassword = await bcrypt.compare(password, matchUsername.password);
    console.log(validPassword)

    if(!validPassword){
        return res.status(400).send("Invalid Password!")
    }

    if(validPassword){
        return res.header('username', username).send({
            username: username,
            status: 'login succesful!'
        })
    }

}