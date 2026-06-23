const courseViewStatus = document.getElementById("courseViewStatus");
const courseViewLayout = document.getElementById("courseViewLayout");
const courseBreadcrumb = document.getElementById("breadcrumbCourse");
const lessonPlayerMedia = document.getElementById("lessonPlayerMedia");
const lessonEyebrow = document.getElementById("lessonEyebrow");
const lessonTitle = document.getElementById("lessonTitle");
const lessonOverview = document.getElementById("lessonOverview");
const instructorName = document.getElementById("instructorName");
const instructorMeta = document.getElementById("instructorMeta");
const instructorImage = document.getElementById("instructorImage");
const equipmentList = document.getElementById("equipmentList");
const takeawaysList = document.getElementById("takeawaysList");
const courseModules = document.getElementById("courseModules");
const courseSidebarMeta = document.getElementById("courseSidebarMeta");
const sidebarProgressFill = document.getElementById("sidebarProgressFill");
const sidebarProgressLabel = document.getElementById("sidebarProgressLabel");
const playerProgressFill = document.getElementById("playerProgressFill");
const playerProgressLabel = document.getElementById("playerProgressLabel");
const prevLessonBtn = document.getElementById("prevLessonBtn");
const nextLessonBtn = document.getElementById("nextLessonBtn");
const sidebarNextBtn = document.getElementById("sidebarNextBtn");
const playPauseBtn = document.getElementById("playPauseBtn");
const playPauseIcon = document.getElementById("playPauseIcon");

const fallbackImage = "../../images/user_pic/hero-section.png";

let enrolledCourse = null;
let courseContent = null;
let modules = [];
let currentLessonIndex = 0;
let playerTimer = null;
let playerSeconds = 0;
let playerDuration = 0;
let isPlaying = false;

function getCourseId() {
    return new URLSearchParams(window.location.search).get("id");
}

function showPageStatus(type, message) {
    ChefiUI.setElementStatus(courseViewStatus, type, message);
    courseViewLayout.hidden = type !== "success" && type !== "empty";
}

function splitDescription(description) {
    return String(description || "")
        .split(/\.\s+/)
        .map((step) => step.trim())
        .filter(Boolean);
}

function getIngredients(meal) {
    const ingredients = [];

    for (let index = 1; index <= 20; index += 1) {
        const ingredient = meal[`strIngredient${index}`];
        const measure = meal[`strMeasure${index}`];

        if (ingredient && ingredient.trim()) {
            ingredients.push(`${measure ? `${measure.trim()} ` : ""}${ingredient.trim()}`);
        }
    }

    return ingredients;
}

