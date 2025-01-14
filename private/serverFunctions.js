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
    getProductByCode,
    sendMail,

    getCodeIncremental,                 // Look into db the greathest code and return it incremented by 1 (eg if the gratehest is 156 it return 157)

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
        const user = await User.findOne({ email: email });
        return user;
    } catch (error) {
        console.error('Error in getUserByEmail:', error.message);
        throw new Error('Failed to fetch user');
    }
}

async function getProductById(id) {
    try {
        const product = await Product.findById(id);
        return product;
    } catch (error) {
        console.error('Error in getProductById:', error.message);
        throw new Error('Failed to fetch products');
    }
}

async function getProductByCode(code){
    try {
        const product = await User.findOne({ code: code });
        return product;
    } catch (error) {
        console.error('Error in getProductByCode:', error.message);
        throw new Error('Failed to fetch product');
    }
}

async function getCodeIncremental() {
    try {
        // Find the product with the highest code in the Product collection
        const lastProduct = await Product.findOne().sort({ code: -1 }).limit(1);
        
        // If no product is found, return a default value (e.g., "000000")
        if (!lastProduct) {
            return '000000';
        }

        // Return the highest code (if found)
        return lastProduct.code + 1;
    } catch (error) {
        console.error('Error in getCodeIncremental:', error.message);
        throw new Error('Failed to fetch product code');
    }
}
/*
- _from : mail of the sender                '"Your Name" <youremail@gmail.com>'
- _to: emails of the receiver (list)        "receiverone@gmail.com, receivertwo@outlook.com"  https://node-corefit-prod.hetzner.giacomostuff.it/assets/
- _subject  
*/
function sendMail(_from, _to, _subject, _text){
    transporter.sendMail({
        from: _from,
        to: _to,
        subject: _subject,
        text: _text,
        html: `
                <b>Questa email è generata automaticamente dal server. Non rispondere, grazie!</b>
                </br>
                <a href="http://localhost:3000/">Visita il nostro sito.</a>
                </br>
                <div style="font-family: Arial, sans-serif;">
                    <p>${_text}</p>
                    </br>
                    <div style="font-family: Arial, sans-serif;">
                        <table width="auto" cellspacing="0" cellpadding="0">
                        <tr>
                            <td style="text-align: left; padding-right: 2px;">
                            <img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fit.freepik.com%2Ffoto-vettori-gratuito%2Fe-commerce-logo&psig=AOvVaw0We1-Rtgy6N-qxO5po8Fqk&ust=1736514198841000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJDR79DZ6IoDFQAAAAAdAAAAABAE" alt="corefit" style="max-width: 150px; margin-right: 0px;">
                            </td>
                            <td style="padding-left: 2px;">
                            <p style="font-size: 15px; color:rgb(55, 148, 255); margin: 0; font-family: Audiowide;"><strong> E-Commerce </strong></p>
                            <p style="font-size: 12px; color: #555555; margin: 0;"> 3401365894</p>
                            <p style="font-size: 12px; color: #555555; margin: 0;"> info@gmail.com</p>
                            <p style="font-size: 12px; color: #555555; margin: 0;"><a href="http://localhost:3000/" style="color: #0353e7; text-decoration: none;"> <u>asdcorefit.it</u></a></p>
                            </td>
                        </tr>
                        </table>
                    </div>
                </div>
            `
    }).catch(console.error);
}