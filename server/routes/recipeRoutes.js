const express = require("express");
const router = express.Router();

router.get("/recipe-inspiration", async (req, res) => {
    try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=a");
        const data = await response.json();

        const meals = data.meals || [];
        const randomMeals = meals
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);

        res.json(randomMeals);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error loading recipe inspiration" });
    }
});

router.get("/recipe/:id", async (req, res) => {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${req.params.id}`);
        const data = await response.json();
        const meal = data.meals?.[0] || null;

        if (!meal) {
            return res.status(404).json({ message: "Meal not found" });
        }

        res.json(meal);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error loading meal detail" });
    }
});

module.exports = router;