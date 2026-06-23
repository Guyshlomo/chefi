const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middlewares/authMiddleware");
const {
    addCourseToUser,
    getMyCourses,
    recordCourseView
} = require("../controllers/userCourseController");

router.post("/my-courses", requireAuth, addCourseToUser);
router.get("/my-courses", requireAuth, getMyCourses);
router.patch("/my-courses/:courseId/view", requireAuth, recordCourseView);

module.exports = router;