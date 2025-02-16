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
        parentId: "required|string",
    };

    return new Validator(data, rules);
};

const updateUserValidation = (data) => {
    const rules = {
        email: "string|email",
        name: "string|min:3|max:50",
        class: "string|min:1|max:10",
        school: "string|max:100",
    };

    return new Validator(data, rules);
};
const validateLogin = (data) => {
    const rules = {
        email: "required|email",
        password: "required"
    };

    return new Validator(data, rules);
};

module.exports = { userValidation, updateUserValidation, validateLogin };
