const mongoose = require("mongoose");

const userCourseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    courseId: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    chef: String,
    image: String,
    category: String,
    duration: String,
    level: String,

    progress: {
        type: Number,
        default: 0
    },

    lastViewedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

userCourseSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model("UserCourse", userCourseSchema);