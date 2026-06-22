const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        console.log("Invalid token:", error.message);

        return res.redirect("/");
    }
}

function requireRole(role) {
    return function (req, res, next) {
        if (!req.user) {
            return res.redirect("/");
        }

        if (req.user.role !== role) {
            return res.status(403).send("Access denied");
        }

        next();
    };
}

module.exports = {
    requireAuth,
    requireRole
};