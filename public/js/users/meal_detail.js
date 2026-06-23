const courseTitle = document.getElementById("courseTitle");
const courseChef = document.getElementById("courseChef");
const coursePrice = document.getElementById("coursePrice");
const sidebarPrice = document.getElementById("sidebarPrice");
const courseImage = document.getElementById("courseImage");
const courseDescription = document.getElementById("courseDescription");
const courseDuration = document.getElementById("courseDuration");
const courseCategory = document.getElementById("courseCategory");
const curriculumList = document.getElementById("curriculumList");
const previewPlayBtn = document.getElementById("previewPlayBtn");
const previewDuration = document.getElementById("previewDuration");
const startLearningBtn = document.getElementById("startLearningBtn");
const mealVideoModal = document.getElementById("mealVideoModal");
const mealVideoBackdrop = document.getElementById("mealVideoBackdrop");
const mealVideoClose = document.getElementById("mealVideoClose");
const mealVideoFrame = document.getElementById("mealVideoFrame");

const fallbackImage = "../../images/user_pic/hero-section.png";
let currentYoutubeUrl = "";

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function setText(element, value) {
    if (element) {
        element.textContent = value || "";
    }
}

function getMealId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

function getIngredients(meal) {
    const ingredients = [];

    for (let index = 1; index <= 20; index += 1) {
        const ingredient = meal[`strIngredient${index}`];
        const measure = meal[`strMeasure${index}`];

        if (ingredient && ingredient.trim()) {
            ingredients.push({
                ingredient: ingredient.trim(),
                measure: measure ? measure.trim() : ""
            });
        }
    }

    return ingredients;
}

function getInstructionSteps(instructions) {
    if (!instructions) {
        return [];
    }

    return instructions
        .split(/\r?\n/)
        .map((step) => step.trim())
        .filter(Boolean);
}

function estimateDuration(meal) {
    const ingredientCount = getIngredients(meal).length;
    const stepCount = getInstructionSteps(meal.strInstructions).length;
    const minutes = Math.max(25, ingredientCount * 4 + stepCount * 3);

    return `${minutes} min`;
}

function getYoutubeEmbedUrl(url) {
    if (!url) {
        return "";
    }

    try {
        const parsed = new URL(url);
        const videoId = parsed.searchParams.get("v");

        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
    } catch (error) {
        return "";
    }

    return "";
}

function renderCurriculum(meal) {
    if (!curriculumList) {
        return;
    }

    const ingredients = getIngredients(meal);
    const steps = getInstructionSteps(meal.strInstructions);

    const ingredientLessons = ingredients.map((item, index) => `
        <div class="lesson">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <div>
                <strong>${escapeHtml(item.ingredient)}</strong>
                <p>${escapeHtml(item.measure || "As needed")}</p>
            </div>
            <small>Prep</small>
        </div>
    `).join("");

    const stepLessons = steps.map((step, index) => `
        <div class="lesson">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <div>
                <strong>Step ${index + 1}</strong>
                <p>${escapeHtml(step)}</p>
            </div>
            <small>${Math.max(3, Math.round(step.length / 40))}m</small>
        </div>
    `).join("");

    curriculumList.innerHTML = `
        <div class="module active">
            <div>
                <strong>Module 1: Ingredients</strong>
                <span>${ingredients.length} Items • Prep</span>
            </div>
        </div>
        ${ingredientLessons}
        <div class="module">
            <div>
                <strong>Module 2: Cooking Steps</strong>
                <span>${steps.length} Lessons • ${estimateDuration(meal)}</span>
            </div>
        </div>
        ${stepLessons}
    `;
}

function renderMeal(meal) {
    document.title = `Chefi - ${meal.strMeal}`;

    setText(courseTitle, meal.strMeal);
    setText(courseChef, `${meal.strArea || "Global"} cuisine`);
    setText(coursePrice, "Free");
    setText(sidebarPrice, "Free");
    setText(courseDescription, meal.strInstructions);
    setText(courseDuration, estimateDuration(meal));
    setText(courseCategory, meal.strCategory);
    setText(previewDuration, estimateDuration(meal));

    courseImage.src = meal.strMealThumb || fallbackImage;
    courseImage.alt = meal.strMeal;
    courseImage.addEventListener("error", () => {
        courseImage.src = fallbackImage;
    });

    currentYoutubeUrl = getYoutubeEmbedUrl(meal.strYoutube);

    if (!currentYoutubeUrl && previewPlayBtn) {
        previewPlayBtn.disabled = true;
        previewPlayBtn.style.opacity = "0.55";
    }

    renderCurriculum(meal);
}

function renderMissingMeal() {
    setText(courseTitle, "Meal not found");
    setText(courseDescription, "We could not find this meal. Please go back to Explore and choose another one.");

    if (courseImage) {
        courseImage.src = fallbackImage;
    }

    if (previewPlayBtn) {
        previewPlayBtn.disabled = true;
    }
}

function openVideoModal() {
    if (!currentYoutubeUrl || !mealVideoModal || !mealVideoFrame) {
        return;
    }

    mealVideoFrame.innerHTML = `<iframe src="${currentYoutubeUrl}" title="Recipe preview" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    mealVideoModal.hidden = false;
    document.body.style.overflow = "hidden";
}

function closeVideoModal() {
    if (!mealVideoModal || !mealVideoFrame) {
        return;
    }

    mealVideoModal.hidden = true;
    mealVideoFrame.innerHTML = "";
    document.body.style.overflow = "";
}

async function loadMeal() {
    const mealId = getMealId();

    if (!mealId) {
        renderMissingMeal();
        return;
    }

    try {
        const response = await fetch(`/api/recipe/${mealId}`, {
            credentials: "include"
        });

        if (!response.ok) {
            renderMissingMeal();
            return;
        }

        const meal = await response.json();

        if (!meal) {
            renderMissingMeal();
            return;
        }

        renderMeal(meal);
    } catch (error) {
        console.error("Error loading meal detail:", error);
        renderMissingMeal();
    }
}

if (previewPlayBtn) {
    previewPlayBtn.addEventListener("click", openVideoModal);
}

if (startLearningBtn) {
    startLearningBtn.addEventListener("click", openVideoModal);
}

if (mealVideoBackdrop) {
    mealVideoBackdrop.addEventListener("click", closeVideoModal);
}

if (mealVideoClose) {
    mealVideoClose.addEventListener("click", closeVideoModal);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeVideoModal();
    }
});

loadMeal();
