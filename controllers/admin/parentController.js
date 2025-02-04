const { Parent } = require("../../models/index");

// Add Parent
const addParent = async (req, res) => {
    try {
        const { parentname, email, phone } = req.body;

        if (!parentname || !email || !phone) {
            return res.status(400).json({ message: "Name, email, and phone are required" });
        }

        // Check if Parent already exists
        const existingParent = await Parent.findOne({ where: { email } });
        if (existingParent) {
            return res.status(409).json({ message: "Parent already exists" });
        }

        // Create Parent
        const newParent = await Parent.create({ parentname, email, phone });

        return res.status(201).json({
            message: "Parent added successfully",
            parent: { parentname: newParent.name, email: newParent.email, phone: newParent.phone }
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get All Parents
const getAllParents = async (req, res) => {
    try {
        const parents = await Parent.findAll({
            attributes: ["parentname", "email", "phone"]
        });

        return res.status(200).json({ message: "Parents retrieved successfully", parents });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Search Parent by parentname
const searchParent = async (req, res) => {
    try {
        const { parentname } = req.params;

        if (!parentname) {
            return res.status(400).json({ message: "Parent name is required" });
        }

        // Find Parent by parentname
        const parent = await Parent.findByPk(parentname, {
            attributes: ["parentname", "email", "phone"]
        });

        if (!parent) {
            return res.status(404).json({ message: "Parent not found" });
        }

        return res.status(200).json({ message: "Parent found", parent });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update Parent
const updateParent = async (req, res) => {
    try {
        const { parentname } = req.params;
        const { email, phone } = req.body;

        // Find Parent by parentname
        const parent = await Parent.findByPk(parentname);
        if (!parent) {
            return res.status(404).json({ message: "Parent not found" });
        }

        // Update Parent Details
        await parent.update({
            parentname: parentname || parent.parentname,
            email: email || parent.email,
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
        const { parentname } = req.params;

        // Find Parent by parentname
        const parent = await Parent.findByPk(parentname);
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