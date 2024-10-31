// server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const user = require('./database');


const app = express();
const PORT = 3000;


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get('/signup', (req, res) => {
    // Handle the signup request here
    res.send('Signup page');
});
// Route for handling signup
app.post('/signup', async (req, res) => {
    const { name, email, password} = req.body;
    res.send("hello")
    
    const newUser = new user({
        name,
        email,
        password
    });

    try {
        await newUser.save();
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
app.listen(3000, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});