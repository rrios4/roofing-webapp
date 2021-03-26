module.exports = (sequelize, Sequelize) => {
    const Job_Schedule = sequelize.define("job_schedule", {
        estimateId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            referenses: {
                model: 'estimates',
                key: 'id'
            }
        },
        jobStatId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            referenses: {
                model: 'job_statuses',
                key: 'id'
            }
        },
        start_date: {
            allowNull: false,
            type: Sequelize.DATE
        },
        end_date:{
            type: Sequelize.DATE
        },
        et_duration:{
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        }
    });
    return Job_Schedule;
}