const {Schema, model} = require('mongoose')

const product = new Schema({
    title: {
        type: String,
        required: true
    },
    subcategory: {
        type: Schema.Types.ObjectId,
        ref: 'Subcategory'
    },
    photos:[
        String
    ],
    price: {
        type: Number,
        default: 0,
    },
    atribut:[{
        atr:{
            type: Schema.Types.ObjectId,
            ref: 'Atribut'
        },
        spec: {
            type: String,
        }
    }],
    status: {
        type: String,
        default: 0,
    },
    order: {
        type: Number,
        default: 0,
    },
    brend: {
        type: Schema.Types.ObjectId,
        ref: 'Brand'
    },
    sale:{
        type:Number,
        default:0
    },
    descriptions: String
})


module.exports = model('Product',product)