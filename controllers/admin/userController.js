const bcrypt = require("bcryptjs");
const { User, Parent } = require("../../models/index");
const { Op } = require("sequelize");

// Add User
const addUser = async (req, res) => {
    try {
        const { email, name, password, class: userClass, school, parentname } = req.body;

        if (!email || !name || !password || !userClass || !parentname) {
            return res.status(400).json({ message: "Email, name, class, password, and parentname are required" });
        }
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ message: "email format is not valid" });
        }

        // Check if the parent exists
        const parent = await Parent.findByPk(parentname);
        if (!parent) {
            return res.status(404).json({ message: "Parent not found" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Profile picture path
        const profilePicPath = req.file ? `uploads/profile_pics/${req.file.filename}` : null;

        // Create User
        const newUser = await User.create({
            email,
            name,
            password: hashedPassword,
            class: userClass,
            school: school || "Our School",
            profile_pic: profilePicPath,
            parentname
        });

        return res.status(201).json({
            message: "User added successfully",
            user: { 
                email: newUser.email, 
                name: newUser.name, 
                class: newUser.class, 
                school: newUser.school, 
                profile_pic: newUser.profile_pic, 
                parentname: newUser.parentname
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get All Users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ["email", "name", "class", "school", "profile_pic", "parentname"],
            include: { model: Parent, attributes: ["id", "name", "email", "phone"] } // Fetch parent details
        });

        return res.status(200).json({ message: "Users retrieved successfully", users });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get User by Email
const searchUser = async (req, res) => {
    try {
        let { email, name, class: userClass, school, parentId, page, limit } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const offset = (page - 1) * limit;

        const filters = {};

        if (email) filters.email = { [Op.iLike]: `%${email}%` };
        if (name) filters.name = { [Op.iLike]: `%${name}%` };
        if (userClass) filters.class = userClass;
        if (school) filters.school = { [Op.iLike]: `%${school}%` };
        if (parentId) filters.parentId = parentId;

        const users = await User.findAll({
            where: filters,
            attributes: ["email", "name", "class", "school", "profile_pic", "parentId"],
            include: { model: Parent, attributes: ["id", "name", "email", "phone"] },
            limit,
            offset,
            order: [["createdAt", "DESC"]]
        });

        const totalUsers = await User.count({ where: filters });

        if (!users.length) {
            return res.status(404).json({ message: "No users found" });
        }

        return res.status(200).json({
            message: "Users retrieved successfully",
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
            users
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update User
const updateUser = async (req, res) => {
    try {
        const { email } = req.params;
        const { name, class: userClass, school, parentname } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate if parentname exists
        if (parentname) {
            const parent = await Parent.findByPk(parentname);
            if (!parent) {
                return res.status(404).json({ message: "Parent not found" });
            }
        }

        let profilePicPath = user.profile_pic;
        if (req.file) {
            profilePicPath = `uploads/profile_pics/${req.file.filename}`;
        }

        await user.update({
            name: name || user.name,
            class: userClass || user.class,
            school: school || user.school,
            profile_pic: profilePicPath,
            parentname: parentname || user.parentname
        });

        return res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    try {
        const { email } = req.params;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.destroy();
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    addUser,
    getAllUsers,
    searchUser,
    updateUser,
    deleteUser
};
