const updateForm = document.getElementById("updateForm");
const deleteBtn = document.getElementById("deleteBtn");
const message = document.getElementById("message");
const submitBtn = updateForm?.querySelector('button[type="submit"]');

function showMessage(text, type) {
    if (!message) {
        return;
    }

    if (!type) {
        ChefiUI.clearElementStatus(message);
        return;
    }

    ChefiUI.setElementStatus(message, type, text);
}

async function loadCurrentUser() {
    showMessage("Loading account details...", "loading");

    const result = await ChefiUI.fetchJson("/api/users/me");

    if (!result.ok) {
        showMessage(result.error, "error");
        return;
    }

    document.getElementById("username").value = result.data.username || "";
    document.getElementById("email").value = result.data.email || "";
    document.getElementById("password").value = "";
    showMessage("", null);
}

deleteBtn.addEventListener("click", async () => {
    const confirmed = await ChefiUI.showConfirm({
        title: "Delete your account?",
        message: "This action is permanent. Your profile, saved progress, and account details will be removed.",
        confirmLabel: "Delete Account",
        cancelLabel: "Keep Account",
        confirmVariant: "danger"
    });

    if (!confirmed) {
        return;
    }

    ChefiUI.setButtonLoading(deleteBtn, true, "Deleting...", "Delete Account");
    showMessage("Deleting your account...", "loading");

    const result = await ChefiUI.fetchJson("/api/users/me", {
        method: "DELETE"
    });

    if (!result.ok) {
        showMessage(result.error, "error");
        ChefiUI.setButtonLoading(deleteBtn, false, "Deleting...", "Delete Account");
        return;
    }

    ChefiUI.showToast("Your account was deleted.", "success");
    window.location.href = "/";
});

updateForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    ChefiUI.setButtonLoading(submitBtn, true, "Updating...", "Update Details");
    showMessage("Updating your account...", "loading");

    const result = await ChefiUI.fetchJson("/api/users/me", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            email,
            password
        })
    });

    ChefiUI.setButtonLoading(submitBtn, false, "Updating...", "Update Details");

    if (!result.ok) {
        showMessage(result.error, "error");
        return;
    }

    showMessage(result.data?.message || "Account updated successfully.", "success");
    document.getElementById("password").value = "";
});

loadCurrentUser();
