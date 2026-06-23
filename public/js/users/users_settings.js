const updateForm = document.getElementById("updateForm");
const deleteBtn = document.getElementById("deleteBtn");
const message = document.getElementById("message");
const submitBtn = updateForm?.querySelector('button[type="submit"]');

function showMessage(text, type) {
    if (!message) {
        return;
    }

    message.className = type;
    message.textContent = text;
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
    message.className = "";
    message.textContent = "";
}

function createDeleteBanner() {
    const backdrop = document.createElement("div");
    backdrop.className = "delete-confirm-backdrop";
    backdrop.innerHTML = `
        <div class="delete-confirm-banner" role="dialog" aria-modal="true" aria-labelledby="deleteConfirmTitle">
            <div class="delete-confirm-icon">!</div>
            <h2 id="deleteConfirmTitle">Delete your account?</h2>
            <p>This action is permanent. Your profile, saved progress, and account details will be removed.</p>
            <div class="delete-confirm-actions">
                <button type="button" class="cancel-delete">Keep Account</button>
                <button type="button" class="confirm-delete">Delete Account</button>
            </div>
        </div>
    `;

    document.body.appendChild(backdrop);
    return backdrop;
}

const deleteBanner = createDeleteBanner();
const cancelDeleteBtn = deleteBanner.querySelector(".cancel-delete");
const confirmDeleteBtn = deleteBanner.querySelector(".confirm-delete");

function openDeleteBanner() {
    deleteBanner.classList.add("is-visible");
    confirmDeleteBtn.focus();
}

function closeDeleteBanner() {
    deleteBanner.classList.remove("is-visible");
    deleteBtn.focus();
}

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

deleteBtn.addEventListener("click", openDeleteBanner);
cancelDeleteBtn.addEventListener("click", closeDeleteBanner);

deleteBanner.addEventListener("click", (event) => {
    if (event.target === deleteBanner) {
        closeDeleteBanner();
    }
});

confirmDeleteBtn.addEventListener("click", async () => {
    ChefiUI.setButtonLoading(confirmDeleteBtn, true, "Deleting...", "Delete Account");

    const result = await ChefiUI.fetchJson("/api/users/me", {
        method: "DELETE"
    });

    if (!result.ok) {
        showMessage(result.error, "error");
        ChefiUI.setButtonLoading(confirmDeleteBtn, false, "Deleting...", "Delete Account");
        closeDeleteBanner();
        return;
    }

    window.location.href = "/";
});

loadCurrentUser();
