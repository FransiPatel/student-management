const { User, Parent } = require("../../models/index");

// Get User Profile API
const viewProfile = async (req, res) => {
    try {
        // Ensure user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        // Find user by ID from the token
        const user = await User.findOne({
            where: { id: req.user.id },
            attributes: ["id", "email", "name", "class", "school", "profile_pic", "parentid"],
            include: [{
                model: Parent,
                as: "Parent",
                attributes: ["id", "parentname", "parentemail", "phone"]
            }]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User profile fetched successfully", user });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    viewProfile,
};
