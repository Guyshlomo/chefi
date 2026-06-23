function renderRecipeInspiration(recipes) {
    const recipeGrid = document.getElementById("recipeGrid");

    recipeGrid.innerHTML = recipes.map(recipe => {
        return `
            <div class="recipe-card">
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">

                <div class="recipe-card-content">
                    <span>${recipe.strCategory}</span>
                    <h3>${recipe.strMeal}</h3>
                    <p>${recipe.strArea} cuisine</p>
                    <a class="recipe-open-btn" href="/meal-detail?id=${recipe.idMeal}">View Course</a>
                </div>
            </div>
        `;
    }).join("");
}

function loadRecipeInspiration() {
    fetch("/api/recipe-inspiration")
        .then(response => response.json())
        .then(recipes => {
            renderRecipeInspiration(recipes);
        })
        .catch(error => {
            console.error("Error loading recipe inspiration:", error);
        });
}

const refreshRecipesBtn = document.getElementById("refreshRecipesBtn");

if (refreshRecipesBtn) {
    refreshRecipesBtn.addEventListener("click", loadRecipeInspiration);
}

loadRecipeInspiration();