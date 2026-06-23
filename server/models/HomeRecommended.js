const mongoose = require("mongoose");

const homeRecommendedSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    chef: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
    badge: {
        type: String,
        default: "MasterClass"
    },
    duration: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        required: true
    },
    size: {
        type: String,
        enum: ["large", "wide", "small"],
        default: "small"
    },
    link: {
        type: String,
        default: "/all-courses"
    }
});

module.exports = mongoose.model("HomeRecommended", homeRecommendedSchema);