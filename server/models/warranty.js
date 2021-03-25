module.exports = (sequelize, Sequelize) => {
    const Warranty = sequelize.define("warranty", {
        invoiceId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'invoices',
                key: 'id'
            }
        },
        warr_exp_date: {
            type: Sequelize.DATE
        },
        warr_start_date: {
            type: Sequelize.DATE
        },
        description: {
            type: Sequelize.STRING
        }
    });
    return Warranty;
}