// ./private/serverEndpoints.js
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


// Mongoose Models
const Address = require('./models/addressModel');
const Category = require('./models/categoryModel');
const Order = require('./models/orderModel');
const Product = require('./models/productModel');
const Return = require('./models/returnModel');
const User = require('./models/userModel');

const { 
    isLoggedIn,
    getUserById,
    getProductById,
} = require('./serverFunctions');

// *** USER endpoints ***

// - Create new User -
router.post('/user', async (req, res) => {
    try {
        const { name, surname, email } = req.body;

        if (!name || !surname || !email) {
            return res.status(400).json({ error: 'Name, surname, and email are required.' });
        }

        // Create a new User instance
        const newUser = new User({ name, surname, email, role: 'Standard' });
        console.log("Correctly added: " + newUser.name +" | " + newUser.surname + " | " + newUser.email + " | Role: " + newUser.role);

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating user.', details: error.message });
    }
});

// - Retrieve user query ID -
router.get('/User', async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ error: 'ID parameter is required.' });
        }

        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ error: `User [${id}] not found.` });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error retrieving user:', error.message);
        res.status(500).json({ error: 'Error retrieving user.', details: error.message });
    }
});

// - Retrieve User email address from Google Token -
router.get('/user/google', isLoggedIn, async (req, res) => {
    try {
        const googleUserEmail = {
            email: req.user.email
        }
        console.log("Email used - server side" + googleUserEmail.email);
        res.status(200).json(googleUserEmail);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Cannot retrieve profile information" }); // Send error response as JSON
    }
});



// - Retrieve product query ID -
router.get('/Product', async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: 'ID parameter is required.' });
        }

        const product = await getProductById(id);

        if (!product) {
            return res.status(404).json({ error: `Product [${id}] not found.` });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Error retrieving product:', error.message);
        res.status(500).json({ error: 'Error retrieving product.', details: error.message });
    }
});
// Export the router
module.exports = router;