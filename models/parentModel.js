const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Parent = sequelize.define("Parent", {
        parentname: { type: DataTypes.STRING, allowNull: false },
        parentemail: { type: DataTypes.STRING, primaryKey: true, allowNull: false, validate: { isEmail: true }},
        phone: { type: DataTypes.STRING, allowNull: false },
    });

    Parent.associate = (models) => {
        Parent.hasMany(models.User, { foreignKey: "parentemail", as: "Users" });
    };

    return Parent;
};
