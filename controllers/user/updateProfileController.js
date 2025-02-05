const bcrypt = require("bcryptjs");
const { User, Parent } = require("../../models/index");

const updateProfile = async (req, res) => {
    try {
        const { email } = req.params;
        const { name, class: userClass, school, parentname } = req.body;

        console.log("Authenticated User:", req.user); // Debugging Log

        // Ensure user can only update their own profile OR admin can update any profile
        if (req.user.email !== email && !req.user.isAdmin) {
            return res.status(403).json({ message: "Access denied. You can only update your own profile." });
        }

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate parentname if provided
        if (parentname) {
            let parent = await Parent.findByPk(parentname);
            if (!parent) {
                return res.status(400).json({ message: "Parent not found. Provide valid parentname." });
            }
        }

        // Update profile picture if uploaded
        let profilePicPath = user.profile_pic;
        if (req.file) {
            profilePicPath = `uploads/profile_pics/${req.file.filename}`;
        }

        // Update user details
        await user.update({
            name: name || user.name,
            class: userClass || user.class,
            school: school || user.school,
            profile_pic: profilePicPath,
            parentname: parentname || user.parentname
        });

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                email: user.email,
                name: user.name,
                class: user.class,
                school: user.school,
                profile_pic: user.profile_pic,
                parentname: user.parentname
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    updateProfile,
};
