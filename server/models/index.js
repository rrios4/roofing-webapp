const dbConfig = require('../config/db.config.js');

const Sequelize = require('sequelize');
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
db.estimates = require("./estimate")(sequelize, Sequelize);
db.et_status = require("./et_status")(sequelize, Sequelize);
db.material_lines = require("./material_line")(sequelize, Sequelize);
db.job_schedules = require("./job_schedule")(sequelize, Sequelize);
db.job_status = require("./job_status")(sequelize, Sequelize);
db.emp_status = require("./emp_status")(sequelize, Sequelize);
db.et_notes = require('./et_note')(sequelize, Sequelize);
db.available_emps = require('./available_emp')(sequelize, Sequelize);

//Relationshops
// job_type.hasMany(invoice); // set one to many relationship
// customer.hasMany(invoice);
// invoice_status.hasMany(invoice);

module.exports = db;