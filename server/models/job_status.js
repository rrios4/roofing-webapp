module.exports = (sequelize, Sequelize) => {
    const Job_Status = sequelize.define("job_status", {
        status_name: {
            allowNull: false,
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        }
    });
    return Job_Status;
}