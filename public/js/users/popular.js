const popularContainer = document.getElementById("popular-card");

async function loadPopularCourses() {
    if (!popularContainer) {
        return;
    }

    ChefiUI.setStatus(popularContainer, "loading", "Loading popular courses...");

    const result = await ChefiUI.fetchJson("/api/popular");

    if (!result.ok) {
        ChefiUI.setStatus(popularContainer, "error", result.error);
        return;
    }

    if (!Array.isArray(result.data) || result.data.length === 0) {
        ChefiUI.setStatus(popularContainer, "empty", "No popular courses to show yet.");
        return;
    }

    popularContainer.innerHTML = result.data.map((course) => {
        const searchValue = encodeURIComponent(course.title);

        return `
            <article class="popular-card" tabindex="0" role="link" aria-label="Browse ${ChefiUI.escapeHtml(course.title)}">
                <img src="${ChefiUI.escapeHtml(course.image)}" alt="${ChefiUI.escapeHtml(course.title)}">
                <div class="popular-card-content">
                    ${course.badge ? `<span class="course-badge">${ChefiUI.escapeHtml(course.badge)}</span>` : ""}
                    <h3>${ChefiUI.escapeHtml(course.title)}</h3>
                    <p>${ChefiUI.escapeHtml(course.chef)}</p>
                    <div class="rating">
                        <span>${ChefiUI.escapeHtml(course.rating)}</span>
                        <small>(${ChefiUI.escapeHtml(course.reviews)})</small>
                    </div>
                </div>
            </article>
        `;
    }).join("");

    popularContainer.querySelectorAll(".popular-card").forEach((card, index) => {
        const course = result.data[index];
        const targetUrl = `/all-courses?search=${encodeURIComponent(course.title)}`;

        card.addEventListener("click", () => {
            window.location.href = targetUrl;
        });

        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                window.location.href = targetUrl;
            }
        });
    });
}

loadPopularCourses();
