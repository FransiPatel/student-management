const { User, Parent } = require("../../models/index");

// Get User Profile API
const viewProfile = async (req, res) => {
    try {
        const { email } = req.params;
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ message: "email format is not valid" });
        }

        // Find user by email
        const user = await User.findOne({
            where: { email },
            attributes: ["email", "name", "class", "school", "profile_pic", "parentname"],
            include: { model: Parent, attributes: ["parentname", "email", "phone"] } // Include parent details
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
}
