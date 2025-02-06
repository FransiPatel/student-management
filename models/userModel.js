const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const User = sequelize.define("User", {
        id: { // New id column as primary key
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: { 
            type: DataTypes.STRING, 
            unique: true,  // Email should still be unique, but it's not the primary key
            allowNull: false, 
            validate: { isEmail: true }
        },
        name: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        class: { type: DataTypes.STRING, allowNull: false },
        school: { type: DataTypes.STRING, defaultValue: "Our School" },
        profile_pic: { type: DataTypes.STRING },
        parentid: { 
            type: DataTypes.STRING, 
            allowNull: false,
            references: { model: "Parents", key: "id" },
            onDelete: "SET NULL"
        }
    });

    User.associate = (models) => {
        User.belongsTo(models.Parent, { foreignKey: "parentid", as: "Parents", onDelete: "SET NULL" });
    };

    return User;
};
