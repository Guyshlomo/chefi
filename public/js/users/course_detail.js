const courseTitle = document.getElementById("courseTitle");
const courseChef = document.getElementById("courseChef");
const coursePrice = document.getElementById("coursePrice");
const sidebarPrice = document.getElementById("sidebarPrice");
const courseImage = document.getElementById("courseImage");
const courseDescription = document.getElementById("courseDescription");
const courseDuration = document.getElementById("courseDuration");
const courseLevel = document.getElementById("courseLevel");
const courseCategory = document.getElementById("courseCategory");

const fallbackImage = "../../images/user_pic/hero-section.png";

function setText(element, value) {
    if (element) {
        element.textContent = value || "";
    }
}

function getCourseId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

function renderCourse(course) {
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

    courseImage.src = course.image || fallbackImage;
    courseImage.alt = course.title;
    courseImage.addEventListener("error", () => {
        courseImage.src = fallbackImage;
    });
}

function renderMissingCourse() {
    setText(courseTitle, "Course not found");
    setText(courseDescription, "We could not find this course. Please go back to All Courses and choose another one.");
    courseImage.src = fallbackImage;
}

async function loadCourse() {
    const courseId = getCourseId();

    if (!courseId) {
        renderMissingCourse();
        return;
    }

    try {
        const response = await fetch("/api/courses", {
            credentials: "include"
        });

        if (!response.ok) {
            renderMissingCourse();
            return;
        }

        const courses = await response.json();
        const course = courses.find((item) => String(item.id || item._id) === String(courseId));

        if (!course) {
            renderMissingCourse();
            return;
        }

        renderCourse(course);
    } catch (error) {
        console.error("Error loading course detail:", error);
        renderMissingCourse();
    }
}

loadCourse();
