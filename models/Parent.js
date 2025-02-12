const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
    const Parent = sequelize.define("Parent", {
        parentId: { 
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: uuidv4,
        },
        parentName: { type: DataTypes.STRING, allowNull: false },
        parentEmail: { 
            type: DataTypes.STRING, 
            allowNull: false, 
            validate: { isEmail: true }
        },
        parentPhone: { type: DataTypes.STRING, allowNull: false },

        // Soft Delete Flag
        isDeleted: { 
            type: DataTypes.BOOLEAN, 
            defaultValue: false, 
        },

    }, {
        tableName: "Parent",
        timestamps: true,  
    });

    Parent.associate = (models) => {
        Parent.hasMany(models.Student, { foreignKey: "parentId", as: "Students", onDelete: "CASCADE" });
    };

    return Parent;
};
