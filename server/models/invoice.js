module.exports = (sequelize, Sequelize) => {
    const Invoice = sequelize.define("invoice", {
        // customerId: {
        //     type: Sequelize.INTEGER,
        //     references: 'customers', //looks for table name not object
        //     referencesKey: 'id' //column name with in the customer table
        // },
        // jobTypeId: {
        //     type: Sequelize.INTEGER,
        //     references: 'job_types',
        //     referencesKey: 'id'
        // },
        // invStatusId: {
        //     type: Sequelize.INTEGER,
        //     references: 'invoice_statuses',
        //     referencesKey: 'id'
        // },
        service_name: {
            type: Sequelize.STRING
        },
        inv_date: {
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