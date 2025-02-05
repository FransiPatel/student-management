const { Sequelize, DataTypes } = require("sequelize");
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
        logging: false, // Disable SQL logging in console
    }
);

// Import models
const User = require("./userModel")(sequelize);
const Parent = require("./parentModel")(sequelize);

Parent.hasMany(User, {
    foreignKey: "parentemail",
    onDelete: "SET NULL"
});

User.belongsTo(Parent, {
    foreignKey: "parentemail",
    onDelete: "SET NULL"
});

module.exports = { sequelize, User, Parent };
