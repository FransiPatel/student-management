const { Parent } = require("../../models/index");
const { Op } = require("sequelize");

// Add Parent
const addParent = async (req, res) => {
    try {
        const { parentname, parentemail, phone } = req.body;

        if (!parentname || !parentemail || !phone) {
            return res.status(400).json({ message: "Name, email, and phone are required" });
        }

        // Check if Parent already exists
        const existingParent = await Parent.findOne({ where: { parentemail } });
        if (existingParent) {
            return res.status(409).json({ message: "Parent already exists" });
        }

        // Create Parent
        const newParent = await Parent.create({ parentname, parentemail, phone });

        return res.status(201).json({
            message: "Parent added successfully",
            parent: {
                id: newParent.id, // Now includes id
                parentname: newParent.parentname,
                parentemail: newParent.parentemail,
                phone: newParent.phone
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get All Parents
const getAllParents = async (req, res) => {
    try {
        const parents = await Parent.findAll({
            attributes: ["id", "parentname", "parentemail", "phone"] // Include the id in the response
        });

        return res.status(200).json({ message: "Parents retrieved successfully", parents });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Search Parent by parentname
const searchParent = async (req, res) => {
    try {
        let { parentname, parentemail, phone, page, limit } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const offset = (page - 1) * limit;

        const filters = {};

        if (parentname) filters.parentname = { [Op.iLike]: `%${parentname}%` };
        if (parentemail) filters.parentemail = { [Op.iLike]: `%${parentemail}%` };
        if (phone) filters.phone = { [Op.iLike]: `%${phone}%` }; // Allow partial match on phone number

        const parents = await Parent.findAll({
            where: filters,
            attributes: ["id", "parentname", "parentemail", "phone"], // Include id in the response
            limit,
            offset,
            order: [["createdAt", "DESC"]]
        });

        const totalParents = await Parent.count({ where: filters });

        if (!parents.length) {
            return res.status(404).json({ message: "No parents found" });
        }

        return res.status(200).json({
            message: "Parents retrieved successfully",
            totalParents,
            totalPages: Math.ceil(totalParents / limit),
            currentPage: page,
            parents
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update Parent
const updateParent = async (req, res) => {
    try {
        const { id } = req.params;  // Update to use `id` as primary key
        const { parentname, phone } = req.body;

        // Find Parent by id
        const parent = await Parent.findByPk(id);
        if (!parent) {
            return res.status(404).json({ message: "Parent not found" });
        }

        // Update Parent Details
        await parent.update({
            parentname: parentname || parent.parentname,
            phone: phone || parent.phone
        });

        return res.status(200).json({ message: "Parent updated successfully", parent });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete Parent
const deleteParent = async (req, res) => {
    try {
        const { id } = req.params;  // Update to use `id` as primary key

        // Find Parent by id
        const parent = await Parent.findByPk(id);
        if (!parent) {
            return res.status(404).json({ message: "Parent not found" });
        }

        // Delete Parent (Will also delete associated User due to CASCADE)
        await parent.destroy();

        return res.status(200).json({ message: "Parent deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { addParent, getAllParents, searchParent, updateParent, deleteParent };
