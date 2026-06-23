const recipeGrid = document.getElementById("recipeGrid");
const refreshRecipesBtn = document.getElementById("refreshRecipesBtn");

function renderRecipeInspiration(recipes) {
    if (!recipeGrid) {
        return;
    }

    if (!Array.isArray(recipes) || recipes.length === 0) {
        ChefiUI.setStatus(recipeGrid, "empty", "No meal ideas available right now. Try refreshing.");
        return;
    }

    recipeGrid.innerHTML = recipes.map((recipe) => `
        <div class="recipe-card">
            <img src="${ChefiUI.escapeHtml(recipe.strMealThumb)}" alt="${ChefiUI.escapeHtml(recipe.strMeal)}">
            <div class="recipe-card-content">
                <span>${ChefiUI.escapeHtml(recipe.strCategory)}</span>
                <h3>${ChefiUI.escapeHtml(recipe.strMeal)}</h3>
                <p>${ChefiUI.escapeHtml(recipe.strArea)} cuisine</p>
                <a class="recipe-open-btn" href="/meal-detail?id=${ChefiUI.escapeHtml(recipe.idMeal)}">View Course</a>
            </div>
        </div>
    `).join("");
}

async function loadRecipeInspiration() {
    if (!recipeGrid) {
        return;
    }

    ChefiUI.setStatus(recipeGrid, "loading", "Loading meal ideas...");
    ChefiUI.setButtonLoading(refreshRecipesBtn, true, "Refreshing...", "Refresh");

    const result = await ChefiUI.fetchJson("/api/recipes/recipe-inspiration");

    ChefiUI.setButtonLoading(refreshRecipesBtn, false, "Refreshing...", "Refresh");

    if (!result.ok) {
        ChefiUI.setStatus(recipeGrid, "error", result.error);
        return;
    }

    renderRecipeInspiration(result.data);
}

if (refreshRecipesBtn) {
    refreshRecipesBtn.addEventListener("click", loadRecipeInspiration);
}

loadRecipeInspiration();
