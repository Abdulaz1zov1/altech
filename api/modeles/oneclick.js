const {Schema, model} = require('mongoose')

const oneclick = new Schema({
    phone: {
        type: String,
        required: true,
    },
    name:String,
    address:String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    date:[Date],
    status: {
        type: Number,
        default: 0,
    },
    product:{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }
})

// cart model
// name
// phone
// address
// products []
// createdAt
// status

module.exports = model('Oneclick',oneclick)