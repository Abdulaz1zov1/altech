const {Schema, model} = require('mongoose')

const ads = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    sale: {
        type: Number,
        default: 0
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }, 
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    place: {
        type: String,
        required: true,
    },
    img: String,
    status: {
        type: Number,
        default: 0,
    },
    state: {
        type: Number,
        default: 0,
    },
    seller: {
        type: Number,
        default: 0,
    },
    stock: {
        type: Number,
        default: 0,
    },
    currency: {
        type: Number,
        default: 0,
    },
    comments: {
        type: Array,
        required:false,
        default: []
    },
    views: Number,
    text:{
        type:String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    endAt: {
        type: Date,
        default: Date.now()
    },
})

module.exports = model('Ads',ads)