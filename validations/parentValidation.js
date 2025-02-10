const Validator = require("validatorjs");

const parentValidation = (data) => {
    const rules = {
        parentname: "required|string|min:3|max:50",
        parentemail: "required|email",
        phone: "required|string|regex:/^[0-9]{10}$/",
    };

    const messages = {
        "required.parentname": "Parent name is required",
        "string.parentname": "Parent name must be a string",
        "min.parentname": "Parent name must be at least 3 characters",
        "max.parentname": "Parent name cannot exceed 50 characters",

        "required.parentemail": "Parent email is required",
        "email.parentemail": "Invalid email format",

        "required.phone": "Phone number is required",
        "string.phone": "Phone number must be a string",
        "regex.phone": "Phone number must be exactly 10 digits",
    };

    return new Validator(data, rules, messages);
};

const updateParentValidation = (data) => {
    const rules = {
        parentname: "string|min:3|max:50",
        phone: "string|regex:/^[0-9]{10}$/",
    };

    const messages = {
        "string.parentname": "Parent name must be a string",
        "min.parentname": "Parent name must be at least 3 characters",
        "max.parentname": "Parent name cannot exceed 50 characters",

        "string.phone": "Phone number must be a string",
        "regex.phone": "Phone number must be exactly 10 digits",
    };

    return new Validator(data, rules, messages);
};

module.exports = { parentValidation, updateParentValidation };
