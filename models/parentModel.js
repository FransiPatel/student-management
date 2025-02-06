const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Parent = sequelize.define("Parent", {
        id: { 
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        parentname: { type: DataTypes.STRING, allowNull: false },
        parentemail: { 
            type: DataTypes.STRING, 
            unique: true,  // Email should still be unique, but it's not the primary key
            allowNull: false, 
            validate: { isEmail: true }
        },
        phone: { type: DataTypes.STRING, allowNull: false },
    });

    Parent.associate = (models) => {
        Parent.hasMany(models.User, { foreignKey: "parentid", as: "Users" });
    };

    return Parent;
};
