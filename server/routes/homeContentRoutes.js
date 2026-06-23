const express = require("express");
const router = express.Router();

const homeContentController = require("../controllers/homeContentController");

router.get("/categories", homeContentController.getCategories);
router.get("/popular", homeContentController.getPopular);
router.get("/leaders", homeContentController.getLeaders);
router.get("/recommended", homeContentController.getRecommended);

module.exports = router;