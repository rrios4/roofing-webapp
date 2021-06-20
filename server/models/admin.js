const bcrypt = require('bcryptjs')

module.exports = (sequelize, Sequelize) => {
    const Admin = sequelize.define("admin", {
        username: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: true
        },
        password: {
            allowNull: false,
            type: Sequelize.STRING
        }
    
    }, {
        instanceMethod: {
            generateHash(password) {
                return bcrypt.hash(password, bcrypt.genSaltSync(10));
            },
            validPassword(password) {
                return bcrypt.compare(password, this.password);
            }
        }
    });
    return Admin;
}