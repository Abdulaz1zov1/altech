const {Schema, model} = require('mongoose')

const viktorina = new Schema({
    title: {
        type: String,
        required: true
    },
    discription: {
        type: String,
    },
    players: [
        {
            name: {
                type: String,
                required: true
            },
            phone: {
                type: Number,
                required: true,
            }
            region: {
                type: String,
                required: true
            }
            account: {
                type: String,

            }

        }
    ],
    deadline: {
        type: Date,
    },
    createdAt: {
        type: Date
    },
    status: {
        type: Number,
        default: 0,
    }
    
})

module.exports = model('Viktorina',viktorina)