
function renderStats(stats) {
  const container = document.getElementById("stats-grid");
  container.innerHTML = stats.map(stat => `
    <div class="stat-card">

      <div class="stat-card-top">
        <span class="stat-card-label">${stat.label}</span>
        <i class="${stat.icon} stat-card-icon"></i>
      </div>

      <div class="stat-card-value">${stat.value}</div>

      <div class="stat-card-spark"></div>

      <div class="stat-card-change ${stat.trend}">${stat.change}</div>

    </div>
  `).join("");

}



function renderCourses(courses) {
  const container = document.getElementById("courses-grid");

  container.innerHTML = courses.map(course => {

    const metaInfo = course.rating
      ? `★ ${course.rating}`
      : `⏱ ${course.duration}`;

    const badgeClass = course.status === "DRAFT" ? "course-badge draft" : "course-badge";

    return `
      <div class="course-card" data-course-id="${course.id}">

        <div class="course-img-wrap">
          <span class="${badgeClass}">${course.status}</span>
          <img src="${course.image}" alt="${course.title}">
        </div>

        <div class="course-content">
          <div class="course-category">${course.category}</div>
          <h3 class="course-title">${course.title}</h3>

          <div class="course-meta">
            <span><i class="fa-solid fa-user-group"></i> ${course.students} Students</span>
            <span>${metaInfo}</span>
          </div>

          <div class="course-actions">
            <button class="btn-course primary">${course.primaryAction}</button>
            <button class="btn-course secondary">Analytics</button>
          </div>
        </div>

      </div>
    `;
  }).join("");
}



function renderSignups(signups) {
  const tbody = document.getElementById("signups-tbody");

  tbody.innerHTML = signups.map(person => `
    <tr>

      <td>
        <div class="student-cell">
          <div class="student-avatar" data-avatar-color="${person.color}">
            ${person.initials}
          </div>
          <span>${person.name}</span>
        </div>
      </td>

      <td>${person.course}</td>
      <td>${person.date}</td>
      <td class="amount-cell">${person.amount}</td>
      <td>...</td>

    </tr>
  `).join("");

  tbody.querySelectorAll(".student-avatar[data-avatar-color]").forEach((avatar) => {
    avatar.style.setProperty("--avatar-color", avatar.dataset.avatarColor);
  });
}

function showDashboardEmptyStates() {
  const statsGrid = document.getElementById("stats-grid");
  const coursesGrid = document.getElementById("courses-grid");
  const signupsBody = document.getElementById("signups-tbody");

  if (statsGrid) {
    statsGrid.innerHTML = `<p class="dashboard-empty">No analytics data available yet.</p>`;
  }

  if (coursesGrid) {
    coursesGrid.innerHTML = `<p class="dashboard-empty">No courses to manage yet. Create your first course to see it here.</p>`;
  }

  if (signupsBody) {
    signupsBody.innerHTML = `<tr><td colspan="5">No recent signups to display.</td></tr>`;
  }
}

showDashboardEmptyStates();
