const { Subject, Student, sequelize } = require("../../models/index");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const { addSubjectValidation, updateSubjectValidation, assignSubjectsValidation } = require("../../validations/subjectValidation");

// Add Subject
const addSubject = async (req, res) => {
    try {
        const validation = addSubjectValidation(req.body);
        if (validation.fails()) {
            return res.status(400).json({ errors: validation.errors.all() });
        }
        const { subjectName } = req.body;

        if (!subjectName) {
            return res.status(400).json({ message: "Subject name is required" });
        }
        const existingSubject = await Subject.findOne({ where: { subjectName, isDeleted: false } });

        if (existingSubject) {
            return res.status(400).json({ message: "Subject already exists with this name." });
        }

        const newSubject = await Subject.create({
            subjectId: uuidv4(),
            subjectName,
        });

        return res.status(201).json({ message: "Subject added successfully", newSubject });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

// Update Subject
const updateSubject = async (req, res) => {
    try {
        const validation = updateSubjectValidation(req.body);
        if (validation.fails()) {
            return res.status(400).json({ errors: validation.errors.all() });
        }
        const { subjectId } = req.params;
        const { subjectName } = req.body;

        const subject = await Subject.findOne({ where: { subjectId, isDeleted: false } });
        if (!subject) {
            return res.status(400).json({ message: "Subject not found" });
        }

        await subject.update({ subjectName });

        return res.status(200).json({ message: "Subject updated successfully", subject });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

// Delete Subject
const deleteSubject = async (req, res) => {
    try {
        const { subjectId } = req.params;

        const subject = await Subject.findOne({ where: { subjectId, isDeleted: false } });
        if (!subject) {
            return res.status(400).json({ message: "Subject not found" });
        }
        await subject.update({ isDeleted: true });

        return res.status(200).json({ message: "Subject deleted successfully", subjectId });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};


// Get Subject by ID
const getSubjects = async (req, res) => {
    try {
        const validation = assignSubjectsValidation(req.body);
        if (validation.fails()) {
            return res.status(400).json({ errors: validation.errors.all() });
        }
        const { subjectId, name } = req.query;

        const filters = { isDeleted: false };
        if (subjectId) filters.subjectId = subjectId;
        if (name) filters.subjectName = { [Op.iLike]: `%${name}%` };

        const subjects = await Subject.findAll({ where: filters });
        const totalSubjects = await Subject.count({ where: filters });

        const data = {
            totalSubjects,
            subjects,
        }
        return res.status(200).json({ message: "Subjects retrieved successfully", data });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

const assignSubjectsToClass = async (req, res) => {
    try {
        const { className, subjectIds } = req.body;

        if (!className || !Array.isArray(subjectIds) || subjectIds.length === 0) {
            return res.status(400).json({ message: "Class name and subject IDs are required" });
        }

        // Ensure class exists
        const students = await Student.findAll({
            where: { class: className, isDeleted: false }
        });

        if (students.length === 0) {
            return res.status(400).json({ message: `No students found in class ${className}` });
        }

        // Ensure subjects exist
        const subjects = await Subject.findAll({
            where: { subjectId: subjectIds, isDeleted: false }
        });

        if (subjects.length !== subjectIds.length) {
            return res.status(400).json({ message: "Some subjects do not exist." });
        }

        // Assign subjects to class (not individual students)
        const classSubjectsData = subjectIds.map(subjectId => ({
            className,
            subjectId
        }));

        await ClassSubjects.bulkCreate(classSubjectsData, { ignoreDuplicates: true });

        return res.status(200).json({
            message: `Subjects assigned successfully to class ${className}.`
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};


module.exports = {
    addSubject,
    updateSubject,
    deleteSubject,
    getSubjects,
    assignSubjectsToClass,
};
