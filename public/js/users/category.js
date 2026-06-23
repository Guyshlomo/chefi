const categoryContainer = document.getElementById("foodCategories");

async function loadCategories() {
    if (!categoryContainer) {
        return;
    }

    ChefiUI.setStatus(categoryContainer, "loading", "Loading categories...");

    const result = await ChefiUI.fetchJson("/api/categories");

    if (!result.ok) {
        ChefiUI.setStatus(categoryContainer, "error", result.error);
        return;
    }

    if (!Array.isArray(result.data) || result.data.length === 0) {
        ChefiUI.setStatus(categoryContainer, "empty", "No categories available right now.");
        return;
    }

    categoryContainer.innerHTML = result.data.map((category) => {
        const searchValue = encodeURIComponent(category.name);

        return `
            <a href="/all-courses?search=${searchValue}">
                <i class="${ChefiUI.escapeHtml(category.icon)}"></i>
                <span>${ChefiUI.escapeHtml(category.name)}</span>
            </a>
        `;
    }).join("");
}

loadCategories();
