const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema(
    {
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

const Order = mongoose.model('Order', OrderSchema);

module.exports  = Order;