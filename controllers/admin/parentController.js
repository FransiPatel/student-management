const { Parent } = require("../../models/index");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const { parentValidation, updateParentValidation } = require("../../validations/parentValidation");

const addParent = async (req, res) => {
    try {
        const { parentname, parentemail, phone } = req.body;

        // Validate input using ValidatorJS
        const validation = parentValidation(req.body);
        if (validation.fails()) {
            return res.status(400).json({ message: validation.errors.all() });
        }

        // Check if Parent already exists
        const existingParent = await Parent.findOne({ where: { parentemail } });
        if (existingParent) {
            return res.status(400).json({ message: "Parent already exists" });
        }

        // Create Parent with UUID
        const newParent = await Parent.create({
            parentid: uuidv4(),
            parentname,
            parentemail,
            phone
        });

        return res.status(201).json({
            message: "Parent added successfully",
            parent: {
                parentid: newParent.parentid,
                parentname: newParent.parentname,
                parentemail: newParent.parentemail,
                phone: newParent.phone
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

// Get All Parents
const getAllParents = async (req, res) => {
    try {
        const parents = await Parent.findAll({
            attributes: ["parentid", "parentname", "parentemail", "phone"]
        });

        return res.status(200).json({ message: "Parents retrieved successfully", parents });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

// Search Parent
const searchParent = async (req, res) => {
    try {
        let { parentname, parentemail, phone, page, limit } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const offset = (page - 1) * limit;

        const filters = {};
        if (parentname) filters.parentname = { [Op.iLike]: `%${parentname}%` };
        if (parentemail) filters.parentemail = { [Op.iLike]: `%${parentemail}%` };
        if (phone) filters.phone = { [Op.iLike]: `%${phone}%` };

        const parents = await Parent.findAll({
            where: filters,
            attributes: ["parentid", "parentname", "parentemail", "phone"],
            limit,
            offset,
            order: [["createdAt", "DESC"]]
        });

        if (!parents.length) {
            return res.status(400).json({ message: "No parents found" });
        }

        return res.status(200).json({
            message: "Parents retrieved successfully",
            parents
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

// Update Parent
const updateParent = async (req, res) => {
    try {
        const { parentid } = req.params;
        const { parentname, phone } = req.body;

        // Validate input using ValidatorJS
        const validation = updateParentValidation(req.body);
        if (validation.fails()) {
            return res.status(400).json({ message: validation.errors.all() });
        }

        // Find Parent by parentid
        const parent = await Parent.findByPk(parentid);
        if (!parent) {
            return res.status(400).json({ message: "Parent not found" });
        }

        // Update Parent Details
        await parent.update({
            parentname: parentname || parent.parentname,
            phone: phone || parent.phone
        });

        return res.status(200).json({ message: "Parent updated successfully", parent });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};


// Soft Delete Parent
const deleteParent = async (req, res) => {
    try {
        const { parentid } = req.params;

        // Find Parent by parentid
        const parent = await Parent.findByPk(parentid);
        if (!parent || parent.isDeleted) {
            return res.status(400).json({ message: "Parent not found" });
        }

        // Soft delete the Parent
        await parent.update({ isDeleted: true });

        return res.status(200).json({ message: "Parent deleted successfully (soft delete)" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
module.exports = { addParent, getAllParents, searchParent, updateParent, deleteParent };
