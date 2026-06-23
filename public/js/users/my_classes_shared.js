window.MyClassesShared = {
    getCourseUrl(course) {
        const courseId = String(course.courseId || course.id || course._id);
        return /^[a-f\d]{24}$/i.test(courseId)
            ? `/course-detail?id=${encodeURIComponent(courseId)}`
            : `/meal-detail?id=${encodeURIComponent(courseId)}`;
    },

    async fetchMyCourses() {
        return ChefiUI.fetchJson("/api/user-courses/my-courses");
    },

    async recordCourseView(courseId) {
        if (!courseId) {
            return;
        }

        await ChefiUI.fetchJson(`/api/user-courses/my-courses/${encodeURIComponent(courseId)}/view`, {
            method: "PATCH"
        });
    },

    buildContinueCourseCard(course) {
        const progress = Number(course.progress) || 0;
        const image = course.image || "../../images/user_pic/hero-section.png";

        return `
            <article class="card mb-3 continue-course-card" style="max-width: 540px;" tabindex="0" role="link">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${ChefiUI.escapeHtml(image)}" class="img-fluid rounded-start card-img" alt="${ChefiUI.escapeHtml(course.title)}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h6>${ChefiUI.escapeHtml(course.category || "Course")}</h6>
                            <h3 class="card-title">${ChefiUI.escapeHtml(course.title)}</h3>
                            <p class="card-text">${ChefiUI.escapeHtml(course.chef || "Chefi Course")}</p>
                            <div class="progress-content">
                                <p>${progress}% complete</p>
                                <p>${ChefiUI.escapeHtml(course.duration || "Start now")}</p>
                            </div>
                            <div class="progress" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">
                                <div class="progress-bar" style="width: ${progress}%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        `;
    },

    attachContinueCourseNavigation(container, courses) {
        container.querySelectorAll(".continue-course-card").forEach((card, index) => {
            const course = courses[index];
            const targetUrl = this.getCourseUrl(course);

            card.addEventListener("click", async () => {
                await this.recordCourseView(course.courseId);
                window.location.href = targetUrl;
            });

            card.addEventListener("keydown", async (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    await this.recordCourseView(course.courseId);
                    window.location.href = targetUrl;
                }
            });
        });
    },

    renderMyClassesDropdown(menu, courses) {
        if (!menu) {
            return;
        }

        if (!Array.isArray(courses) || courses.length === 0) {
            menu.innerHTML = `
                <li><span class="dropdown-item-text my-classes-empty">No enrolled courses yet</span></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="/all-courses">Browse Courses</a></li>
            `;
            return;
        }

        const courseItems = courses.map((course) => `
            <li>
                <a class="dropdown-item my-classes-item" href="${this.getCourseUrl(course)}">
                    <span>${ChefiUI.escapeHtml(course.title)}</span>
                    <small>${ChefiUI.escapeHtml(course.progress || 0)}% complete</small>
                </a>
            </li>
        `).join("");

        menu.innerHTML = `
            ${courseItems}
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item my-classes-view-all" href="/my-classes">View All My Classes</a></li>
        `;

        menu.querySelectorAll(".my-classes-item").forEach((link, index) => {
            link.addEventListener("click", async (event) => {
                event.preventDefault();
                await this.recordCourseView(courses[index].courseId);
                window.location.href = this.getCourseUrl(courses[index]);
            });
        });
    },

    async loadMyClassesDropdown(menuId = "myClassesMenu") {
        const menu = document.getElementById(menuId);

        if (!menu) {
            return [];
        }

        menu.innerHTML = `<li><span class="dropdown-item-text my-classes-empty">Loading your classes...</span></li>`;

        const result = await this.fetchMyCourses();

        if (!result.ok || !Array.isArray(result.data)) {
            menu.innerHTML = `<li><span class="dropdown-item-text my-classes-empty">Could not load your classes</span></li>`;
            return [];
        }

        this.renderMyClassesDropdown(menu, result.data);
        return result.data;
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const menu = document.getElementById("myClassesMenu");
    const hasDedicatedCoursesSection = document.getElementById("myClassesGrid")
        || document.getElementById("continueCoursesContainer");

    if (menu && !hasDedicatedCoursesSection) {
        MyClassesShared.loadMyClassesDropdown();
    }
});
