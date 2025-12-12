const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.log("DB Error: ", err));


const Food = require("./models/Food");


const user = {
    username: "admin",
    password: "$2a$10$3jhTnGg9l5gjNqX1A9u8p.aV8f.cbbFz3isr3qiOyQ6GGkULxctTC"  // hashed "admin123"
};


app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (username !== user.username)
        return res.status(400).json({ msg: "Invalid Username" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
        return res.status(400).json({ msg: "Invalid Password" });

    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: "1h"
    });

    res.json({ msg: "Login Success", token });
});




app.post("/food", async (req, res) => {
    try {
        const food = new Food(req.body);
        await food.save();
        res.json({ msg: "Food Added", food });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get("/food", async (req, res) => {
    const items = await Food.find();
    res.json(items);
});


app.put("/food/:id", async (req, res) => {
    const item = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ msg: "Food Updated", item });
});


app.delete("/food/:id", async (req, res) => {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ msg: "Food Deleted" });
});




app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
);
