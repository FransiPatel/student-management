const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
    const ClassSubject = sequelize.define("ClassSubject", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: uuidv4,
        },
        className: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        subjectId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "Subject", key: "subjectId" },
            onDelete: "CASCADE",
        },
    }, {
        tableName: "ClassSubject",
        timestamps: true,
    });

    ClassSubject.associate = (models) => {
        ClassSubject.belongsTo(models.Subject, { foreignKey: "subjectId", as: "Subject", onDelete: "CASCADE" });
    };

    return ClassSubject;
};
