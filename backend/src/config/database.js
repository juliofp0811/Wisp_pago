const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'wisp_pago_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.Customer = require('../models/Customer')(sequelize, Sequelize);
db.Subscription = require('../models/Subscription')(sequelize, Sequelize);
db.Invoice = require('../models/Invoice')(sequelize, Sequelize);
db.Payment = require('../models/Payment')(sequelize, Sequelize);
db.Report = require('../models/Report')(sequelize, Sequelize);

// Define associations
db.Customer.hasMany(db.Subscription, { foreignKey: 'customerId' });
db.Subscription.belongsTo(db.Customer);

db.Customer.hasMany(db.Invoice, { foreignKey: 'customerId' });
db.Invoice.belongsTo(db.Customer);

db.Invoice.hasMany(db.Payment, { foreignKey: 'invoiceId' });
db.Payment.belongsTo(db.Invoice);

module.exports = db;