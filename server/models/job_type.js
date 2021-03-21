module.exports = (sequelize, Sequelize) => {
    const Job_Type = sequelize.define("job_type", {
        type_name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        }
    });
    return Job_Type;
}