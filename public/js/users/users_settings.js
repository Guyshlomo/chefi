const updateForm = document.getElementById("updateForm");
const deleteBtn = document.getElementById("deleteBtn");
const message = document.getElementById("message");

function showMessage(text, type) {
    message.className = type;
    message.textContent = text;
}

async function getResponseData(response) {
    try {
        return await response.json();
    } catch (error) {
        return { message: response.ok ? "Action completed successfully." : "Something went wrong." };
    }
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

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            username,
            email,
            password
        })
    });

    const data = await getResponseData(response);

    if (response.ok) {
        showMessage(data.message, "success");
    } else {
        showMessage(data.message, "error");
    }
});

deleteBtn.addEventListener("click", openDeleteBanner);

cancelDeleteBtn.addEventListener("click", closeDeleteBanner);

deleteBanner.addEventListener("click", (event) => {
    if (event.target === deleteBanner) {
        closeDeleteBanner();
    }
});

confirmDeleteBtn.addEventListener("click", async () => {
    confirmDeleteBtn.disabled = true;
    confirmDeleteBtn.textContent = "Deleting...";

    const response = await fetch("/api/users/me", {
        method: "DELETE",
        credentials: "include"
    });

    const data = await getResponseData(response);

    if (response.ok) {
        window.location.href = "/";
    } else {
        showMessage(data.message, "error");
        confirmDeleteBtn.disabled = false;
        confirmDeleteBtn.textContent = "Delete Account";
        closeDeleteBanner();
    }
});