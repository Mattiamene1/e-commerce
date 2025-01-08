const mongoose = require('mongoose');

const ReturnSchema = mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Order',
            required: true 
        },
        user: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            required: true 
        },
        products:  [{ 
            product:{ 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Product',
                required: true
            }
        }],
        shippingDate: {
            type: Date
        },
        estimatedShippingDate: {
            type: Date
        },
        notes: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

const Return = mongoose.model('Return', ReturnSchema);

module.exports  = Return;