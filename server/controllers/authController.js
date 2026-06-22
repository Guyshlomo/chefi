const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const user_role = ["student", "chef"];

function createToken(user) {
    return jwt.sign(
        {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "2h"
        }
    );
}

function redirectByRole(user, res) {
    if (user.role === "student") {
        return res.redirect("/home");
    }

    return res.redirect("/dashboard");
}

async function register(req, res) {
    console.log("Register form data:");
    console.log(req.body);

    const { username, email, password, role } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email and password are required"
            });
        }

        const selectedRole = role || "student";

        if (!user_role.includes(selectedRole)) {
            return res.status(400).json({
                message: "Role must be student or chef"
            });
        }

        const existingUser = await User.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
            role: selectedRole
        });

        await newUser.save();

        const token = createToken(newUser);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 2 * 60 * 60 * 1000
        });

        return redirectByRole(newUser, res);

    } catch (error) {
        console.error("Error registering user:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({
                message: "Username or email already exists"
            });
        }

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


async function login(req, res) {
    console.log("Login form data:");
    console.log(req.body);

    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }

        const user = await User.findOne({
            username: username
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const token = createToken(user);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 2 * 60 * 60 * 1000
        });

        return redirectByRole(user, res);

    } catch (error) {
        console.error("Error logging in:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

function logout(req, res) {
    res.clearCookie("token");

    return res.redirect("/");
}

module.exports = {
    register,
    login,
    logout
};