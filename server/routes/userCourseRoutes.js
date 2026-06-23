const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middlewares/authMiddleware");

const {
    addCourseToUser,
    getMyCourses,
    getMyCourse,
    updateCourseProgress,
    recordCourseView,
    getRecommendedForUser
} = require("../controllers/userCourseController");

router.post("/my-courses", requireAuth, addCourseToUser);
router.get("/my-courses", requireAuth, getMyCourses);
router.get("/my-courses/:courseId", requireAuth, getMyCourse);
router.patch("/my-courses/:courseId/progress", requireAuth, updateCourseProgress);
router.patch("/my-courses/:courseId/view", requireAuth, recordCourseView);
router.get("/recommended", requireAuth, getRecommendedForUser);

module.exports = router;