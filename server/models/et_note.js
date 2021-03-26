module.exports = (sequelize, Sequelize) => {
    const Et_Note = sequelize.define("et_note", {
        estimateId: {
            type: Sequelize.INTEGER,
            references: {
                allowNull: false,
                model: 'estimates',
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
    return Et_Note;
}