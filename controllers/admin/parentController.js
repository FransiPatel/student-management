const { Parent, User } = require("../../models/index");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const { parentValidation, updateParentValidation } = require("../../validations/parentValidation");

const addParent = async (req, res) => {
    try {
        const { parentname, parentemail, phone } = req.body;

        // Validate input
        const validation = parentValidation(req.body);
        if (validation.fails()) {
            return res.status(400).json({ message: "Validation failed", errors: validation.errors.all() });
        }

        // Check if a parent with the same email exists (including soft-deleted parents)
        const existingParent = await Parent.findOne({ where: { parentemail } });

        if (existingParent) {
            if (!existingParent.isDeleted) {
                return res.status(400).json({ message: "Parent already exists with this email." });
            } else {
                // If the parent exists but is soft-deleted, send an error
                return res.status(400).json({ message: "This email was used before and is soft deleted. Please use another email or contact support." });
            }
        }

        // Create new Parent
        const newParent = await Parent.create({
            parentid: uuidv4(),
            parentname,
            parentemail,
            phone,
        });
        const data = {
            parent: {
                parentid: parent.id,
                parentname: parent.parentname,
                parentemail: parent.parentemail,
                phone: parent.phone,
            },
        };

        return res.status(201).json({
            message: "Parent added successfully",
            data
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

// Get All Parents & Search
const getParents = async (req, res) => {
    try {
        let { id, parentname, parentemail, phone, page, limit } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const offset = (page - 1) * limit;

        const filters = { isDeleted: false };
        if (id) filters.id = id;
        if (parentname) filters.parentname = { [Op.iLike]: `%${parentname}%` };
        if (parentemail) filters.parentemail = { [Op.iLike]: `%${parentemail}%` };
        if (phone) filters.phone = { [Op.iLike]: `%${phone}%` };

        // Get total count
        const totalParents = await Parent.count({ where: filters });

        // Fetch parents with pagination
        const parents = await Parent.findAll({
            where: filters,
            attributes: ["id", "parentname", "parentemail", "phone"],
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
        const { id } = req.params;
        const { parentemail, parentname, phone } = req.body;

        // Validate input
        const validation = updateParentValidation(req.body);
        if (validation.fails()) {
            return res.status(400).json({ message: "Validation failed", data: validation.errors.all() });
        }

        // Find Parent (Exclude Soft-Deleted)
        const parent = await Parent.findOne({ where: { id, isDeleted: false } });
        if (!parent) {
            return res.status(400).json({ message: "Parent not found or deleted" });
        }

        // Update Parent
        await parent.update({
            parentname: parentname || parent.parentname,
            phone: phone || parent.phone,
        });

        const data = {
            parent: {
                parentid: parent.id,
                parentname: parent.parentname,
                parentemail: parent.parentemail,
                phone: parent.phone,
            },
        };

        return res.status(200).json({ message: "Parent updated successfully", data });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

// Soft Delete Parent
const deleteParent = async (req, res) => {
    try {
        const { id } = req.params;

        // Find Parent
        const parent = await Parent.findOne({ where: { id, isDeleted: false } });
        if (!parent) {
            return res.status(400).json({ message: "Parent not found or already deleted" });
        }

        // Soft delete the Parent
        await parent.update({ isDeleted: true });
        await User.update({ isDeleted: true }, { where: { parentid:id } });

        return res.status(200).json({ message: "Parent deleted successfully", id });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { addParent, getParents, updateParent, deleteParent };
