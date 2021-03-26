module.exports = (sequelize, Sequelize) => {
    const Available_Emp = sequelize.define("available_emp", {
        empId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: 'employees',
                key: 'id'
            }
        },
        job_scheduleId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: 'job_schedules',
                key: 'id'
            }
        },
        status: {
            type: Sequelize.STRING
        }
    });
    return Available_Emp;
}