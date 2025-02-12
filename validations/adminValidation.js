const Validator = require("validatorjs");

const adminLoginValidation = (data) => {
    // Define validation rules
    const rules = {
        email: "required|email",
    };
    // Perform validation
    const validation = new Validator(data, rules);
    return validation;
};

module.exports = { adminLoginValidation };
