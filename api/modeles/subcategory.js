const {Schema, model} = require('mongoose')

const subcategory = new Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    status: {
        type: Number,
        default: 0,
    },
    order: {
        type: Number,
        default: 0,
    },

})


module.exports = model('Subcategory',subcategory)