const fs = require("fs");
const path = require("path");
const { User, Parent } = require("../../models/index");

const updateProfile = async (req, res) => {
    try {
        const { email } = req.params;
        const { name, class: userClass, school, parentemail } = req.body;

        // Ensure user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        // Ensure user can only update their own profile OR admin can update any profile
        if (req.user.email !== email && !req.user.isAdmin) {
            return res.status(403).json({ message: "Access denied. You can only update your own profile." });
        }

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate parent if updating parentemail
        if (parentemail) {
            const parent = await Parent.findByPk(parentemail); // Using parentemail as primary key for lookup
            if (!parent) {
                return res.status(400).json({ message: "Parent not found. Provide a valid parentemail." });
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

        // Update user details
        await user.update({
            name: name || user.name,
            class: userClass || user.class,
            school: school || user.school,
            profile_pic: profilePicPath,
            parentemail: parentemail || user.parentemail,
        });

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                email: user.email,
                name: user.name,
                class: user.class,
                school: user.school,
                profile_pic: user.profile_pic,
                parentemail: user.parentemail
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    updateProfile,
};
