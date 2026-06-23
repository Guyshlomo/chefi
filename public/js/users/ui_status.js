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

    setButtonLoading(button, isLoading, loadingText, defaultText) {
        if (!button) {
            return;
        }

        button.disabled = isLoading;
        button.textContent = isLoading ? loadingText : defaultText;
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
