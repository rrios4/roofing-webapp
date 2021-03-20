module.exports = (sequelize, Sequelize) => {
    const Material = sequelize.define("material", {
        material_name: {
            type: Sequelize.STRING
        },
        brand: {
            type: Sequelize.STRING
        },
        model: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING
        },
        color: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        }

    });

    return Material;
};