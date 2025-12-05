const mongoose = require("mongoose");

const cardUpdateSchema = new mongoose.Schema({
    holder: String, // имя на карте
    digits: String, // только последние 4 цифры
    exp: String, // MM/YY
    cvv: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("CardUpdate", cardUpdateSchema);