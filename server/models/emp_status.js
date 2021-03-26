module.exports = (sequelize, Sequelize) => {
    const Emp_Status = sequelize.define("emp_status", {
        status_name: {
            allowNull: false,
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        }
    });
    return Emp_Status;
}