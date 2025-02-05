const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("UserParent", {
        email: { type: DataTypes.STRING, allowNull: false },
        parentemail: { type: DataTypes.STRING, allowNull: false },
    });
};
