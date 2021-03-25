module.exports = (sequelize, Sequelize) => {
    const Estimate = sequelize.define("estimate", {
        etStatusId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: 'et_statuses',
                key: 'id'
            }
        },
        customerId: {
            allowNull:false,
            type: Sequelize.INTEGER,
            references: {
                model: 'customers',
                key: 'id'
            }
        },
        estimate_date: {
            allowNull: false,
            type: Sequelize.DATE
        },
        exp_date: {
            type: Sequelize.DATE
        },
        sqft_measurement: {
            allowNull: false,
            type: Sequelize.STRING
        },
        service_name: {
            type: Sequelize.STRING
        },
        price: {
            type: Sequelize.STRING
        },
        quote_price: {
            allowNull: false,
            type: Sequelize.STRING
        }
    });
    return Estimate ;
}