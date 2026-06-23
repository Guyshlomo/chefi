const courseTitle = document.getElementById("courseTitle");
const courseChef = document.getElementById("courseChef");
const coursePrice = document.getElementById("coursePrice");
const sidebarPrice = document.getElementById("sidebarPrice");
const courseImage = document.getElementById("courseImage");
const courseDescription = document.getElementById("courseDescription");
const courseDuration = document.getElementById("courseDuration");
const courseLevel = document.getElementById("courseLevel");
const courseCategory = document.getElementById("courseCategory");
const curriculumList = document.getElementById("curriculumList");
const buyNowBtn = document.getElementById("buyNowBtn");
const courseActionStatus = document.getElementById("courseActionStatus");
const previewDuration = document.getElementById("previewDuration");
const mobileSearchInput = document.querySelector(".mobile-navbar-search input");

const fallbackImage = "../../images/user_pic/hero-section.png";
let currentCourse = null;

function setText(element, value) {
    if (element) {
        element.textContent = value || "";
    }
}

function showActionStatus(type, message) {
    if (!courseActionStatus) {
        return;
    }

    courseActionStatus.className = `ui-status ui-status--${type}`;
    courseActionStatus.textContent = message;
}

function getCourseId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

function renderCurriculum(course) {
    if (!curriculumList) {
        return;
    }

    const steps = String(course.description || "")
        .split(/\.\s+/)
        .map((step) => step.trim())
        .filter(Boolean)
        .slice(0, 4);

    if (steps.length === 0) {
        curriculumList.innerHTML = ChefiUI.statusMarkup("empty", "Course curriculum will be available soon.");
        return;
    }

    const lessons = steps.map((step, index) => `
        <div class="lesson">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <div>
                <strong>Lesson ${index + 1}</strong>
                <p>${ChefiUI.escapeHtml(step)}.</p>
            </div>
            <small>${8 + index * 4}m</small>
        </div>
    `).join("");

    curriculumList.innerHTML = `
        <div class="module active">
            <div>
                <strong>Module 1: ${ChefiUI.escapeHtml(course.title)}</strong>
                <span>${steps.length} Lessons • ${ChefiUI.escapeHtml(course.duration)}</span>
            </div>
        </div>
        ${lessons}
    `;
}

function renderCourse(course) {
    currentCourse = course;
    const price = `$${course.price}`;

    document.title = `Chefi - ${course.title}`;

    setText(courseTitle, course.title);
    setText(courseChef, course.chef_name);
    setText(coursePrice, price);
    setText(sidebarPrice, price);
    setText(courseDescription, course.description);
    setText(courseDuration, course.duration);
    setText(courseLevel, course.level);
    setText(courseCategory, course.category);
    setText(previewDuration, course.duration);

    courseImage.src = course.image || fallbackImage;
    courseImage.alt = course.title;
    courseImage.onerror = () => {
        courseImage.src = fallbackImage;
    };

    renderCurriculum(course);
    showActionStatus("empty", "Add this course to your library to start learning.");
    MyClassesShared.recordCourseView(String(course.id || course._id));
}

function renderMissingCourse(message) {
    setText(courseTitle, "Course not found");
    setText(courseDescription, message || "We could not find this course. Please go back to All Courses and choose another one.");
    courseImage.src = fallbackImage;

    if (curriculumList) {
        ChefiUI.setStatus(curriculumList, "empty", "No curriculum available.");
    }

    if (buyNowBtn) {
        buyNowBtn.disabled = true;
    }

    showActionStatus("error", message || "Course not found.");
}

async function enrollInCourse() {
    if (!currentCourse || !buyNowBtn) {
        return;
    }

    ChefiUI.setButtonLoading(buyNowBtn, true, "Adding...", "Add to My Courses");
    showActionStatus("loading", "Adding course to your library...");

    const result = await ChefiUI.fetchJson("/api/user-courses/my-courses", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            courseId: String(currentCourse.id || currentCourse._id),
            title: currentCourse.title,
            chef: currentCourse.chef_name,
            image: currentCourse.image,
            category: currentCourse.category,
            duration: currentCourse.duration,
            level: currentCourse.level
        })
    });

    if (!result.ok) {
        ChefiUI.setButtonLoading(buyNowBtn, false, "Adding...", "Add to My Courses");
        showActionStatus("error", result.error);
        return;
    }

    buyNowBtn.disabled = true;
    buyNowBtn.textContent = "Added to My Courses";
    showActionStatus("success", result.data?.message || "Course added successfully.");
}

async function loadCourse() {
    const courseId = getCourseId();

    if (!courseId) {
        renderMissingCourse();
        return;
    }

    setText(courseTitle, "Loading course...");
    showActionStatus("loading", "Loading course details...");

    const result = await ChefiUI.fetchJson("/api/courses");

    if (!result.ok) {
        renderMissingCourse(result.error);
        return;
    }

    if (!Array.isArray(result.data)) {
        renderMissingCourse("Could not load course data.");
        return;
    }

    const course = result.data.find((item) => String(item.id || item._id) === String(courseId));

    if (!course) {
        renderMissingCourse();
        return;
    }

    renderCourse(course);
}

if (buyNowBtn) {
    buyNowBtn.addEventListener("click", enrollInCourse);
}

if (mobileSearchInput) {
    mobileSearchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            window.location.href = `/all-courses?search=${encodeURIComponent(mobileSearchInput.value.trim())}`;
        }
    });
}

loadCourse();
