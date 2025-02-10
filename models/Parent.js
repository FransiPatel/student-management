const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
    const Parent = sequelize.define("Parent", {
        id: { 
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: uuidv4,
        },
        parentname: { type: DataTypes.STRING, allowNull: false },
        parentemail: { 
            type: DataTypes.STRING, 
            unique: true,  
            allowNull: false, 
            validate: { isEmail: true }
        },
        phone: { type: DataTypes.STRING, allowNull: false },

        // Soft Delete Flag
        isDeleted: { 
            type: DataTypes.BOOLEAN, 
            defaultValue: false, 
        },

    }, {
        tableName: "Parents",
        timestamps: true,  
    });

    Parent.associate = (models) => {
        Parent.hasMany(models.User, { foreignKey: "parentid", as: "Users", onDelete: "CASCADE" });
    };

    return Parent;
};
