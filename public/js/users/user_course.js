const continueContainer = document.getElementById("continueCoursesContainer");
const heroStats = document.getElementById("heroStats");
const myClassesMenu = document.getElementById("myClassesMenu");
const CONTINUE_LIMIT = 2;

function updateHeroStats(courseCount) {
    if (!heroStats) {
        return;
    }

    if (courseCount === 0) {
        heroStats.textContent = "Start your first course today and build your cooking skills week by week.";
        return;
    }

    heroStats.textContent = `You have ${courseCount} course${courseCount === 1 ? "" : "s"} in progress. Keep the heat on.`;
}

function renderContinueWatching(courses) {
    if (!continueContainer) {
        return;
    }

    updateHeroStats(courses.length);

    if (courses.length === 0) {
        ChefiUI.setStatus(continueContainer, "empty", "You have not started any courses yet. Browse meals or courses to begin.");
        return;
    }

    const recentCourses = courses.slice(0, CONTINUE_LIMIT);

    continueContainer.innerHTML = recentCourses
        .map((course) => MyClassesShared.buildContinueCourseCard(course))
        .join("");

    MyClassesShared.attachContinueCourseNavigation(continueContainer, recentCourses);
}

async function initHomeCourses() {
    if (!continueContainer) {
        return;
    }

    ChefiUI.setStatus(continueContainer, "loading", "Loading your courses...");

    const result = await MyClassesShared.fetchMyCourses();

    if (!result.ok) {
        ChefiUI.setStatus(continueContainer, "error", result.error);
        updateHeroStats(0);

        if (myClassesMenu) {
            MyClassesShared.renderMyClassesDropdown(myClassesMenu, []);
        }

        return;
    }

    if (!Array.isArray(result.data)) {
        ChefiUI.setStatus(continueContainer, "error", "Could not load your courses.");
        updateHeroStats(0);
        return;
    }

    renderContinueWatching(result.data);

    if (myClassesMenu) {
        MyClassesShared.renderMyClassesDropdown(myClassesMenu, result.data);
    }
}

initHomeCourses();
