const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
    const Subject = sequelize.define("Subject", {
        subjectId: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: uuidv4,
        },
        subjectName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false, 
        },
    }, {
        tableName: "Subject",
        timestamps: true,
    });

    Subject.associate = (models) => {
        Subject.hasMany(models.StudentGrades, { foreignKey: "subjectId", as: "Grades", onDelete: "CASCADE" });
    };

    return Subject;
};
