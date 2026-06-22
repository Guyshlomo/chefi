const Course = require("../models/Course");

async function getAllCourses(req, res) {
    try {
        const search = req.query.search;
        const category = req.query.category;
        const level = req.query.level;

        const filter = {};

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { chef_name: { $regex: search, $options: "i" } }
            ];
        }

        if (category) {
            filter.category = category;
        }

        if (level) {
            filter.level = level;
        }

        const courses = await Course.find(filter);

        res.status(200).json(courses);

    } catch (error) {
        console.error("Error getting courses:", error);

        res.status(500).json({
            message: "Error getting courses from database"
        });
    }
}

module.exports = {
    getAllCourses
};