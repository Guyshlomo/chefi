const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController");

router.get("/me", requireAuth, (req, res) => {
    res.json(req.user);
});

router.put("/me", requireAuth, userController.updateMe);
router.delete("/me", requireAuth, userController.deleteMe);

module.exports = router;