/*
  ============================================
  Chefi - Admin Dashboard JavaScript
  ============================================
  המשימה של הקובץ הזה:
    1. לטעון את הקובץ dashboard.JSON
    2. למלא את 3 הקונטיינרים הריקים ב-HTML:
       - <section id="stats-grid">
       - <div id="courses-grid">
       - <tbody id="signups-tbody">

  הזרימה:  fetch  ->  json  ->  3 פונקציות render שמייצרות HTML
*/


/*
  ============================================
  טעינת ה-JSON
  ============================================
  fetch מחזיר Promise = "הבטחה" שערך יגיע בעתיד.
  .then() = "כשההבטחה תתקיים, עשה את הפעולה הזו".
  שני שלבים:
    1. fetch מחזיר Response - אובייקט עם המטא-דאטה של התשובה.
    2. response.json() מפענח את הטקסט לאובייקט JS אמיתי.

  שים לב: .json() גם הוא מחזיר Promise, ולכן צריך .then נוסף.
*/
fetch("../../JSON/admin/dashboard.JSON")
  .then(response => response.json())
  .then(data => {
    /*
      בנקודה הזו 'data' הוא אובייקט JS מלא, זהה למבנה של הקובץ.
      data.stats, data.courses, data.signups - שלושת המערכים.
      קוראים ל-3 פונקציות נפרדות, כל אחת מטפלת בחלק אחר.
    */
    renderStats(data.stats);
    renderCourses(data.courses);
    renderSignups(data.signups);
  })
  .catch(error => {
    // אם משהו נכשל - לפחות נדע מה.
    console.error("Failed to load dashboard data:", error);
  });


/*
  ============================================
  1. STATS - ארבעת הריבועים העליונים
  ============================================
  מקבל: מערך של אובייקטי stat
  מבצע: בונה HTML לכל אובייקט, ומדביק את הכל לתוך #stats-grid
*/
function renderStats(stats) {
  // מאתרים את הקונטיינר הריק ב-HTML
  const container = document.getElementById("stats-grid");

  /*
    .map() = "תרגם כל איבר במערך לערך אחר".
    כאן מתרגמים כל אובייקט-stat למחרוזת HTML.
    אחר כך .join("") מצרף את כל המחרוזות ל-HTML אחד גדול.
  */
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

  /*
    שימוש ב-Template Literals (backticks `):
    - מאפשר טקסט מרובה שורות
    - מאפשר להזריק משתנים עם ${...}
    זה הרבה יותר נוח מאשר 'text' + variable + 'text'.
  */
}


/*
  ============================================
  2. COURSES - שלוש כרטיסיות הקורסים
  ============================================
*/
function renderCourses(courses) {
  const container = document.getElementById("courses-grid");

  container.innerHTML = courses.map(course => {
    /*
      לוגיקה: מציגים rating אם קיים, אחרת מציגים duration.
      זה הסיבה שדף Draft (Knife Skills) מציג זמן ולא דירוג -
      כי קורס שעוד לא פורסם אין לו דירוג.
    */
    const metaInfo = course.rating
      ? `★ ${course.rating}`
      : `⏱ ${course.duration}`;

    // ACTIVE -> badge רגיל. DRAFT -> badge עם class נוסף לצבע שונה.
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


/*
  ============================================
  3. SIGNUPS - שורות הטבלה
  ============================================
*/
function renderSignups(signups) {
  const tbody = document.getElementById("signups-tbody");

  tbody.innerHTML = signups.map(person => `
    <tr>

      <td>
        <div class="student-cell">
          <!--
            style inline = הצבע מגיע מה-JSON של כל סטודנט.
            לא יכולנו לעשות זאת ב-CSS כי הצבע משתנה לכל אחד.
          -->
          <div class="student-avatar" style="background-color: ${person.color}">
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
}
