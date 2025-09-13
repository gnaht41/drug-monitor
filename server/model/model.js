const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    dosage: {
        type: String,
        required: true,
    },
    card: {
        type: Number,
        required: true
    },
    pack: {
        type: Number,
        required: true
    },
    perDay: {
        type: Number,
        required: true,
        // unique: true
    },
})

const DrugDB = mongoose.model('drugs', schema);

module.exports = DrugDB;