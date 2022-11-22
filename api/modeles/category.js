const {Schema, model} = require('mongoose')

const category = new Schema({
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
    icon:String,
})


module.exports = model('Category',category)