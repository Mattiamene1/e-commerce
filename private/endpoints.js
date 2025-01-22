// ./private/serverEndpoints.js
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Mongoose Models
const Address = require('./models/addressModel');
const Category = require('./models/categoryModel');
const Order = require('./models/orderModel');
const Product = require('./models/productModel');
const Return = require('./models/returnModel');
const User = require('./models/userModel');

const { 
    isLoggedIn,
    sendMail,
    getUserById,
    getUserByEmail,
    getProductById,
    getProductByCode,

    getCodeIncremental,
} = require('./serverFunctions');
const { ObjectId } = require('bson');


// ***************************************************
// ***************** USER endpoints ******************
// ***************************************************

// - Create new User -
router.post('/User', async (req, res) => {
    try {
        const { name, surname, email, mobile } = req.body;

        if (!name || !surname || !email) {
            return res.status(400).json({ error: 'Name, surname, and email are required.' });
        }

        const existingEmail = await User.findOne({ email: req.body.email });
        const existingMobile = await User.findOne({ mobile: req.body.mobile });

        if (existingMobile) {
            return res.status(401).json({ message: 'Mobile already used' });
        }else if (existingEmail) {
            return res.status(402).json({ error: 'Email already used' });
        }

        const newUser = new User({ name, surname, email, mobile, role: 'Standard' });
        console.log("New User:", newUser);

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error creating user.', details: error.message });
    }
});

// - Retrieve user query ID or Email -      http://localhost:3000/User?id=678164d5b599f8f435d2c71f  |   http://localhost:3000/User?email=meneghinmattia1@gmail.com
router.get('/User', async (req, res) => {
    try {
        const { id, email } = req.query;

        // If neither `id` nor `email` is provided, return an error
        if (!id && !email) {
            return res.status(400).json({ error: 'Either ID or Email parameter is required.' });
        }

        let user;

        if (id) {
            // If `id` is provided, fetch the user by ID
            user = await getUserById(id);
        } else if (email) {
            // If `email` is provided, fetch the user by Email
            user = await getUserByEmail(email);
        }

        if (!user) {
            return res.status(404).json({ error: `User not found.` });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error retrieving user:', error.message);
        res.status(500).json({ error: 'Error retrieving user.', details: error.message });
    }
});

// - Retrieve User email address from Google Token -
router.get('/User/Google', isLoggedIn, async (req, res) => {
    try {
        const googleUserEmail = {
            email: req.user.email
        }
        res.status(200).json(googleUserEmail);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Cannot retrieve profile information" }); // Send error response as JSON
    }
});

// - Retrieve product query ID or code -    http://localhost:3000/Product?id=YOUR_PRODUCT_ID | http://localhost:3000/Product?code=YOUR_PRODUCT_CODE
router.get('/Product', async (req, res) => {
    try {
        const { id, code } = req.query;

        if (!id && !code) {
            return res.status(400).json({ error: 'Either ID or Code parameter is required.' });
        }

        let product;

        if (id) {
            // If `id` is provided, fetch the product by ID
            product = await getProductById(id);
        } else if (code) {
            // If `code` is provided, fetch the product by Code
            product = await getProductByCode(code);
        }

        if (!product) {
            return res.status(404).json({ error: `Product not found.` });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Error retrieving product:', error.message);
        res.status(500).json({ error: 'Error retrieving product.', details: error.message });
    }
});

// - Retrieve User saved items -
router.get('/User/Saved', isLoggedIn, async (req, res) => {
    try{
        const user = await getUserByEmail('meneghinmattia1@gmail.com');             // DA CAMBIARE req.user.email
        console.log(" -> " + user.name);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        console.log("Items saved for " + user.email);
        console.log("List: ", user.saved);
        console.log(await getProductById(user.saved[0]._id));
        
        // Return the saved products' IDs or any relevant data from the saved list
        res.status(200).json(user.saved);
    } catch (error) {
        console.error('Error retrieving saved items:', error);
        res.status(500).json({ error: 'Cannot retrieve saved items' }); // Send error response as JSON
    }
});

// - Add an item to saved item -
router.put('/User/Saved/:productID', async (req, res) => {
    try {
        const { productID } = req.params;
        const user = await getUserByEmail('meneghinmattia1@gmail.com');             // DA CAMBIARE req.user.email
        console.log("user id: " + user._id);
        console.log(await getProductById(productID));
        console.log("product " + await getProductById(productID).name + " with id: " + productID);

        // Check if the product exists in the Product collection
        const product = await Product.findById(productID);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Find the user by ID and update the saved array
        const userUpdate = await User.findByIdAndUpdate(
            user._id,
            { $addToSet: { saved: new mongoose.Types.ObjectId(productID) } }, // $addToSet adds the product ID only if it does not already exist
            { new: true } // Return the updated user document
        );

        if (!userUpdate) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ message: 'Product saved successfully', userUpdate });
    } catch (error) {
        console.error('Error adding product to saved:', error);
        res.status(500).json({ error: 'Error adding product to saved array', details: error.message });
    }
});
// ************************** END USER SECTION **************************//
// **********************************************************************//



// **********************************************************************//
// ************************ START PRODUCT SECTION ***********************//
// - Create new Product -
router.post('/Product', async (req, res) => {
    try {
        const { name, 
                description,    // Required
                images,         // Required
                code,           // Required
                stock,          // Required 
                price,          // Required
                sale,
                currency,
                color,
                tags,
                topCategory,
                subCategory,
                notes
            } = req.body;

        if (!name || !description || !images || !code || !stock || !price) {
            return res.status(400).json({ error: 'Name, Description, Images, Code, Stock and Price are required.' });
        }

        const existingCode = await Product.findOne({ code: req.body.code });
        if (existingCode) {
            return res.status(401).json({ message: 'Code already used' });
        }

        const newProduct = new Product({ name, description, images, code, stock, price, sale: 0 });
        console.log("New Product:", newProduct);

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error creating product.', details: error.message });
    }
});

router.get('/Product', async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).json({ error: 'Product code is required.' });
        }

        const product = await Product.findOne({ code});
        console.log("+" + product);
        if (!product) {
            return res.status(404).json({ error: `Product not found.\n Code: ${req.query.code}` });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'An error occurred while fetching the product.' });
    }
});

/// Get all the info about the user profile logged
app.get('/user/profile', isLoggedIn, async (req, res) => {
    try {
        const mongoUser = await Person.findOne({ email: req.user.email }); // Get user info from Mongo

        const profileInfo = {
            _id: mongoUser._id,
            name: mongoUser.name,
            surname: mongoUser.surname,
            email: req.user.email,
            mobile: mongoUser.mobile,
            role: mongoUser.role,
            addresses: mongoUser.addresses,
            cart: mongoUser.cart,
            saved: mongoUser.saved,
            orders: mongoUser.orders,
            return: mongoUser.returns
        }
        res.status(200).json(profileInfo); // Send response as JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Cannot retrieve profile information" }); // Send error response as JSON
    }
});













// Export the router
module.exports = router;