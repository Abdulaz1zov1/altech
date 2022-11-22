const {Schema, model} = require('mongoose')

const spending = new Schema({
    title: {
        type: String,
        required: true
    },
    discription: {
        type: String,
        
    },
    summa: {
        type: Number,
        required: true
    },
    data: Date,
    currency: {
        type: String,
        default: 0
    }
})


module.exports = model('Spending',spending)