const coursesGrid = document.getElementById("coursesGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const levelFilter = document.getElementById("levelFilter");
const searchBtn = document.getElementById("searchBtn");

async function getCourses() {
    const search = searchInput.value;
    const category = categoryFilter.value;
    const level = levelFilter.value;

    let url = `/api/courses?`;

    if (search) {
        url += `search=${encodeURIComponent(search)}&`;
    }

    if (category) {
        url += `category=${encodeURIComponent(category)}&`;
    }

    if (level) {
        url += `level=${encodeURIComponent(level)}&`;
    }

    const response = await fetch(url, {
        method: "GET",
        credentials: "include"
    });

    const courses = await response.json();

    showCourses(courses);
}

function showCourses(courses) {
    coursesGrid.innerHTML = "";

    courses.forEach((course) => {
        const courseCard = document.createElement("article");
        courseCard.classList.add("course-card");
        courseCard.tabIndex = 0;
        courseCard.setAttribute("role", "link");
        courseCard.setAttribute("aria-label", `Open ${course.title} course detail`);

        const imageUrl = course.image ? course.image.trim() : "";

        console.log("IMAGE URL:", imageUrl);

        courseCard.innerHTML = `
            <img class="course-img" src="${imageUrl}" alt="${course.title}">
            <div class="course-content">
                <h2>${course.title}</h2>
                <p>${course.description}</p>
                <div class="course-meta-list">
                    <span class="chef-meta"><strong>Chef</strong>${course.chef_name}</span>
                    <span><strong>Category</strong>${course.category}</span>
                    <span><strong>Level</strong>${course.level}</span>
                    <span><strong>Duration</strong>${course.duration}</span>
                    <span class="price-meta"><strong>Price</strong>$${course.price}</span>
                </div>
            </div>
        `;

        coursesGrid.appendChild(courseCard);

        courseCard.addEventListener("click", () => {
            window.location.href = `/course-detail?id=${course.id || course._id}`;
        });

        courseCard.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                window.location.href = `/course-detail?id=${course.id || course._id}`;
            }
        });
    });
}


searchBtn.addEventListener("click", () => {
    getCourses();
});

searchInput.addEventListener("input", () => {
    getCourses();
});

categoryFilter.addEventListener("change", () => {
    getCourses();
});

levelFilter.addEventListener("change", () => {
    getCourses();
});

window.onload = () => {
    getCourses();
};