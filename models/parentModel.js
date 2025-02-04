const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("Parent", {
        parentname: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
        email: { type: DataTypes.STRING, unique: true, allowNull: false,
            validate: { isEmail: true }
        },
        phone: { type: DataTypes.STRING, allowNull: false },
        address: { type: DataTypes.STRING, allowNull: true }
    });
};
