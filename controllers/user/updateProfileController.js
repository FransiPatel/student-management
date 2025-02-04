const bcrypt = require("bcryptjs");
const { User, Parent } = require("../../models/index");

const updateProfile = async (req, res) => {
    try {
        const { email } = req.params;
        const { name, class: userClass, school, parentId } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate parentId if provided
        if (parentId) {
            const parent = await Parent.findByPk(parentId);
            if (!parent) {
                return res.status(404).json({ message: "Parent not found" });
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
            parentId: parentId || user.parentId
        });

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                email: user.email,
                name: user.name,
                class: user.class,
                school: user.school,
                profile_pic: user.profile_pic,
                parentId: user.parentId
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports ={
    updateProfile,
}