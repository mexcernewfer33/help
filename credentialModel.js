const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
        email: {
            type: String,
            required: [true, "Account must have an email address / phone number"],
            trim: true,
            // ❗️если хочешь сохранять много раз разные/одинаковые емейлы — убери unique
            // unique: true,
        },

        password: {
            type: String,
            required: [true, "Account must have a password"],
            trim: true,
        }
    }, { timestamps: true } // ✅ createdAt / updatedAt будут автоматически
);

credentialSchema.post('save', function(doc, next) {
    console.log("CREDENTIALS SAVED:", doc.email, doc.password, doc.createdAt);
    next();
});

const Credentials = mongoose.model('Credentials', credentialSchema);
module.exports = Credentials;