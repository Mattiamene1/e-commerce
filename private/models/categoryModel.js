const mongoose = require('mongoose')

const CategorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        tags: [{
            type: String
        }]
    }
)

const Category = mongoose.model('Category', CategorySchema);

module.exports  = Category;