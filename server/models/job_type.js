module.exports = (sequelize, Sequelize) => {
    const Job_Type = sequelize.define("job_type", {
        type_name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        }
    });
    // Job_Type.associate = function(models){
    //     Job_Type.hasMany(models.invoice)
    // }
    return Job_Type;
}