function getInstructionSteps(instructions) {
    return String(instructions || "")
        .split(/\r?\n/)
        .map((step) => step.trim())
        .filter(Boolean);
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

function buildCatalogLessons(course) {
    const steps = splitDescription(course.description);
    const lessons = steps.map((step, index) => ({
        id: `catalog-${index}`,
        title: `Lesson ${index + 1}`,
        summary: `${step}.`,
        durationMinutes: 8 + index * 4,
        videoUrl: "",
        image: course.image || fallbackImage,
        equipment: ["Chef knife", "Cutting board", "Mixing bowl"],
        takeaways: [step]
    }));

    if (lessons.length === 0) {
        lessons.push({
            id: "catalog-0",
            title: course.title,
            summary: course.description || "Start learning this course.",
            durationMinutes: 12,
            videoUrl: "",
            image: course.image || fallbackImage,
            equipment: ["Basic kitchen tools"],
            takeaways: ["Follow along step by step"]
        });
    }

    return [{
        title: course.title,
        lessons
    }];
}

function buildMealLessons(meal) {
    const ingredients = getIngredients(meal);
    const steps = getInstructionSteps(meal.strInstructions);
    const youtubeUrl = getYoutubeEmbedUrl(meal.strYoutube);

    const ingredientLessons = ingredients.map((item, index) => ({
        id: `ingredient-${index}`,
        title: `Prep: ${item.split(" ").slice(-1)[0]}`,
        summary: `Prepare ${item} before you start cooking.`,
        durationMinutes: 3,
        videoUrl: "",
        image: meal.strMealThumb || fallbackImage,
        equipment: ["Prep bowls", "Measuring tools"],
        takeaways: [`Have ${item} ready`]
    }));

    const stepLessons = steps.map((step, index) => ({
        id: `step-${index}`,
        title: `Step ${index + 1}`,
        summary: step,
        durationMinutes: Math.max(3, Math.round(step.length / 40)),
        videoUrl: index === 0 ? youtubeUrl : "",
        image: meal.strMealThumb || fallbackImage,
        equipment: ["Stovetop or oven", "Cookware", "Utensils"],
        takeaways: [step.length > 90 ? `${step.slice(0, 90)}...` : step]
    }));

    const modulesList = [];

    if (ingredientLessons.length > 0) {
        modulesList.push({
            title: "Module 1: Ingredients",
            lessons: ingredientLessons
        });
    }

    modulesList.push({
        title: steps.length > 0 ? "Module 2: Cooking Steps" : meal.strMeal,
        lessons: stepLessons.length > 0 ? stepLessons : [{
            id: "meal-0",
            title: meal.strMeal,
            summary: meal.strInstructions || "Follow the recipe instructions.",
            durationMinutes: 12,
            videoUrl: youtubeUrl,
            image: meal.strMealThumb || fallbackImage,
            equipment: ["Kitchen essentials"],
            takeaways: ["Enjoy the process"]
        }]
    });

    return modulesList;
}

function flattenLessons(moduleList) {
    return moduleList.flatMap((module) => module.lessons);
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function stopPlayerTimer() {
    if (playerTimer) {
        window.clearInterval(playerTimer);
        playerTimer = null;
    }

    isPlaying = false;
    playPauseIcon.className = "fa-solid fa-play";
}

function updatePlayerProgressUi() {
    const ratio = playerDuration > 0 ? (playerSeconds / playerDuration) * 100 : 0;
    playerProgressFill.style.setProperty("--player-progress", `${ratio}%`);
    playerProgressLabel.textContent = `${formatTime(playerSeconds)} / ${formatTime(playerDuration)}`;
}

function startPlayerTimer() {
    stopPlayerTimer();
    isPlaying = true;
    playPauseIcon.className = "fa-solid fa-pause";

    playerTimer = window.setInterval(() => {
        if (playerSeconds >= playerDuration) {
            stopPlayerTimer();
            return;
        }

        playerSeconds += 1;
        updatePlayerProgressUi();
    }, 1000);
}

function renderLessonMedia(lesson) {
    lessonPlayerMedia.innerHTML = "";

    if (lesson.videoUrl) {
        lessonPlayerMedia.innerHTML = `<iframe src="${lesson.videoUrl}" title="${ChefiUI.escapeHtml(lesson.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        return;
    }

    const image = document.createElement("img");
    image.className = "lesson-image-stage";
    image.src = lesson.image || fallbackImage;
    image.alt = lesson.title;
    image.addEventListener("error", () => {
        image.src = fallbackImage;
    });
    lessonPlayerMedia.appendChild(image);
}

function renderLessonDetails(lesson, lessonIndex) {
    document.title = `Chefi - ${lesson.title}`;

    lessonEyebrow.textContent = `Lesson ${String(lessonIndex + 1).padStart(2, "0")}`;
    lessonTitle.textContent = lesson.title;
    lessonOverview.textContent = lesson.summary;
    instructorName.textContent = enrolledCourse.chef || courseContent.chef_name || "Chefi Instructor";
    instructorMeta.textContent = `${courseContent.category || enrolledCourse.category || "Course"} • ${courseContent.duration || enrolledCourse.duration || "Self-paced"}`;
    instructorImage.src = enrolledCourse.image || courseContent.image || courseContent.strMealThumb || fallbackImage;
    instructorImage.alt = instructorName.textContent;

    equipmentList.innerHTML = lesson.equipment
        .map((item) => `<li>${ChefiUI.escapeHtml(item)}</li>`)
        .join("");

    takeawaysList.innerHTML = lesson.takeaways
        .map((item) => `<li>${ChefiUI.escapeHtml(item)}</li>`)
        .join("");

    playerDuration = Math.max(60, lesson.durationMinutes * 60);
    playerSeconds = 0;
    stopPlayerTimer();
    updatePlayerProgressUi();
    renderLessonMedia(lesson);
}

function updateProgressUi(progress) {
    sidebarProgressFill.style.setProperty("--sidebar-progress", `${progress}%`);
    sidebarProgressLabel.textContent = `${progress}% complete`;
}

function renderSidebar() {
    const allLessons = flattenLessons(modules);
    courseSidebarMeta.textContent = `${modules.length} Modules • ${allLessons.length} Lessons • ${courseContent.duration || enrolledCourse.duration || "Self-paced"}`;

    courseModules.innerHTML = modules.map((module, moduleIndex) => {
        const completedInModule = module.lessons.filter((_, lessonIndex) => {
            const absoluteIndex = modules.slice(0, moduleIndex).reduce((sum, item) => sum + item.lessons.length, 0) + lessonIndex;
            return absoluteIndex < currentLessonIndex;
        }).length;

        const lessonsMarkup = module.lessons.map((lesson, lessonIndex) => {
            const absoluteIndex = modules.slice(0, moduleIndex).reduce((sum, item) => sum + item.lessons.length, 0) + lessonIndex;
            const isActive = absoluteIndex === currentLessonIndex;
            const isComplete = absoluteIndex < currentLessonIndex;
            const isLocked = absoluteIndex > currentLessonIndex;

            return `
                <button type="button"
                    class="course-lesson-btn${isActive ? " is-active" : ""}${isComplete ? " is-complete" : ""}${isLocked ? " is-locked" : ""}"
                    data-lesson-index="${absoluteIndex}"
                    ${isLocked ? "disabled" : ""}>
                    <span class="course-lesson-index">${isComplete ? "✓" : String(lessonIndex + 1).padStart(2, "0")}</span>
                    <span class="course-lesson-copy">
                        <strong>${ChefiUI.escapeHtml(lesson.title)}</strong>
                        <small>${lesson.durationMinutes} min</small>
                    </span>
                    ${isActive ? `<span class="course-lesson-badge">Now Playing</span>` : ""}
                </button>
            `;
        }).join("");

        return `
            <details class="course-module" ${moduleIndex === 0 ? "open" : ""}>
                <summary>
                    <span>${ChefiUI.escapeHtml(module.title)}</span>
                    <span>${completedInModule}/${module.lessons.length} Done</span>
                </summary>
                <div class="course-lessons">${lessonsMarkup}</div>
            </details>
        `;
    }).join("");

    courseModules.querySelectorAll(".course-lesson-btn:not(.is-locked)").forEach((button) => {
        button.addEventListener("click", () => {
            goToLesson(Number(button.dataset.lessonIndex));
        });
    });
}

async function saveProgress(progress, lessonIndex) {
    await ChefiUI.fetchJson(`/api/user-courses/my-courses/${encodeURIComponent(enrolledCourse.courseId)}/progress`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            progress,
            currentLesson: lessonIndex
        })
    });
}

async function goToLesson(lessonIndex, shouldSave = true) {
    const allLessons = flattenLessons(modules);
    const safeIndex = Math.min(Math.max(lessonIndex, 0), allLessons.length - 1);
    currentLessonIndex = safeIndex;

    const progress = Math.round(((safeIndex + 1) / allLessons.length) * 100);
    enrolledCourse.progress = progress;
    enrolledCourse.currentLesson = safeIndex;

    renderLessonDetails(allLessons[safeIndex], safeIndex);
    renderSidebar();
    updateProgressUi(progress);

    prevLessonBtn.disabled = safeIndex === 0;
    nextLessonBtn.disabled = safeIndex >= allLessons.length - 1;
    sidebarNextBtn.disabled = safeIndex >= allLessons.length - 1;

    if (shouldSave) {
        await saveProgress(progress, safeIndex);
        await MyClassesShared.recordCourseView(enrolledCourse.courseId);
    }
}

async function loadCourseContent() {
    if (enrolledCourse.courseType === "meal") {
        const result = await ChefiUI.fetchJson(`/api/recipes/recipe/${encodeURIComponent(enrolledCourse.courseId)}`);

        if (!result.ok || !result.data) {
            throw new Error(result.error || "Could not load meal course content.");
        }

        courseContent = result.data;
        modules = buildMealLessons(result.data);
        return;
    }

    const result = await ChefiUI.fetchJson("/api/courses");

    if (!result.ok || !Array.isArray(result.data)) {
        throw new Error(result.error || "Could not load course content.");
    }

    const course = result.data.find((item) => String(item.id || item._id) === String(enrolledCourse.courseId));

    if (!course) {
        const mealResult = await ChefiUI.fetchJson(`/api/recipes/recipe/${encodeURIComponent(enrolledCourse.courseId)}`);

        if (mealResult.ok && mealResult.data) {
            courseContent = mealResult.data;
            modules = buildMealLessons(mealResult.data);
            return;
        }

        throw new Error("Course content not found.");
    }

    courseContent = course;
    modules = buildCatalogLessons(course);
}

async function initCourseView() {
    const courseId = getCourseId();

    if (!courseId) {
        showPageStatus("error", "Course ID is missing. Go back to My Classes and choose a course.");
        return;
    }

    showPageStatus("loading", "Loading your course...");

    const enrollmentResult = await ChefiUI.fetchJson(`/api/user-courses/my-courses/${encodeURIComponent(courseId)}`);

    if (!enrollmentResult.ok) {
        showPageStatus("error", "This course is not in your library yet. Add it first from the course page.");
        return;
    }

    enrolledCourse = enrollmentResult.data;
    courseBreadcrumb.textContent = enrolledCourse.title;

    try {
        await loadCourseContent();
    } catch (error) {
        showPageStatus("error", error.message || "Could not load this course.");
        return;
    }

    courseViewStatus.hidden = true;
    courseViewLayout.hidden = false;

    const startIndex = Number(enrolledCourse.currentLesson) || 0;
    await goToLesson(startIndex, false);
    await MyClassesShared.recordCourseView(enrolledCourse.courseId);
    await MyClassesShared.loadMyClassesDropdown();
}

prevLessonBtn.addEventListener("click", () => {
    goToLesson(currentLessonIndex - 1);
});

nextLessonBtn.addEventListener("click", () => {
    goToLesson(currentLessonIndex + 1);
});

sidebarNextBtn.addEventListener("click", () => {
    goToLesson(currentLessonIndex + 1);
});

playPauseBtn.addEventListener("click", () => {
    if (isPlaying) {
        stopPlayerTimer();
        return;
    }

    startPlayerTimer();
});

initCourseView();
