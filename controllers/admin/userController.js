const bcrypt = require("bcryptjs");
const { User, Parent } = require("../../models/index");
const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");
const { userValidation, updateUserValidation } = require("../../validations/userValidation");

const addUser = async (req, res) => {
    try {
        const { email, name, password, class: userClass, school, parentid } = req.body;

        // Validate input using ValidatorJS
        const validation = userValidation(req.body);
        if (validation.fails()) {
            return res.status(400).json({ message: validation.errors.all() });
        }

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Check if the parent exists
        const parent = await Parent.findByPk(parentid);
        if (!parent) {
            return res.status(400).json({ message: "Parent not found. Please provide a valid parentid." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const profilePicPath = req.file ? `uploads/${req.file.filename}` : null;

        // Create User
        const newUser = await User.create({
            email,
            name,
            password: hashedPassword,
            class: userClass,
            school: school || "Our School",
            profile_pic: profilePicPath,
            parentid
        });

        return res.status(201).json({
            message: "User added successfully",
            newUser,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

const getUsers = async (req, res) => {
    try {
        let { email, name, class: userClass, school, parentid, page, limit } = req.query;

        // Pagination defaults
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 5;
        const offset = (page - 1) * limit;

        // Filters (Include only non-deleted users & parents)
        const filters = { isDeleted: false }; 
        if (email) filters.email = { [Op.iLike]: `%${email}%` };
        if (name) filters.name = { [Op.iLike]: `%${name}%` };
        if (userClass) filters.class = userClass;
        if (school) filters.school = { [Op.iLike]: `%${school}%` };
        if (parentid) filters.parentid = parentid;

        // Fetch users with filters & pagination
        const users = await User.findAll({
            where: filters,
            attributes: ["email", "name", "class", "school", "profile_pic", "parentid"],
            include: [{
                model: Parent,
                as: "Parent",
                attributes: ["id", "parentname", "parentemail", "phone"],
                where: { isDeleted: false },
                required: false, 
            }],
            limit,
            offset,
            order: [["createdAt", "DESC"]],
        });

        // Get total count of users (excluding deleted ones)
        const totalUsers = await User.count({ where: filters });

        // If no users found
        if (!users.length) {
            return res.status(400).json({ message: "No users found" });
        }

        return res.status(200).json({
            message: "Users retrieved successfully",
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
            users,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update User
// Update User
const updateUser = async (req, res) => {
    try {
        const { email } = req.params;
        const { name, class: userClass, school, parentid } = req.body;

        // Validate input using ValidatorJS
        const validation = updateUserValidation(req.body);
        if (validation.fails()) {
            return res.status(400).json({ message: validation.errors.all() });
        }

        // Find user but exclude soft-deleted ones
        const user = await User.findOne({ where: { email, isDeleted: false } });
        if (!user) {
            return res.status(400).json({ message: "User not found or has been deleted" });
        }

        // Validate if parentid exists
        if (parentid) {
            const parent = await Parent.findOne({ where: { id: parentid, isDeleted: false } });
            if (!parent) {
                return res.status(400).json({ message: "Parent not found or has been deleted" });
            }
        }

        // Handle profile picture update and deletion of old image
        let profilePicPath = user.profile_pic;
        if (req.file) {
            const newProfilePicPath = `uploads/${req.file.filename}`;

            // Delete old profile picture if it exists
            if (user.profile_pic) {
                const oldImagePath = path.join(__dirname, "../../", user.profile_pic);
                fs.unlink(oldImagePath, (err) => {
                    if (err && err.code !== "ENOENT") {
                        console.error("Error deleting old profile picture:", err);
                    }
                });
            }

            profilePicPath = newProfilePicPath;
        }

        await user.update({
            name: name || user.name,
            class: userClass || user.class,
            school: school || user.school,
            profile_pic: profilePicPath,
            parentid: parentid || user.parentid
        });

        return res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};


// Delete User
const deleteUser = async (req, res) => {
    try {
        const { email } = req.params;

        // Find user by email
        const user = await User.findOne({ where: { email, isDeleted: false } });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Count how many active (not soft-deleted) users are associated with this parent
        const userCount = await User.count({ where: { parentid: user.parentid, isDeleted: false } });

        // Soft delete the user
        await user.update({ isDeleted: true });

        // If this was the only active user associated with the parent, soft delete the parent as well
        if (userCount === 1) {
            await Parent.update({ isDeleted: true }, { where: { id: user.parentid } });
        }

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    addUser,
    getUsers,
    updateUser,
    deleteUser
};
