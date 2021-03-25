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
        service_name: {
            type: Sequelize.STRING
        },
        inv_date: {
            allowNull: false,
            type: Sequelize.DATE
        },
        due_date: {
            type: Sequelize.DATE
        },
        amount_due: {
            type: Sequelize.STRING
        }
    });

    return Invoice;
}