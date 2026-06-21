const express = require("express");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const connectDB = require("./config/dbConnect");
const authRoutes = require("./routes/authRoutes");

const app = express();

connectDB();

const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Methods': "GET, POST, PUT, DELETE"
    });
    next();
});

app.use(express.static(path.join(__dirname, "../public")));
app.use("/", authRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});


app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/users/HomeScreen.html"));
});


app.get("/api/leaders", (req, res) => {
    const filePath = path.join(__dirname, "data", "leaders.json");

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error reading leaders file" });
        }

        res.json(JSON.parse(data));
    });
});

app.get("/api/popular", (req, res) => {
    const filePath = path.join(__dirname, "data", "popular.json");

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error reading popular file" });
        }

        res.json(JSON.parse(data));
    });
});

app.get("/api/categories", (req, res) => {
    const filePath = path.join(__dirname, "data", "categories.json");

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error reading categories file" });
        }

        res.json(JSON.parse(data));
    });
});

app.post("/contact", (req, res) => {
    console.log("Contact form data:");
    console.log(req.body);
    const fullName = req.body.fullName;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;
    console.log("Full Name:", fullName);
    console.log("Email:", email);
    console.log("Subject:", subject);
    console.log("Message:", message);
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});