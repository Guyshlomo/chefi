const UserCourse = require("../models/UserCourse");

async function addCourseToUser(req, res) {
    try {
        const userId = req.user.id;
        const courseData = req.body;

        const savedCourse = await UserCourse.findOneAndUpdate(
            {
                userId: userId,
                courseId: courseData.courseId
            },
            {
                userId: userId,
                courseId: courseData.courseId,
                title: courseData.title,
                chef: courseData.chef,
                image: courseData.image,
                category: courseData.category,
                duration: courseData.duration,
                level: courseData.level,
                courseType: courseData.courseType || "catalog",
                lastViewedAt: new Date()
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        res.status(201).json({
            message: "Course added successfully",
            course: savedCourse
        });
    } catch (error) {
        console.error("Add course error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getMyCourses(req, res) {
    try {
        const userId = req.user.id;

        const courses = await UserCourse.find({ userId: userId }).sort({ lastViewedAt: -1, updatedAt: -1 });

        res.status(200).json(courses);
    } catch (error) {
        console.error("Get my courses error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getMyCourse(req, res) {
    try {
        const userId = req.user.id;
        const { courseId } = req.params;

        const course = await UserCourse.findOne({ userId: userId, courseId: courseId });

        if (!course) {
            return res.status(404).json({ message: "Course not found in your library" });
        }

        res.status(200).json(course);
    } catch (error) {
        console.error("Get my course error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function updateCourseProgress(req, res) {
    try {
        const userId = req.user.id;
        const { courseId } = req.params;
        const { progress, currentLesson } = req.body;

        const update = {
            lastViewedAt: new Date()
        };

        if (typeof progress === "number") {
            update.progress = Math.min(100, Math.max(0, progress));
        }

        if (typeof currentLesson === "number") {
            update.currentLesson = Math.max(0, currentLesson);
        }

        const course = await UserCourse.findOneAndUpdate(
            { userId: userId, courseId: courseId },
            update,
            { new: true }
        );

        if (!course) {
            return res.status(404).json({ message: "Course not found in your library" });
        }

        res.status(200).json({
            message: "Progress updated",
            course: course
        });
    } catch (error) {
        console.error("Update course progress error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function recordCourseView(req, res) {
    try {
        const userId = req.user.id;
        const { courseId } = req.params;

        const course = await UserCourse.findOneAndUpdate(
            { userId: userId, courseId: courseId },
            { lastViewedAt: new Date() },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({ message: "Course not found in your library" });
        }

        res.status(200).json({
            message: "View recorded",
            course: course
        });
    } catch (error) {
        console.error("Record course view error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    addCourseToUser,
    getMyCourses,
    getMyCourse,
    updateCourseProgress,
    recordCourseView
};