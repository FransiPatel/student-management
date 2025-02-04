const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const User =  sequelize.define("User", {
        email: { type: DataTypes.STRING, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        class: { type: DataTypes.STRING, allowNull: false },
        school: { type: DataTypes.STRING, defaultValue: "Our School" },
        profile_pic: { type: DataTypes.STRING },
        parentname: { 
            type: DataTypes.STRING, 
            allowNull: false, 
            references: { model: "Parents", key: "parentname" },
            onDelete: "CASCADE" 
        }
    });

    User.associate = (models) => {
        User.belongsTo(models.Parent, { foreignKey: "parentname", onDelete: "CASCADE" });
      };

    return User;
};
