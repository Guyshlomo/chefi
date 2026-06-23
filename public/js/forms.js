const container = document.querySelector(".container");
const registerBtn = document.querySelector(".register-btn");
const loginBtn = document.querySelector(".login-btn");
const loginForm = document.querySelector(".form-box.login form");
const registerForm = document.querySelector(".form-box.register form");
const loginSubmitBtn = loginForm?.querySelector('button[type="submit"]');
const registerSubmitBtn = registerForm?.querySelector('button[type="submit"]');

function ensureAuthStatus(formBox) {
    let status = formBox.querySelector(".auth-status");

    if (!status) {
        status = document.createElement("p");
        status.className = "auth-status ui-status";
        status.hidden = true;
        formBox.appendChild(status);
    }

    return status;
}

function showAuthMessage(formBox, message, type) {
    const status = ensureAuthStatus(formBox);

    if (!type) {
        ChefiUI.clearElementStatus(status);
        return;
    }

    ChefiUI.setElementStatus(status, type, message);
}

registerBtn.addEventListener("click", () => {
    container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
    container.classList.remove("active");
});

function selectChios(element, role) {
    document.querySelectorAll(".student-chios, .chef-chios").forEach(function (card) {
        card.classList.remove("selected");
    });

    element.classList.add("selected");
    document.getElementById("roleInput").value = role;
}

async function submitAuthForm(form, formBox, submitButton, loadingText, defaultText) {
    const formData = new FormData(form);

    ChefiUI.setButtonLoading(submitButton, true, loadingText, defaultText);
    showAuthMessage(formBox, "Please wait...", "loading");

    try {
        const response = await fetch(form.getAttribute("action"), {
            method: "POST",
            body: new URLSearchParams(formData),
            credentials: "include"
        });

        if (response.redirected) {
            window.location.href = response.url;
            return;
        }

        const contentType = response.headers.get("content-type") || "";
        let data = { message: "Something went wrong. Please try again." };

        if (contentType.includes("application/json")) {
            data = await response.json();
        }

        showAuthMessage(formBox, data.message, "error");
    } catch (error) {
        showAuthMessage(formBox, "Network error. Please try again.", "error");
    } finally {
        ChefiUI.setButtonLoading(submitButton, false, loadingText, defaultText);
    }
}

if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        submitAuthForm(loginForm, loginForm.closest(".form-box"), loginSubmitBtn, "Signing in...", "login");
    });
}

if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        submitAuthForm(registerForm, registerForm.closest(".form-box"), registerSubmitBtn, "Creating account...", "Register");
    });
}

window.selectChios = selectChios;
