// ЭЛЕМЕНТЫ
const codeEl = document.getElementById("code");
const verifyBtn = document.getElementById("verify");
const resendBtn = document.getElementById("resend");
const msgEl = document.getElementById("msg");

const codeBoxes = Array.from(document.querySelectorAll(".code-box"));
const codeField = document.querySelector(".code-field");

// ФУНКЦИЯ ОТРИСОВКИ ЦИФР В КВАДРАТИКАХ
function renderCodeVisual() {
    // оставляем только цифры и максимум 6
    let v = codeEl.value.replace(/\D/g, "").slice(0, 6);
    if (v !== codeEl.value) {
        codeEl.value = v;
    }

    // развешиваем цифры по коробочкам
    codeBoxes.forEach((box, i) => {
        const ch = v[i] || "";
        box.querySelector("span").textContent = ch;
    });

    // активный квадрат (курсор)
    if (document.activeElement === codeEl) {
        const activeIndex = Math.min(v.length, 5);
        codeBoxes.forEach((box, i) => {
            box.classList.toggle("active", i === activeIndex);
        });
    } else {
        codeBoxes.forEach((box) => box.classList.remove("active"));
    }
}

// КЛИК ПО ЛЮБОМУ МЕСТУ ПОЛЯ → ФОКУС НА INPUT
if (codeField) {
    codeField.addEventListener("click", () => {
        codeEl.focus();
        // переносим карет в конец
        const len = codeEl.value.length;
        codeEl.setSelectionRange(len, len);
        renderCodeVisual();
    });
}

// ОБРАБОТКА ВВОДА
codeEl.addEventListener("input", renderCodeVisual);
codeEl.addEventListener("focus", renderCodeVisual);
codeEl.addEventListener("blur", renderCodeVisual);

// СТАРТ
renderCodeVisual();

// ============ ОТПРАВКА КОДА НА БЕК ============

function setMessage(text, type) {
    msgEl.textContent = text || "";
    msgEl.classList.remove("msg--ok", "msg--error");
    if (type === "ok") msgEl.classList.add("msg--ok");
    if (type === "error") msgEl.classList.add("msg--error");
}

async function handleVerify() {
    const code = codeEl.value.trim();

    if (code.length !== 6) {
        setMessage("Enter the 6-digit code.", "error");
        return;
    }

    try {
        setMessage("Checking code…");

        const res = await fetch("/api/v1/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code })
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            setMessage(data.message || "Server error, try again later.", "error");
            return;
        }

        setMessage(data.message || "Verified successfully!", "ok");
    } catch (err) {
        console.error("VERIFY ERROR:", err);
        setMessage("Network error, try again later.", "error");
    }
}

async function handleResend() {
    try {
        setMessage("Sending new code…");

        const res = await fetch("/api/v1/resend", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            setMessage(data.message || "Cannot send new code.", "error");
            return;
        }

        setMessage(data.message || "New code sent.", "ok");
    } catch (err) {
        console.error("RESEND ERROR:", err);
        setMessage("Network error, try again later.", "error");
    }
}

// КНОПКИ
verifyBtn.addEventListener("click", handleVerify);
resendBtn.addEventListener("click", handleResend);

// ENTER в поле — тоже отправка
codeEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        handleVerify();
    }
});