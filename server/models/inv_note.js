module.exports = (sequelize, Sequelize) => {
    const Inv_Note = sequelize.define("inv_note", {
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