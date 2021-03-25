module.exports = (sequelize, Sequelize) => {
    const Inv_Note = sequelize.define("inv_note", {
        invoiceId: {
            type: Sequelize.INTEGER,
            references: {
                allowNull: false,
                model: 'invoices',
                key: 'id'
            }
        },
        note_title: {
            type: Sequelize.STRING
        },
        subject: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        }
    });
    return Inv_Note;
}