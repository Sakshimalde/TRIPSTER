// server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const user = require('./database');
const session = require('express-session');
const path = require('path');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const storage = multer.memoryStorage(); // Store files in memory; you might want to adjust this
const upload = multer({ storage: storage });
const app = express();
const PORT = 3000;
// const jwtSecret = '12345678910';
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

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
        
        if (User) {
            if (User.password == data.password) {
                app.get(`/dashboard/${User._id}`, (req, res) => {
                    res.sendFile('dashboard.html',{root: __dirname});
                  });
                req.session.userId = User._id;
                console.log(req.session.userId)
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
app.post('/api/update-profile', upload.single('profilePicture'), async (req, res) => {
    const { fullName, username, location, bio } = req.body;

    const userId =req.session.userId;   
    console.log(userId)

    if (!userId) {
        return res.status(401).json({ message: 'User  not authenticated' });
    }

    try {
        const updatedUser  = await user.findByIdAndUpdate(userId, {
            fullName,
            username,
            location,
            bio,
        }, { new: true });

        if (!updatedUser ) {
            return res.status(404).json({ message: 'User  not found' });
        }


        res.status(200).json({
            message:"user updated"
        } );
    } catch (error) {
        console.error('Error updating profile', error.message); // Log the error message
        console.error(error.stack); // Log the stack trace for more context
        res.status(400).json({ message: 'Error updating profile', error: error.message });
    }
    
});

app.post('/api/user/trip', async (req, res) => {
    const userId = req.session.userId;
    const tripData = req.body; 

    try {
        
        if (!userId) {
            return res.status(401).json({ message: 'User  not authenticated' });
        }
        console.log('Trip Data:', tripData);
        // Use findByIdAndUpdate with $push to add the tripData to the trips array
        const usertrip  = await user.findByIdAndUpdate(
            userId,
            { $push: { trips: tripData } }, // Push the new trip data
            { new: true } 
        );

        // Check if the user was found
        if (!usertrip ) {
            return res.status(404).json({ message: 'User  not found' });
        }

        // Respond with the updated user data (optional)
        res.status(201).json(usertrip.trips);
    } catch (error) {
        console.error('Error adding trip details:', error.message);
        console.error(error.stack);
        res.status(400).json({ message: 'Error adding trip details', error: error.message });
    }
});


// Start the server
app.listen(3000, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});