module.exports = (sequelize, Sequelize) => {
    const Invoice = sequelize.define("invoice", {
        customerId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'customers',
                key: 'id'
            }
        },
        jobTypeId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {           //Job Types hasMany invoices
                model: 'job_types',
                key: 'id'
            }
        },
        invStatusId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'invoice_statuses',
                key: 'id'
            }
        },
        inv_date: {
            allowNull: false,
            type: Sequelize.DATE
        },
        due_date: {
            type: Sequelize.DATE
        },
        service_name: {
            type: Sequelize.STRING
        },
        amount_due: {
            type: Sequelize.STRING
        }
    });

    return Invoice;
}