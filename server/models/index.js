const dbConfig = require('../config/db.config.js');

const Sequelize = require('sequelize');
const invoice = require('./invoice');
const job_type = require('./job_type');
const customer = require('./customer');
const invoice_status = require('./invoice_status');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.customers = require("./customer")(sequelize, Sequelize);
db.employees = require("./employee")(sequelize, Sequelize);
db.materials = require("./material")(sequelize,Sequelize);
db.warranties = require("./warranty")(sequelize, Sequelize);
db.job_types = require("./job_type")(sequelize, Sequelize);
db.invoice_status = require("./invoice_status")(sequelize,Sequelize);
db.inv_notes = require("./inv_note")(sequelize, Sequelize);
db.invoices = require("./invoice")(sequelize, Sequelize);
//db.estimates = require("./estimate")(sequelize, Sequelize);


//Relationshops
// job_type.hasMany(invoice); // set one to many relationship
// customer.hasMany(invoice);
// invoice_status.hasMany(invoice);

module.exports = db;