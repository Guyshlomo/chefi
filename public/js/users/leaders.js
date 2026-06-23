const leaderList = document.getElementById("li-leaders");
const leaderContent = document.getElementById("leader-content");

function renderLeaderContent(leader) {
    if (!leaderContent || !leader) {
        return;
    }

    leaderContent.innerHTML = `
        <div class="leader-card">
            <img src="${leader.image}" alt="${leader.title}">
            <div class="leader-info">
                <span class="leader-badge">${leader.badge}</span>
                <h3>${leader.title}</h3>
                <p>${leader.description}</p>
                <div class="leader-meta">
                    <div>
                        <p>DURATION</p>
                        <strong>${leader.duration}</strong>
                    </div>
                    <div>
                        <p>LEVEL</p>
                        <strong>${leader.level}</strong>
                    </div>
                    <a href="/all-courses?search=${encodeURIComponent(leader.title)}" class="leader-a">Browse Course</a>
                </div>
            </div>
        </div>
    `;
}

function activateLeaderItem(item, leaders) {
    const leaderId = item.dataset.id;
    const selectedLeader = leaders.find((leader) => leader._id === leaderId);

    document.querySelectorAll(".list_category").forEach((listItem) => {
        listItem.classList.remove("active");
    });

    item.classList.add("active");
    renderLeaderContent(selectedLeader);
}

async function loadLeaders() {
    if (!leaderList || !leaderContent) {
        return;
    }

    try {
        const response = await fetch("/api/home-content/leaders");
        const leaders = await response.json();

        if (!Array.isArray(leaders) || leaders.length === 0) {
            leaderList.innerHTML = `<p>No category leaders available.</p>`;
            leaderContent.innerHTML = `<p>No leader content to display.</p>`;
            return;
        }

        leaderList.innerHTML = leaders.map((leader, index) => `
            <li class="list_category ${index === 0 ? "active" : ""}" data-id="${leader._id}">
                <span>${leader.category}</span>
                <i class="bi bi-chevron-right"></i>
            </li>
        `).join("");

        renderLeaderContent(leaders[0]);
        leaderContent.classList.add("show");

        leaderList.querySelectorAll(".list_category").forEach((item) => {
            item.addEventListener("mouseenter", () => activateLeaderItem(item, leaders));
            item.addEventListener("click", () => activateLeaderItem(item, leaders));
        });
    } catch (error) {
        console.error("Error loading leaders:", error);
    }
}

loadLeaders();