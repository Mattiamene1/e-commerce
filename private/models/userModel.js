const mongoose = require('mongoose')

const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        surname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        mobile: {
            type: String,
            required: false
        },
        role: { 
            type: String, 
            enum: ['Standard', 'Admin'],
            default: 'Standard',
            required: true
        },
	    addresses: [{
            address: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Address',
            },
            notes: {
                type: String
            }
        }],
        cart: [{ 
            product: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Product' 
            }
        }],
        saved: [{ 
            product: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Product' 
            }
        }],
        orders: [{ 
            order: { 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Order'
            } 
        }],
        returns: [{ 
            order: { 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Return'
            } 
        }]
    },
    {
        timestamps: true
    }
)

const User = mongoose.model('user', UserSchema);

module.exports  = User;