const {Schema, model} = require('mongoose')

const page = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 1,
    },
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    menu: Number
})


module.exports = model('Page',page)