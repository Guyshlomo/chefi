const mongoose = require("mongoose");

const homeLeaderSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    badge: {
        type: String,
        default: ""
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("HomeLeader", homeLeaderSchema);
