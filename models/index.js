const { Sequelize } = require("sequelize");
require("dotenv").config();

// Initialize Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        logging: false,
    }
);

// Import models
const User = require("./userModel")(sequelize);
const Parent = require("./parentModel")(sequelize);

// Define Associations
User.belongsTo(Parent, { foreignKey: "parentid", as: "Parents", onDelete: "SET NULL" });
Parent.hasMany(User, { foreignKey: "parentid", as: "Users" });

module.exports = { sequelize, User, Parent };
