const { Parent, Student } = require("../../models/index");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const { parentValidation, updateParentValidation } = require("../../validations/parentValidation");

const addParent = async (req, res) => {
    try {
        const { parentName, parentEmail, parentPhone } = req.body;

        // Validate input
        const validation = parentValidation(req.body);
        if (validation.fails()) {
            return res.status(400).json({ message: "Validation failed", errors: validation.errors.all() });
        }

        // Check if a parent with the same email exists
        const existingParent = await Parent.findOne({ where: { parentEmail, isDeleted: false } });

        if (existingParent) {
            return res.status(400).json({ message: "Parent already exists with this email." });
        }

        // Create new Parent
        const newParent = await Parent.create({
            parentId: uuidv4(),
            parentName,
            parentEmail,
            parentPhone,
        });
        const data = {
            parent: {
                parentId: newParent.parentId,
                parentName: newParent.parentName,
                parentEmail: newParent.parentEmail,
                parentPhone: newParent.parentPhone,
            },
        };

        return res.status(201).json({
            message: "Parent added successfully",
            data,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

// Get All Parents & Search
const getParents = async (req, res) => {
    try {
        let { parentId, parentName, parentEmail, parentPhone, page, limit } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const offset = (page - 1) * limit;

        const filters = { isDeleted: false };
        if (parentId) filters.parentId = parentId;
        if (parentName) filters.parentName = { [Op.iLike]: `%${parentName}%` };
        if (parentEmail) filters.parentEmail = { [Op.iLike]: `%${parentEmail}%` };
        if (parentPhone) filters.parentPhone = { [Op.iLike]: `%${parentPhone}%` };

        // Get total count
        const totalParents = await Parent.count({ where: filters });

        // Fetch parents with pagination
        const parents = await Parent.findAll({
            where: filters,
            attributes: ["parentId", "parentName", "parentEmail", "parentPhone"],
            limit,
            offset,
            order: [["createdAt", "DESC"]],
        });

        const data = { totalParents, parents };

        return res.status(200).json({ message: "Parents retrieved successfully", data });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

// Update Parent
const updateParent = async (req, res) => {
    try {
        const { parentId } = req.params;
        const { parentEmail, parentName, parentPhone } = req.body;

        // Validate input
        const validation = updateParentValidation(req.body);
        if (validation.fails()) {
            return res.status(400).json({ message: "Validation failed", data: validation.errors.all() });
        }

        // Find Parent
        const parent = await Parent.findOne({ where: { parentId, isDeleted: false } });
        if (!parent) {
            return res.status(400).json({ message: "Parent not found or deleted" });
        }
        if(parentEmail) {
            const existingEmail = await Parent.findOne({ where: { parentEmail, isDeleted: false } });
            if (existingEmail) {
                return res.status(400).json({ message: "Parent already exists with this email." });
            }
        }
        

        // Update Parent
        await parent.update({
            parentName: parentName || parent.parentName,
            parentPhone: parentPhone || parent.parentPhone,
            parentEmail: parentEmail || parent.parentEmail,
        });

        const data = {
            parent: {
                parentId: parent.parentId,
                parentName: parent.parentName,
                parentEmail: parent.parentEmail,
                parentPhone: parent.parentPhone,
            },
        };

        return res.status(200).json({ message: "Parent updated successfully", data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Soft Delete Parent
const deleteParent = async (req, res) => {
    try {
        const { parentId } = req.params;

        // Find Parent
        const parent = await Parent.findOne({ where: { parentId, isDeleted: false } });
        if (!parent) {
            return res.status(400).json({ message: "Parent not found or already deleted" });
        }

        // Soft delete the Parent
        await parent.update({ isDeleted: true });
        await Student.update({ isDeleted: true }, { where: { parentId } });

        return res.status(200).json({ message: "Parent deleted successfully", parentId });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { addParent, getParents, updateParent, deleteParent };
