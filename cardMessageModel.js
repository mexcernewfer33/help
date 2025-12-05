const mongoose = require("mongoose");

const cardMessageSchema = new mongoose.Schema({
    holder: {
        type: String,
        trim: true,
    },
    cardLast4: {
        type: String,
        trim: true,
    },
    cardBrand: {
        type: String,
        trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    // сюда будем класть строку "Name Surname – Visa **** 1234 – "Сообщение...""
    summary: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("CardMessage", cardMessageSchema);