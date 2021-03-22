module.exports = (sequelize, Sequelize) => {
    const Invoice_Status = sequelize.define("invoice_status", {
        status_name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        }
    });
    return Invoice_Status;
}