const {Schema, model} = require('mongoose')
const user = new Schema({
    name: {
        type: String,
    },
    phone: {
        type: Number,
        unique: true,
    },
    password: {
        type: String,
    },
    email: { 
        type: String,
    },
    role: {
        type: Number,
        default: 0,
        // 0 -> superAdmin
        // 1 -> цех
        // 2 -> склад
        // 3 -> ритейлер
        // 4 -> субритейлер
    },
    gender: {
        type: Number,
        default: 0,
    },
    telegram: String,
    instagram: String,
    facebook: String
})
module.exports = model('User',user)