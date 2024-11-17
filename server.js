// server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const user = require('./database');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

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


// Start the server
app.listen(3000, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});