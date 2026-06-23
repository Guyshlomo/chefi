const categoryContainer = document.getElementById("foodCategories");

async function loadCategories() {
    if (!categoryContainer) {
        return;
    }

    try {
        const response = await fetch("/api/home-content/categories");
        const categories = await response.json();

        categoryContainer.innerHTML = categories.map(category => {
            const searchValue = encodeURIComponent(category.name);

            return `
                <a href="/all-courses?search=${searchValue}">
                    <i class="${category.icon}"></i>
                    <span>${category.name}</span>
                </a>
            `;
        }).join("");
    } catch (error) {
        console.error("Error loading categories:", error);
        categoryContainer.innerHTML = `<p>Could not load categories</p>`;
    }
}

loadCategories();