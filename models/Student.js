const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
    const Student = sequelize.define("Student", {
        id: { 
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: uuidv4,
        },
        email: { 
            type: DataTypes.STRING, 
            allowNull: false, 
            validate: { isEmail: true }
        },
        name: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        class: { type: DataTypes.STRING, allowNull: false },
        school: { type: DataTypes.STRING, defaultValue: "Our School" },
        profilePic: { type: DataTypes.STRING },
        parentId: { 
            type: DataTypes.UUID,  
            allowNull: false,  
            references: { model: "Parent", key: "parentId" },
            onDelete: "CASCADE" 
        },
         isDeleted: { 
            type: DataTypes.BOOLEAN, 
            defaultValue: false, 
        },
    }, {
        tableName: "Student",  
        timestamps: true,     
    });

    Student.associate = (models) => {
        Student.belongsTo(models.Parent, { foreignKey: "parentId", as: "Parent", onDelete: "CASCADE" });
    };

    return Student;
};
