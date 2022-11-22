const {Schema, model} = require('mongoose')

const atribut = new Schema({
    title: {
        type: String,
        required: true
    },
    subcategory: {
        type: Schema.Types.ObjectId,
        ref: 'Subcategory'
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


module.exports = model('Atribut',atribut)