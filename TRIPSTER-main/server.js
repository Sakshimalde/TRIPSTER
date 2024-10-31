// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('/server',{root:__dirname});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/tripster', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Route for handling signup
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    // Create a new user
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const newUser  = new User({
        name,
        email,
        password: hashedPassword
    });

    try {
        await newUser .save();
        res.status(201).send('User  created successfully!');
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error
            return res.status(400).send('Email already exists.');
        }
        res.status(500).send('Error creating user: ' + error.message);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});