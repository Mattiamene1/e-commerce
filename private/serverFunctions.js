// Mongoose Models
const Address = require('./models/addressModel');
const Category = require('./models/categoryModel');
const Order = require('./models/orderModel');
const Product = require('./models/productModel');
const Return = require('./models/returnModel');
const User = require('./models/userModel');

// Export the functions
module.exports = {
    isLoggedIn,
    getUserById,
    getUserByEmail,
    getProductById,
};

function isLoggedIn(req, res, next) {
    req.user ? next() : res.status(401).redirect('./index.html');
}

async function getUserById(id) {
    try {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {       // Validate the MongoDB ObjectId format
            throw new Error('Invalid ID format');
        }

        const user = await User.findById(id)
        return user;
    } catch (error) {
        console.error('Error in getUserById:', error.message);
        throw new Error('Failed to fetch user');
    }
}

async function getUserByEmail(email) {
    try {
        const user = await User.findById(email)
        return user;
    } catch (error) {
        console.error('Error in getUserByEmail:', error.message);
        throw new Error('Failed to fetch user');
    }
}

async function getProductById(id) {
    try {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {       // Validate the MongoDB ObjectId format
            throw new Error('Invalid ID format');
        }

        const product = await Product.findById(id)
        return product;
    } catch (error) {
        console.error('Error in getProductById:', error.message);
        throw new Error('Failed to fetch products');
    }
}