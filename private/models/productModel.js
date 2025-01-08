const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        images: [{
            type: String,
            required: true
        }],
        code:{
            type: String,
            required: true
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        },
        price: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        },
        sale: {
            type: Number,
            default: 0,
            min: 0,
        },
        currency: {
            type: String,
            default: 'EUR',
        },
        color: {
            type: String,
        },
        tags : [{
            type: String,
        }],
        topCategory: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Category'
        },
        subCategory: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Category' 
        },
        notes: {
            type: String
        }
    }
)

const Product = mongoose.model('Product', ProductSchema);

module.exports  = Product;