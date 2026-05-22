fetch("/Final Project - Chefi/JSON/leaders.JSON")
  .then(response => response.json())
  .then(leaders_content => {
    const leader_list = document.getElementById("li-leaders");
    const leader_content = document.getElementById("leader-content");

    leader_list.innerHTML = leaders_content.map((li_content, index) => {
      return `
        <li class="list_category ${index === 0 ? "active" : ""}" data-id="${li_content.id}">
          <span>${li_content.category}</span>
          <i class="bi bi-chevron-right"></i>
        </li>
      `;
    }).join("");

    function showLeaderContent(leader) {
      leader_content.innerHTML = `
        <div class="leader-card">
          <img src="${leader.image}" alt="${leader.title}">

          <div class="leader-info">
            <span class="leader-badge">${leader.badge}</span>
            <h3>${leader.title}</h3>
            <p>${leader.description}</p>

            <div class="leader-meta">
              <div>
                <span>DURATION</span>
                <strong>${leader.duration}</strong>
              </div>

              <div>
                <span>LEVEL</span>
                <strong>${leader.level}</strong>
              </div>
            </div>
          </div>

          <button class="leader-btn">+</button>
        </div>
      `;
    }

    // מציגים את הראשון כברירת מחדל
    showLeaderContent(leaders_content[0]);
    leader_content.classList.add("show");

    const listItems = document.querySelectorAll(".list_category");

    listItems.forEach(item => {
      item.addEventListener("mouseover", () => {
        const leaderId = Number(item.dataset.id);

        const selectedLeader = leaders_content.find(leader => {
          return leader.id === leaderId;
        });

        listItems.forEach(li => li.classList.remove("active"));
        item.classList.add("active");

        showLeaderContent(selectedLeader);
      });
    });
  })
  .catch(error => {
    console.error("Error loading leaders:", error);
  });