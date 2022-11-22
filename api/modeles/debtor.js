const {Schema, model} = require('mongoose')

const debtor = new Schema({
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
    createdAt: Date,
    currency: {
        type: String,
        default: 0
    }
})


module.exports = model('Debtor',debtor)