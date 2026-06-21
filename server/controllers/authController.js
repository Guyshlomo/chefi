const User = require("../models/User");
const bcrypt = require("bcryptjs");

async function register(req, res) {
  console.log("Register form data:");
  console.log(req.body);
  const { username, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({
        $or: [
        { email: email },
        { username: username }
        
      ]
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
      role: role
    });
    
    await newUser.save();
    res.status(301).redirect(`/home?username=${encodeURIComponent(username)}`);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  register
};


async function login(req, res) {
  console.log("Login form data:");
  console.log(req.body);
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(301).redirect(`/home?username=${encodeURIComponent(username)}`);
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  register,
  login
};