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
const Subject = require("./Subject")(sequelize);
const StudentGrades = require("./StudentGrade")(sequelize);
const ClassSubject = require("./ClassSubject")(sequelize);

// Define Associations (Handled inside models, no need to define here)
const models = { Student, Parent, Subject, StudentGrades, ClassSubject };

// Initialize associations
Object.values(models).forEach((model) => {
    if (model.associate) {
        model.associate(models);
    }
});

// Export models
module.exports = { sequelize, ...models };
