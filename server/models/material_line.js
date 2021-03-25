module.exports = (sequelize, Sequelize) => {
    const Material_Line = sequelize.define("material_line", {
        estimateId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: 'estimates',
                key: 'id'
            }
        },
        materialId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: 'materials',
                key: 'id'
            }
        },
        qty: {
            type: Sequelize.STRING
        },
    });

    return Material_Line;
};