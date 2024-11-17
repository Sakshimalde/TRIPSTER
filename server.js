// server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const user = require('./database');
const session = require('express-session');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const jwtSecret = '12345678910';

app.use(express.static(path.join(__dirname, 'public')));
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get('/signup', (req, res) => {
    // Handle the signup request here
    res.send('Signup page');
});
// Route for handling signup
app.post('/signup', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    const newUser = new user({
        name,
        email,
        password,
        confirmPassword
    });

    try {
        await newUser.save();
        res.status(201).send('User  created successfully!');
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).send('Email already exists.');
        }
        res.status(500).send('Error creating user: ' + error.message);
    }
});



app.post('/login', async (req, res) => {
    try {
        const data = req.body;
        let User = await user.findOne({ email: data.email });
        app.get(`/dashboard/${User._id}`, (req, res) => {
            res.sendFile('dashboard.html',{root: __dirname});
          });
        if (User) {
            if (User.password == data.password) {
                // console.log("user id", User._id)
                const token = jwt.sign({ id: User._id }, jwtSecret);
                return res.redirect(`http://localhost:3000/dashboard/${User._id}`);
            }
            else {
                return res.json({
                    message: 'wrong credentials'
                })
            }
        }
        else {
            return res.json({
                message: 'user not found'
            })
        }
    }
    catch(err) {
        return res.json({
            message:err.message
        })

    }
})
app.post('/api/update-profile', async (req, res) => {
    const { fullName, username, email, location, bio } = req.body;

    // Assume userId is obtained after login
    const userId = req.id; // Replace with actual user ID from session or token

    try {
        const updatedUser  = await user.findByIdAndUpdate(userId, {
            fullName,
            username,
            email,
    
            bio
        }, { new: true });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error });
    }
});

// Start the server
app.listen(3000, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});