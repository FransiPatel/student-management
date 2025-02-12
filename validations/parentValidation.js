const Validator = require("validatorjs");

const parentValidation = (data) => {
    const rules = {
        parentName: "required|string|min:3|max:50",
        parentEmail: "required|email",
        parentPhone: "required|string|regex:/^[0-9]{10}$/",
    };
    return new Validator(data, rules);
};

const updateParentValidation = (data) => {
    const rules = {
        parentName: "string|min:3|max:50",
        parentPhone: "string|regex:/^[0-9]{10}$/",
    };

    return new Validator(data, rules);
};

module.exports = { parentValidation, updateParentValidation };
