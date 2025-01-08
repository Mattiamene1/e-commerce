const mongoose = require('mongoose')

const AddressSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            required: true 
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        cap: {
            type: String,
            required: true
        },
        number: {
            type: Number,
            required: true
        },
        notes: {
            type: String
        }
    }
)

const Address = mongoose.model('Address', AddressSchema);

module.exports  = Address;