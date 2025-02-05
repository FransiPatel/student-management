const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const User = sequelize.define("User", {
        email: { 
            type: DataTypes.STRING, 
            primaryKey: true, 
            allowNull: false, 
            validate: { isEmail: true } 
        },
        name: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        class: { type: DataTypes.STRING, allowNull: false },
        school: { type: DataTypes.STRING, defaultValue: "Our School" },
        profile_pic: { type: DataTypes.STRING },
        parentemail: { 
            type: DataTypes.STRING, 
            allowNull: false,
            references: { model: "Parents", key: "parentemail" },
            onDelete: "SET NULL"
        }
    });

    User.associate = (models) => {
        User.belongsTo(models.Parent, { foreignKey: "parentemail", as: "Parents", onDelete: "SET NULL" });
    };

    return User;
};
