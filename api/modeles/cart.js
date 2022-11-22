const {Schema, model} = require('mongoose')

const cart = new Schema({
    name: {
        type: String,
        required: true
    },
    adress: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: Number,
        default: 0,
    },
    product:[{
        id: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        count: {
            type: Number
        }
    }]
    
})

// cart model
// name
// phone
// address
// products []
// createdAt
// status

module.exports = model('Cart',cart)