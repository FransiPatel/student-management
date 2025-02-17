const Validator = require("validatorjs");

const getStudentGradesValidation = (data) => {
    const rules = {
        className: "required|string",
    };
    return new Validator(data, rules);
};

const addStudentGradeValidation = (data) => {
    const rules = {
        studentId: "required|string",
        subjectId: "required|string",
        grade: "required|string|min:1|max:5",
        marks: "required|integer|min:0|max:100",
    };
    return new Validator(data, rules);
};

const updateStudentGradeValidation = (data) => {
    const rules = {
        grade: "required|string|min:1|max:5",
        marks: "required|integer|min:0|max:100",
    };
    return new Validator(data, rules);
};

module.exports = {
    getStudentGradesValidation,
    addStudentGradeValidation,
    updateStudentGradeValidation,
};
