const courseTitle = document.getElementById("courseTitle");
const courseChef = document.getElementById("courseChef");
const coursePrice = document.getElementById("coursePrice");
const sidebarPrice = document.getElementById("sidebarPrice");
const courseImage = document.getElementById("courseImage");
const courseDescription = document.getElementById("courseDescription");
const courseDuration = document.getElementById("courseDuration");
const courseCategory = document.getElementById("courseCategory");
const courseLevel = document.getElementById("courseLevel");
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
let currentMeal = null;

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

async function renderMeal(meal) {
    currentMeal = meal;

    document.title = `Chefi - ${meal.strMeal}`;

    setText(courseTitle, meal.strMeal);
    setText(courseChef, `${meal.strArea || "Global"} cuisine`);
    setText(coursePrice, "Free");
    setText(sidebarPrice, "Free");
    setText(courseDescription, meal.strInstructions);
    setText(courseDuration, estimateDuration(meal));
    setText(courseCategory, meal.strCategory);
    setText(courseLevel, "Beginner");
    setText(previewDuration, estimateDuration(meal));

    courseImage.src = meal.strMealThumb || fallbackImage;
    courseImage.alt = meal.strMeal;

    courseImage.addEventListener("error", () => {
        courseImage.src = fallbackImage;
    });

    currentYoutubeUrl = getYoutubeEmbedUrl(meal.strYoutube);

    if (!currentYoutubeUrl && previewPlayBtn) {
        previewPlayBtn.disabled = true;
        previewPlayBtn.classList.add("is-unavailable");
    }

    renderCurriculum(meal);
    await applyMealEnrollmentState(meal);
}

async function applyMealEnrollmentState(meal) {
    if (!startLearningBtn) {
        return;
    }

    const isEnrolled = await MyClassesShared.isCourseEnrolled(String(meal.idMeal));

    if (!isEnrolled) {
        startLearningBtn.disabled = false;
        startLearningBtn.textContent = "Start Learning";
        startLearningBtn.classList.remove("course-added-success");
        showMealActionStatus("empty", "This is a free course. Press Start Learning to save it to your library.");
        return;
    }

    startLearningBtn.disabled = false;
    startLearningBtn.textContent = "Continue Learning";
    startLearningBtn.classList.add("course-added-success");
    showMealActionStatus("success", "This course is in your library. Continue where you left off.");
}

function goToMealCourseView(mealId) {
    window.location.href = MyClassesShared.getCourseViewUrl({ courseId: mealId });
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

    if (startLearningBtn) {
        startLearningBtn.disabled = true;
    }
}

function openVideoModal() {
    if (!currentYoutubeUrl || !mealVideoModal || !mealVideoFrame) {
        return;
    }

    mealVideoFrame.innerHTML = `<iframe src="${currentYoutubeUrl}" title="Recipe preview" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    mealVideoModal.hidden = false;
    ChefiUI.lockBodyScroll(true);
}

function closeVideoModal() {
    if (!mealVideoModal || !mealVideoFrame) {
        return;
    }

    mealVideoModal.hidden = true;
    mealVideoFrame.innerHTML = "";
    ChefiUI.lockBodyScroll(false);
}

function showMealActionStatus(type, message) {
    ChefiUI.setElementStatus(document.getElementById("mealActionStatus"), type, message);
}

function showCourseAddedSuccess() {
    startLearningBtn.textContent = "Added to My Courses";
    startLearningBtn.classList.add("course-added-success");
    startLearningBtn.disabled = true;
    showMealActionStatus("success", "Course added to your library successfully.");
}

async function addCourseToMyCourses() {
    if (!currentMeal || !startLearningBtn) {
        return;
    }

    ChefiUI.setButtonLoading(startLearningBtn, true, "Adding...", "Start Learning");
    showMealActionStatus("loading", "Adding course to your library...");

    const result = await ChefiUI.fetchJson("/api/user-courses/my-courses", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            courseId: currentMeal.idMeal,
            title: currentMeal.strMeal,
            chef: `${currentMeal.strArea || "Global"} cuisine`,
            image: currentMeal.strMealThumb || fallbackImage,
            category: currentMeal.strCategory,
            duration: estimateDuration(currentMeal),
            level: "Beginner",
            courseType: "meal"
        })
    });

    if (!result.ok) {
        ChefiUI.setButtonLoading(startLearningBtn, false, "Adding...", "Start Learning");
        showMealActionStatus("error", result.error);
        return;
    }

    MyClassesShared.enrolledCourseIds = null;
    ChefiUI.showToast("Course added to your library.", "success");
    window.location.href = MyClassesShared.getCourseViewUrl({ courseId: currentMeal.idMeal });
}

async function loadMeal() {
    const mealId = getMealId();

    if (!mealId) {
        renderMissingMeal();
        showMealActionStatus("error", "Meal ID is missing.");
        return;
    }

    setText(courseTitle, "Loading meal...");
    showMealActionStatus("loading", "Loading meal details...");

    const result = await ChefiUI.fetchJson(`/api/recipes/recipe/${mealId}`);

    if (!result.ok || !result.data) {
        renderMissingMeal();
        showMealActionStatus("error", result.error || "Meal not found.");
        return;
    }

    await renderMeal(result.data);
}

if (previewPlayBtn) {
    previewPlayBtn.addEventListener("click", openVideoModal);
}

if (startLearningBtn) {
    startLearningBtn.addEventListener("click", async () => {
        if (!currentMeal) {
            return;
        }

        const isEnrolled = await MyClassesShared.isCourseEnrolled(String(currentMeal.idMeal));

        if (isEnrolled) {
            goToMealCourseView(currentMeal.idMeal);
            return;
        }

        addCourseToMyCourses();
    });
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