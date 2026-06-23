const mongoose = require("mongoose");

const homeCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("HomeCategory", homeCategorySchema);