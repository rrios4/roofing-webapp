module.exports = (sequelize, Sequelize) => {
    const Et_Status = sequelize.define("et_status", {
        status_name: {
            allowNull: false,
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        }
    });
    return Et_Status;
}