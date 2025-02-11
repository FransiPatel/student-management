const Validator = require("validatorjs");

const userValidation = (data) => {
    const rules = {
        email: "required|email",
        name: "required|string|min:3|max:50",
        password: [
            "required",
            "string",
            "min:6",
            "regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$/"
        ],
        class: "required|string|min:1|max:10",
        school: "string|max:100",
        parentid: "required|string",
    };

    const messages = {
        "required.email": "Email is required",
        "email.email": "Invalid email format",

        "required.name": "Name is required",
        "string.name": "Name must be a string",
        "min.name": "Name must be at least 3 characters",
        "max.name": "Name cannot exceed 50 characters",

        "required.password": "Password is required",
        "string.password": "Password must be a string",
        "min.password": "Password must be at least 6 characters",
        "regex.password": "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",

        "required.class": "Class is required",
        "string.class": "Class must be a string",
        "min.class": "Class must have at least 1 character",
        "max.class": "Class cannot exceed 10 characters",

        "string.school": "School must be a string",
        "max.school": "School name cannot exceed 100 characters",

        "required.parentid": "Parent ID is required",
        "string.parentid": "Parent ID must be a string",
        "uuid.parentid": "Invalid Parent ID format",
    };

    return new Validator(data, rules, messages);
};

const updateUserValidation = (data) => {
    const rules = {
        name: "string|min:3|max:50",
        class: "string|min:1|max:10",
        school: "string|max:100",
    };

    const messages = {
        "string.name": "Name must be a string",
        "min.name": "Name must be at least 3 characters",
        "max.name": "Name cannot exceed 50 characters",

        "string.class": "Class must be a string",
        "min.class": "Class must have at least 1 character",
        "max.class": "Class cannot exceed 10 characters",

        "string.school": "School must be a string",
        "max.school": "School name cannot exceed 100 characters",

        "string.parentid": "Parent ID must be a string",
        "uuid.parentid": "Invalid Parent ID format",
    };

    return new Validator(data, rules, messages);
};
const validateLogin = (data) => {
    const rules = {
        email: "required|email",
        password: "required|min:6"
    };

    return new Validator(data, rules);
};

module.exports = { userValidation, updateUserValidation, validateLogin };
