const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    code: { type: String, required: true },
    timestamp: String,
    email: String,
    password: String
});

module.exports = mongoose.model("Otp", otpSchema);