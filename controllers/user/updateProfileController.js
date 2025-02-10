const fs = require("fs");
const path = require("path");
const { User } = require("../../models/index");
const { updateUserValidation } = require("../../validations/userValidation");

const updateProfile = async (req, res) => {
    try {
        const { name, class: userClass, school } = req.body;

        // Ensure user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        // Validate input
        const validation = updateUserValidation(req.body);
        if (validation.fails()) {
            return res.status(400).json({ message: validation.errors.all() });
        }

        // Find user by ID from token (no need for params)
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Handle profile picture update
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

        // Update user details
        await user.update({
            name: name || user.name,
            class: userClass || user.class,
            school: school || user.school,
            profile_pic: profilePicPath,
        });

        return res.status(200).json({
            message: "Profile updated successfully",
            user,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    updateProfile,
};
