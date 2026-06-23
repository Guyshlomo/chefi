const mongoose = require("mongoose");

const homePopularSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    chef: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        default: "★★★★"
    },
    reviews: {
        type: String,
        default: "0"
    },
    badge: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("HomePopular", homePopularSchema);