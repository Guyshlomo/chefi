const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },

    title: {
        type: String,
        required: true,
        trim: true
    },

    chef_name: {
        type: String,
        required: true,
        trim: true
    },

    category: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },

    level: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        required: true
    },

    duration: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Course", courseSchema);