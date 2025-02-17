const Validator = require("validatorjs");

const addSubjectValidation = (data) => {
    const rules = {
        subjectName: "required|string|min:3|max:50"
    };
    return new Validator(data, rules);
};

const updateSubjectValidation = (data) => {
    const rules = {
        subjectName: "required|string|min:3|max:50"
    };
    return new Validator(data, rules);
};

const assignSubjectsValidation = (data) => {
    const rules = {
        className: "required|string|min:2|max:20",
        subjectIds: "required|array|min:1"
    };
    return new Validator(data, rules);
};

module.exports = {
    addSubjectValidation,
    updateSubjectValidation,
    assignSubjectsValidation
};
