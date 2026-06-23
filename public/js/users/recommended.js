const recommendedGrid = document.getElementById("recommendedGrid");

function getCourseLink(course) {
    return `/course-detail?id=${course.id}`;
}

function renderRecommendedCourses(courses) {
    if (!recommendedGrid) {
        return;
    }

    if (!Array.isArray(courses) || courses.length === 0) {
        recommendedGrid.innerHTML = `
            <p class="ui-status ui-status--empty">
                No recommendations yet. Start a course to get personal suggestions.
            </p>
        `;
        return;
    }

    const course1 = courses[0];
    const course2 = courses[1];
    const course3 = courses[2];
    const course4 = courses[3];

    recommendedGrid.innerHTML = `
        ${course1 ? `
            <div class="div1">
                <img src="${course1.image}" alt="${course1.title}">
                <div class="recommended-content">
                    <h5>${course1.category}</h5>
                    <h2>${course1.title}</h2>
                    <p>${course1.description}</p>
                    <a class="icon-link icon-link-hover" href="${getCourseLink(course1)}">
                        Start Learning
                        <svg xmlns="http://www.w3.org/2000/svg" class="bi" viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                        </svg>
                    </a>
                </div>
            </div>
        ` : ""}

        ${course2 ? `
            <a class="div2 recommended-tile" href="${getCourseLink(course2)}">
                <img src="${course2.image}" alt="${course2.title}">
                <div class="recommended-content">
                    <h3>${course2.title}</h3>
                    <p>${course2.chef_name}<span> • ${course2.duration}</span></p>
                </div>
            </a>
        ` : ""}

        ${course3 ? `
            <a class="div3 recommended-tile" href="${getCourseLink(course3)}">
                <img src="${course3.image}" alt="${course3.title}">
                <div class="recommended-content">
                    <h4>${course3.title}</h4>
                </div>
            </a>
        ` : ""}

        ${course4 ? `
            <a class="div4 recommended-tile" href="${getCourseLink(course4)}">
                <img src="${course4.image}" alt="${course4.title}">
                <div class="recommended-content">
                    <h4>${course4.title}</h4>
                </div>
            </a>
        ` : ""}
    `;
}

async function loadRecommendedCourses() {
    if (!recommendedGrid) {
        return;
    }

    try {
        const response = await fetch("/api/user-courses/recommended", {
            credentials: "include"
        });

        const courses = await response.json();

        renderRecommendedCourses(courses);
    } catch (error) {
        console.error("Error loading recommended courses:", error);

        recommendedGrid.innerHTML = `
            <p class="ui-status ui-status--error">
                Could not load recommended courses.
            </p>
        `;
    }
}

loadRecommendedCourses();