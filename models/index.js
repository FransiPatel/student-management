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
const Student = require("./Student")(sequelize);
const Parent = require("./Parent")(sequelize);

// Define Associations
Student.belongsTo(Parent, { foreignKey: "parentId", as: "Parent", onDelete: "CASCADE" });
Parent.hasMany(Student, { foreignKey: "parentId", as: "Students", onDelete: "CASCADE" });

module.exports = { sequelize, Student, Parent };