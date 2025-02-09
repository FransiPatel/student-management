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
const User = require("./User")(sequelize);
const Parent = require("./Parent")(sequelize);

// Define Associations
User.belongsTo(Parent, { foreignKey: "parentid", as: "Parent", onDelete: "CASCADE" });
Parent.hasMany(User, { foreignKey: "parentid", as: "Users", onDelete: "CASCADE" });

module.exports = { sequelize, User, Parent };