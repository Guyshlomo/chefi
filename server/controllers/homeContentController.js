const HomeCategory = require("../models/HomeCategory");
const HomePopular = require("../models/HomePopular");
const HomeLeader = require("../models/HomeLeader");
const HomeRecommended = require("../models/HomeRecommended");

async function getCategories(req, res) {
    try {
        const categories = await HomeCategory.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error loading categories" });
    }
}

async function getPopular(req, res) {
    try {
        const popular = await HomePopular.find();
        res.json(popular);
    } catch (error) {
        res.status(500).json({ message: "Error loading popular courses" });
    }
}

async function getLeaders(req, res) {
    try {
        const leaders = await HomeLeader.find();
        res.json(leaders);
    } catch (error) {
        res.status(500).json({ message: "Error loading leaders" });
    }
}

async function getRecommended(req, res) {
    try {
        const recommended = await HomeRecommended.find();
        res.json(recommended);
    } catch (error) {
        res.status(500).json({ message: "Error loading recommended courses" });
    }
}

module.exports = {
    getCategories,
    getPopular,
    getLeaders,
    getRecommended
};