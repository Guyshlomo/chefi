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
    if (courseActionStatus && window.ChefiUI) {
        ChefiUI.setElementStatus(courseActionStatus, type, message);
    }
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
        .map(step => step.trim())
        .filter(Boolean)
        .slice(0, 4);

    if (steps.length === 0) {
        curriculumList.innerHTML = `<p class="ui-status ui-status--empty">Course curriculum will be available soon.</p>`;
        return;
    }

    const lessons = steps.map((step, index) => `
        <div class="lesson">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <div>
                <strong>Lesson ${index + 1}</strong>
                <p>${step}.</p>
            </div>
            <small>${8 + index * 4}m</small>
        </div>
    `).join("");

    curriculumList.innerHTML = `
        <div class="module active">
            <div>
                <strong>Module 1: ${course.title}</strong>
                <span>${steps.length} Lessons • ${course.duration}</span>
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
}

async function applyEnrollmentState(course) {
    if (!buyNowBtn) {
        return;
    }

    const courseId = String(course.id || course._id);
    const isEnrolled = await MyClassesShared.isCourseEnrolled(courseId);

    if (!isEnrolled) {
        buyNowBtn.disabled = false;
        buyNowBtn.textContent = "Add to My Courses";
        showActionStatus("empty", "Add this course to your library to start learning.");
        return;
    }

    buyNowBtn.disabled = false;
    buyNowBtn.textContent = "Continue Learning";
    showActionStatus("success", "This course is in your library. Continue where you left off.");
}

function goToCourseView(courseId) {
    window.location.href = MyClassesShared.getCourseViewUrl({ courseId });
}

function renderMissingCourse(message) {
    setText(courseTitle, "Course not found");
    setText(courseDescription, message || "We could not find this course. Please go back to All Courses and choose another one.");

    if (courseImage) {
        courseImage.src = fallbackImage;
    }

    if (curriculumList) {
        curriculumList.innerHTML = `<p class="ui-status ui-status--empty">No curriculum available.</p>`;
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
        credentials: "include",
        body: JSON.stringify({
            courseId: String(currentCourse.id || currentCourse._id),
            title: currentCourse.title,
            chef: currentCourse.chef_name,
            image: currentCourse.image,
            category: currentCourse.category,
            duration: currentCourse.duration,
            level: currentCourse.level,
            courseType: "catalog"
        })
    });

    if (!result.ok) {
        ChefiUI.setButtonLoading(buyNowBtn, false, "Adding...", "Add to My Courses");
        showActionStatus("error", result.error);
        return;
    }

    MyClassesShared.enrolledCourseIds = null;
    ChefiUI.showToast("Course added to your library.", "success");

    window.location.href = MyClassesShared.getCourseViewUrl({
        courseId: currentCourse.id || currentCourse._id
    });
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

    const course = result.data.find(item => String(item.id || item._id) === String(courseId));

    if (!course) {
        renderMissingCourse();
        return;
    }

    renderCourse(course);
    await applyEnrollmentState(course);
}

if (buyNowBtn) {
    buyNowBtn.addEventListener("click", async () => {
        if (!currentCourse) {
            return;
        }

        const courseId = String(currentCourse.id || currentCourse._id);
        const isEnrolled = await MyClassesShared.isCourseEnrolled(courseId);

        if (isEnrolled) {
            goToCourseView(courseId);
            return;
        }

        await enrollInCourse();
    });
}

if (mobileSearchInput) {
    mobileSearchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            window.location.href = `/all-courses?search=${encodeURIComponent(mobileSearchInput.value.trim())}`;
        }
    });
}

loadCourse();