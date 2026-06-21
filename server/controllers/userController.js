const User = require("../models/User");
const bcrypt = require("bcryptjs");

async function updateMe(req, res) {
    try {
        const userId = req.user.id;
        const { username, email, password } = req.body;

        const updateData = {};

        if (username) {
            updateData.username = username;
        }

        if (email) {
            updateData.email = email;
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Account updated successfully"
        });

    } catch (error) {
        console.error("Update user error:", error);

        if (error.code === 11000) {
            return res.status(400).json({
                message: "Username or email already exists"
            });
        }

        res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function deleteMe(req, res) {
    try {
        const userId = req.user.id;

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.clearCookie("token");

        res.status(200).json({
            message: "Account deleted successfully"
        });

    } catch (error) {
        console.error("Delete user error:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = {
    updateMe,
    deleteMe
};