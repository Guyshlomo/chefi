const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Course = require("../models/Course");

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

async function getRecommendedForUser(req, res) {
    try {
        const userId = req.user.id;

        const myCourses = await UserCourse.find({ userId: userId });

        const myCourseIds = myCourses.map(course => String(course.courseId));
        const myCategories = myCourses.map(course => course.category);

        let recommendedCourses = [];

        if (myCategories.length > 0) {
            recommendedCourses = await Course.find({
                category: { $in: myCategories },
                id: { $nin: myCourseIds }
            }).limit(4);
        }

        if (recommendedCourses.length === 0) {
            recommendedCourses = await Course.find({
                id: { $nin: myCourseIds }
            }).limit(4);
        }

        res.status(200).json(recommendedCourses);
    } catch (error) {
        console.error("Recommended courses error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


module.exports = {
    updateMe,
    deleteMe,
    getRecommendedForUser
};