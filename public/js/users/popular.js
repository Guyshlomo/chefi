fetch("/JSON/popular.json")
    .then(response => response.json())
  .then(popularCourses => {
    const popularContainer = document.getElementById("popular-card");

    popularContainer.innerHTML = popularCourses.map(card => {
      return `
        <div class="popular-card">
          <img src="${card.image}" alt="${card.title}">

          <div class="popular-card-content">
            ${card.badge ? `<span class="course-badge">${card.badge}</span>` : ""}

            <h3>${card.title}</h3>
            <p>${card.chef}</p>

            <div class="rating">
              <span>${card.rating}</span>
              <small>(${card.reviews})</small>
            </div>
          </div>
        </div>
      `;
    }).join("");
  })
  .catch(error => {
    console.error("Error loading popular courses:", error);
  });