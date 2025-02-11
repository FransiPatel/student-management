const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
    const User = sequelize.define("User", {
        id: { 
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: uuidv4,
        },
        email: { 
            type: DataTypes.STRING, 
            unique: true,  
            allowNull: false, 
            validate: { isEmail: true }
        },
        name: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        class: { type: DataTypes.STRING, allowNull: false },
        school: { type: DataTypes.STRING, defaultValue: "Our School" },
        profile_pic: { type: DataTypes.STRING },
        parentid: { 
            type: DataTypes.UUID,  
            allowNull: false,  
            references: { model: "Parents", key: "id" },
            onDelete: "CASCADE" 
        },
         isDeleted: { 
            type: DataTypes.BOOLEAN, 
            defaultValue: false, 
        },
    }, {
        tableName: "Users",  
        timestamps: true,     
    });

    User.associate = (models) => {
        User.belongsTo(models.Parent, { foreignKey: "parentid", as: "Parent", onDelete: "CASCADE" });
    };

    return User;
};
