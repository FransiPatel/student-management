const { User, Parent } = require("../../models/index");

// Get User Profile API
const viewProfile = async (req, res) => {
    try {
        const { id } = req.params; // Using 'id' instead of 'email'

        // Ensure user can only view their own profile unless they are an admin
        if (req.user.id !== parseInt(id) && !req.user.isAdmin) {
            return res.status(403).json({ message: "Access denied. You can only view your own profile." });
        }

        // Find user by id
        const user = await User.findOne({
            where: { id },
            attributes: ["email", "name", "class", "school", "profile_pic", "parentemail"],
            include: [{
                model: Parent,
                as: "Parents", 
                attributes: ["parentname", "parentemail", "phone"]
            }] 
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User profile fetched successfully", user });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    viewProfile,
};
