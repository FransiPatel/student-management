const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
    const StudentGrades = sequelize.define("StudentGrades", {
        gradeId: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: uuidv4,
        },
        studentId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "Student", key: "id" },
            onDelete: "CASCADE",
        },
        subjectId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "Subject", key: "subjectId" },
            onDelete: "CASCADE",
        },
        marks: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        grade: {
            type: DataTypes.STRING, 
            allowNull: true, 
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        tableName: "StudentGrade",
        timestamps: true, 
    });

    StudentGrades.associate = (models) => {
        StudentGrades.belongsTo(models.Student, { foreignKey: "studentId", as: "Student", onDelete: "CASCADE" });
        StudentGrades.belongsTo(models.Subject, { foreignKey: "subjectId", as: "Subject", onDelete: "CASCADE" });
    };

    return StudentGrades;
};
