const {Schema, model} = require('mongoose')

const brand = new Schema({
    title: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 0,
    },
    order: {
        type: Number,
        default: 0,
    },
    img:String,
    home:Number,
    top:Number
})


module.exports = model('Brand',brand)