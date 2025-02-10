const Validator = require("validatorjs");

const adminLoginValidation = (data) => {
    // Define validation rules
    const rules = {
        email: "required|email",
    };

    // Define custom error messages
    const messages = {
        "required.email": "Email is required",
        "email.email": "Invalid email format",
    };

    // Perform validation
    const validation = new Validator(data, rules, messages);
    return validation;
};

module.exports = { adminLoginValidation };
