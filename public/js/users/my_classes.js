const myClassesGrid = document.getElementById("myClassesGrid");
const myClassesMenu = document.getElementById("myClassesMenu");

function renderMyClassesPage(courses) {
    if (!myClassesGrid) {
        return;
    }

    if (courses.length === 0) {
        ChefiUI.setStatus(myClassesGrid, "empty", "You are not enrolled in any courses yet. Browse the catalog to get started.");
        return;
    }

    myClassesGrid.innerHTML = courses
        .map((course) => MyClassesShared.buildContinueCourseCard(course))
        .join("");

    MyClassesShared.attachContinueCourseNavigation(myClassesGrid, courses);
}

async function initMyClassesPage() {
    if (!myClassesGrid) {
        return;
    }

    ChefiUI.setStatus(myClassesGrid, "loading", "Loading your enrolled courses...");

    const result = await MyClassesShared.fetchMyCourses();

    if (!result.ok) {
        ChefiUI.setStatus(myClassesGrid, "error", result.error);

        if (myClassesMenu) {
            MyClassesShared.renderMyClassesDropdown(myClassesMenu, []);
        }

        return;
    }

    if (!Array.isArray(result.data)) {
        ChefiUI.setStatus(myClassesGrid, "error", "Could not load your courses.");
        return;
    }

    renderMyClassesPage(result.data);

    if (myClassesMenu) {
        MyClassesShared.renderMyClassesDropdown(myClassesMenu, result.data);
    }
}

initMyClassesPage();
