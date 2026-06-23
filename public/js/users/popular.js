const popularContainer = document.getElementById("popular-card");

async function loadPopularCourses() {
    if (!popularContainer) {
        return;
    }

    try {
        const response = await fetch("/api/home-content/popular");
        const popularCourses = await response.json();

        if (!Array.isArray(popularCourses) || popularCourses.length === 0) {
            popularContainer.innerHTML = `<p>No popular courses to show yet.</p>`;
            return;
        }

        popularContainer.innerHTML = popularCourses.map((course) => {
            return `
                <article class="popular-card">
                    <img src="${course.image}" alt="${course.title}">
                    <div class="popular-card-content">
                        ${course.badge ? `<span class="course-badge">${course.badge}</span>` : ""}
                        <h3>${course.title}</h3>
                        <p>${course.chef}</p>
                        <div class="rating">
                            <span>${course.rating}</span>
                            <small>(${course.reviews})</small>
                        </div>
                    </div>
                </article>
            `;
        }).join("");

        popularContainer.querySelectorAll(".popular-card").forEach((card, index) => {
            const course = popularCourses[index];

            card.addEventListener("click", () => {
                window.location.href = `/all-courses?search=${encodeURIComponent(course.title)}`;
            });
        });
    } catch (error) {
        console.error("Error loading popular courses:", error);
    }
}

loadPopularCourses();