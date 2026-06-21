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

module.exports = requireAuth;