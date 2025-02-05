const bcrypt = require("bcryptjs");
const { User, Parent } = require("../../models/index");
const { Op } = require("sequelize");

// Add User
const addUser = async (req, res) => {
    try {
        const { email, name, password, class: userClass, school, parentname, parentemail, parentphone } = req.body;

        if (!email || !name || !password || !userClass || !parentemail) {
            return res.status(400).json({ message: "email, name, class, password, and parentemail are required" });
        }
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Check if the parent exists, if not, create a new parent
        let parent = await Parent.findByPk(parentemail);
        if (!parent) {
            if (!parentname || !parentphone) {
                return res.status(400).json({ message: "Parent does not exist. Please provide parentname and parentPhone to create one." });
            }
            parent = await Parent.create({
                parentemail,
                parentname: parentname,
                phone: parentphone
            });
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
            parentemail
        });

        return res.status(201).json({
            message: "User added successfully",
            user: { 
                email: newUser.email, 
                name: newUser.name, 
                class: newUser.class, 
                school: newUser.school, 
                profile_pic: newUser.profile_pic, 
                parentemail: newUser.parentemail
            },
            parent: parent // Returning parent details too
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
// Get All Users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ["email", "name", "class", "school", "profile_pic", "parentemail"],
            include: { model: Parent, attributes: ["parentname", "parentemail", "phone"] } // Fetch parent details
        });

        return res.status(200).json({ message: "Users retrieved successfully", users });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get User by Email
const searchUser = async (req, res) => {
    try {
        let { email, name, class: userClass, school, parentemail, page, limit } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 5;
        const offset = (page - 1) * limit;

        const filters = {};

        if (email) filters.email = { [Op.iLike]: `%${email}%` };
        if (name) filters.name = { [Op.iLike]: `%${name}%` };
        if (userClass) filters.class = userClass;
        if (school) filters.school = { [Op.iLike]: `%${school}%` };
        if (parentemail) filters.parentemail = { [Op.iLike]: `%${parentemail}%` };

        const users = await User.findAll({
            where: filters,
            attributes: ["email", "name", "class", "school", "profile_pic", "parentemail"],
            include: { model: Parent, attributes: ["parentname", "parentemail", "phone"] },
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
        const { name, class: userClass, school, parentemail } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate if parentemail exists
        if (parentemail) {
            const parent = await Parent.findByPk(parentemail);
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
            parentemail: parentemail || user.parentemail
        });

        return res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    try {
        const { parentemail } = req.params;

        const user = await User.findOne({ where: { parentemail } });
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
