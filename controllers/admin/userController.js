const bcrypt = require("bcryptjs");
const { User, Parent } = require("../../models/index");
const { Op } = require("sequelize");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
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

        // Check if a user with the same email exists 
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            if (!existingUser.isDeleted) {
                return res.status(400).json({ message: "User already exists with this email." });
            } else {
                // If the user exists but is soft-deleted, send an error
                return res.status(400).json({ message: "This email was used before and is soft deleted. Please use another email or contact support." });
            }
        }

        // Check if the parent exists
        const parent = await Parent.findOne({ where: { id: parentid, isDeleted: false } });
        if (!parent) {
            return res.status(400).json({ message: "Parent not found. Please provide a valid parentid." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const profilePicPath = req.file ? `media/uploads/${req.file.filename}` : null;

        // Create a new User
        const newUser = await User.create({
            id: uuidv4(),
            email,
            name,
            password: hashedPassword,
            class: userClass,
            school: school || "Our School",
            profile_pic: profilePicPath,
            parentid,
        });
        const data = {
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                class: newUser.class,
                school: newUser.school,
                profile_pic: newUser.profile_pic,
                parentid: newUser.parentid,
            }
        };

        return res.status(201).json({ message: "User added successfully", data });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

const getUsers = async (req, res) => {
    try {
        let { id, email, name, class: userClass, school, parentid, page, limit } = req.query;

        // Pagination defaults
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 5;
        const offset = (page - 1) * limit;

        // Filters (Include only non-deleted users & parents)
        const filters = { isDeleted: false };
        if (id) filters.id = id;
        if (email) filters.email = { [Op.iLike]: `%${email}%` };
        if (name) filters.name = { [Op.iLike]: `%${name}%` };
        if (userClass) filters.class = userClass;
        if (school) filters.school = { [Op.iLike]: `%${school}%` };
        if (parentid) filters.parentid = parentid;

        // Get total count
        const totalUsers = await User.count({ where: filters });

        // Fetch users with filters & pagination
        const users = await User.findAll({
            where: filters,
            attributes: ["id", "email", "name", "class", "school", "profile_pic", "parentid"],
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

        const data = {
            totalUsers,
            users,
        };

        return res.status(200).json({ message: "Users retrieved successfully", data });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

// Update User
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, name, class: userClass, school } = req.body;

        // Validate input using ValidatorJS
        const validation = updateUserValidation(req.body);
        if (validation.fails()) {
            return res.status(400).json({ message: validation.errors.all() });
        }

        // Find user but exclude soft-deleted ones
        const user = await User.findOne({ where: { id, isDeleted: false } });
        if (!user) {
            return res.status(400).json({ message: "User not found or has been deleted" });
        }

        // Handle profile picture update and deletion of old image
        let profilePicPath = user.profile_pic;
        if (req.file) {
            const newProfilePicPath = `media/uploads/${req.file.filename}`;

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
            email: email || user.email,
            name: name || user.name,
            class: userClass || user.class,
            school: school || user.school,
            profile_pic: profilePicPath,
        });

        const data = {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                class: user.class,
                school: user.school,
                profile_pic: user.profile_pic,
                parentid: user.parentid,
            }
        };

        return res.status(200).json({ message: "User updated successfully", data });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Find user by email
        const user = await User.findOne({ where: { id, isDeleted: false } });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Count how many active users are associated with this parent
        const userCount = await User.count({ where: { parentid: user.parentid, isDeleted: false } });

        // Soft delete the user
        await user.update({ isDeleted: true });

        // If this was the only active user associated with the parent, soft delete the parent as well
        if (userCount === 1) {
            await Parent.update({ isDeleted: true }, { where: { id: user.parentid } });
        }

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    addUser,
    getUsers,
    updateUser,
    deleteUser
};
