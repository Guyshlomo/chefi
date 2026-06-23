window.ChefiUI = {
    escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    },

    statusMarkup(type, message) {
        return `<p class="ui-status ui-status--${type}" role="status">${this.escapeHtml(message)}</p>`;
    },

    setStatus(container, type, message) {
        if (!container) {
            return;
        }

        container.innerHTML = this.statusMarkup(type, message);
    },

    setElementStatus(element, type, message) {
        if (!element) {
            return;
        }

        element.hidden = false;
        element.className = `ui-status ui-status--${type}`;
        element.textContent = message;
        element.setAttribute("role", "status");
    },

    clearElementStatus(element) {
        if (!element) {
            return;
        }

        element.hidden = true;
        element.className = "ui-status";
        element.textContent = "";
        element.removeAttribute("role");
    },

    setButtonLoading(button, isLoading, loadingText, defaultText) {
        if (!button) {
            return;
        }

        button.disabled = isLoading;
        button.textContent = isLoading ? loadingText : defaultText;
    },

    lockBodyScroll(shouldLock) {
        document.body.classList.toggle("chefi-modal-open", Boolean(shouldLock));
    },

    ensureToastHost() {
        let host = document.getElementById("chefiToastHost");

        if (!host) {
            host = document.createElement("div");
            host.id = "chefiToastHost";
            host.className = "chefi-toast-host";
            host.setAttribute("aria-live", "polite");
            host.setAttribute("aria-atomic", "true");
            document.body.appendChild(host);
        }

        return host;
    },

    showToast(message, type = "success", duration = 4200) {
        const host = this.ensureToastHost();
        const toast = document.createElement("div");
        toast.className = `chefi-toast chefi-toast--${type}`;
        toast.setAttribute("role", "status");
        toast.textContent = message;
        host.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add("is-visible");
        });

        window.setTimeout(() => {
            toast.classList.remove("is-visible");
            window.setTimeout(() => toast.remove(), 220);
        }, duration);
    },

    ensureConfirmHost() {
        let host = document.getElementById("chefiConfirmHost");

        if (!host) {
            host = document.createElement("div");
            host.id = "chefiConfirmHost";
            host.className = "chefi-confirm-host";
            host.innerHTML = `
                <div class="chefi-confirm-backdrop" hidden>
                    <div class="chefi-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="chefiConfirmTitle">
                        <div class="chefi-confirm-icon" aria-hidden="true">!</div>
                        <h2 id="chefiConfirmTitle"></h2>
                        <p class="chefi-confirm-message"></p>
                        <div class="chefi-confirm-actions">
                            <button type="button" class="chefi-confirm-cancel">Cancel</button>
                            <button type="button" class="chefi-confirm-accept">Confirm</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(host);
        }

        return host;
    },

    showConfirm(options = {}) {
        const {
            title = "Are you sure?",
            message = "",
            confirmLabel = "Confirm",
            cancelLabel = "Cancel",
            confirmVariant = "danger"
        } = options;

        const host = this.ensureConfirmHost();
        const backdrop = host.querySelector(".chefi-confirm-backdrop");
        const titleEl = host.querySelector("#chefiConfirmTitle");
        const messageEl = host.querySelector(".chefi-confirm-message");
        const cancelBtn = host.querySelector(".chefi-confirm-cancel");
        const confirmBtn = host.querySelector(".chefi-confirm-accept");

        titleEl.textContent = title;
        messageEl.textContent = message;
        cancelBtn.textContent = cancelLabel;
        confirmBtn.textContent = confirmLabel;
        confirmBtn.className = `chefi-confirm-accept chefi-confirm-accept--${confirmVariant}`;

        backdrop.hidden = false;
        this.lockBodyScroll(true);
        cancelBtn.focus();

        return new Promise((resolve) => {
            const cleanup = (result) => {
                backdrop.hidden = true;
                this.lockBodyScroll(false);
                cancelBtn.removeEventListener("click", onCancel);
                confirmBtn.removeEventListener("click", onConfirm);
                backdrop.removeEventListener("click", onBackdropClick);
                document.removeEventListener("keydown", onKeyDown);
                resolve(result);
            };

            const onCancel = () => cleanup(false);
            const onConfirm = () => cleanup(true);
            const onBackdropClick = (event) => {
                if (event.target === backdrop) {
                    cleanup(false);
                }
            };
            const onKeyDown = (event) => {
                if (event.key === "Escape") {
                    cleanup(false);
                }
            };

            cancelBtn.addEventListener("click", onCancel);
            confirmBtn.addEventListener("click", onConfirm);
            backdrop.addEventListener("click", onBackdropClick);
            document.addEventListener("keydown", onKeyDown);
        });
    },

    async fetchJson(url, options = {}) {
        try {
            const response = await fetch(url, {
                credentials: "include",
                ...options
            });

            const contentType = response.headers.get("content-type") || "";
            let data = null;

            if (contentType.includes("application/json")) {
                data = await response.json();
            } else {
                const text = await response.text();
                data = text ? { message: text } : null;
            }

            if (!response.ok) {
                return {
                    ok: false,
                    data,
                    error: data?.message || "Something went wrong. Please try again."
                };
            }

            return {
                ok: true,
                data,
                error: null
            };
        } catch (error) {
            return {
                ok: false,
                data: null,
                error: "Network error. Please check your connection and try again."
            };
        }
    }
};
