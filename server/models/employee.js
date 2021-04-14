module.exports = (sequelize, Sequelize) => {
    const Employee = sequelize.define("employee", {
        emp_statusId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            reference: {
                model: 'employees',
                key: 'id'
            }
        },
        emp_name: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        city: {
            type: Sequelize.STRING
        },
        state: {
            type: Sequelize.STRING
        },
        zipcode: {
            type: Sequelize.STRING
        },
        country: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        phone_number: {
            type: Sequelize.STRING
        },
        payrate: {
            type: Sequelize.STRING
        }
    });

    return Employee;
}