const coursesGrid = document.getElementById("coursesGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const levelFilter = document.getElementById("levelFilter");
const searchBtn = document.getElementById("searchBtn");
const mobileSearchInput = document.querySelector(".mobile-navbar-search input");

function applyQueryParams() {
    const params = new URLSearchParams(window.location.search);

    if (params.get("search")) {
        searchInput.value = params.get("search");
    }

    if (params.get("category")) {
        categoryFilter.value = params.get("category");
    }

    if (params.get("level")) {
        levelFilter.value = params.get("level");
    }
}

function showCourses(courses) {
    if (!Array.isArray(courses) || courses.length === 0) {
        ChefiUI.setStatus(coursesGrid, "empty", "No courses match your search. Try different filters.");
        return;
    }

    coursesGrid.innerHTML = "";

    courses.forEach((course) => {
        const courseCard = document.createElement("article");
        courseCard.classList.add("course-card");
        courseCard.tabIndex = 0;
        courseCard.setAttribute("role", "link");
        courseCard.setAttribute("aria-label", `Open ${course.title} course detail`);

        const imageUrl = course.image ? course.image.trim() : "../../images/user_pic/hero-section.png";

        courseCard.innerHTML = `
            <img class="course-img" src="${ChefiUI.escapeHtml(imageUrl)}" alt="${ChefiUI.escapeHtml(course.title)}">
            <div class="course-content">
                <h2>${ChefiUI.escapeHtml(course.title)}</h2>
                <p>${ChefiUI.escapeHtml(course.description)}</p>
                <div class="course-meta-list">
                    <span class="chef-meta"><strong>Chef</strong>${ChefiUI.escapeHtml(course.chef_name)}</span>
                    <span><strong>Category</strong>${ChefiUI.escapeHtml(course.category)}</span>
                    <span><strong>Level</strong>${ChefiUI.escapeHtml(course.level)}</span>
                    <span><strong>Duration</strong>${ChefiUI.escapeHtml(course.duration)}</span>
                    <span class="price-meta"><strong>Price</strong>$${ChefiUI.escapeHtml(course.price)}</span>
                </div>
            </div>
        `;

        courseCard.addEventListener("click", () => {
            window.location.href = `/course-detail?id=${course.id || course._id}`;
        });

        courseCard.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                window.location.href = `/course-detail?id=${course.id || course._id}`;
            }
        });

        coursesGrid.appendChild(courseCard);
    });
}

async function getCourses() {
    ChefiUI.setStatus(coursesGrid, "loading", "Loading courses...");

    const search = searchInput.value.trim();
    const category = categoryFilter.value;
    const level = levelFilter.value;
    const params = new URLSearchParams();

    if (search) {
        params.set("search", search);
    }

    if (category) {
        params.set("category", category);
    }

    if (level) {
        params.set("level", level);
    }

    const query = params.toString();
    const url = query ? `/api/courses?${query}` : "/api/courses";
    const result = await ChefiUI.fetchJson(url);

    if (!result.ok) {
        ChefiUI.setStatus(coursesGrid, "error", result.error);
        return;
    }

    if (!Array.isArray(result.data)) {
        ChefiUI.setStatus(coursesGrid, "error", "Could not load courses.");
        return;
    }

    showCourses(result.data);
}

searchBtn.addEventListener("click", getCourses);
searchInput.addEventListener("input", getCourses);
categoryFilter.addEventListener("change", getCourses);
levelFilter.addEventListener("change", getCourses);

if (mobileSearchInput) {
    mobileSearchInput.addEventListener("input", () => {
        searchInput.value = mobileSearchInput.value;
        getCourses();
    });
}

applyQueryParams();
getCourses();
