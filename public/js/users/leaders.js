const leaderList = document.getElementById("li-leaders");
const leaderContent = document.getElementById("leader-content");

function renderLeaderContent(leader) {
    if (!leaderContent || !leader) {
        return;
    }

    leaderContent.innerHTML = `
        <div class="leader-card">
            <img src="${ChefiUI.escapeHtml(leader.image)}" alt="${ChefiUI.escapeHtml(leader.title)}">
            <div class="leader-info">
                <span class="leader-badge">${ChefiUI.escapeHtml(leader.badge)}</span>
                <h3>${ChefiUI.escapeHtml(leader.title)}</h3>
                <p>${ChefiUI.escapeHtml(leader.description)}</p>
                <div class="leader-meta">
                    <div>
                        <p>DURATION</p>
                        <strong>${ChefiUI.escapeHtml(leader.duration)}</strong>
                    </div>
                    <div>
                        <p>LEVEL</p>
                        <strong>${ChefiUI.escapeHtml(leader.level)}</strong>
                    </div>
                    <a href="/all-courses?search=${encodeURIComponent(leader.title)}" class="leader-a">Browse Course</a>
                </div>
            </div>
        </div>
    `;
}

function activateLeaderItem(item, leaders) {
    const leaderId = Number(item.dataset.id);
    const selectedLeader = leaders.find((leader) => leader.id === leaderId);

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

    ChefiUI.setStatus(leaderList, "loading", "Loading category leaders...");
    leaderContent.innerHTML = ChefiUI.statusMarkup("loading", "Loading leader details...");

    const result = await ChefiUI.fetchJson("/api/leaders");

    if (!result.ok) {
        ChefiUI.setStatus(leaderList, "error", result.error);
        ChefiUI.setStatus(leaderContent, "error", result.error);
        return;
    }

    if (!Array.isArray(result.data) || result.data.length === 0) {
        ChefiUI.setStatus(leaderList, "empty", "No category leaders available.");
        ChefiUI.setStatus(leaderContent, "empty", "No leader content to display.");
        return;
    }

    leaderList.innerHTML = result.data.map((leader, index) => `
        <li class="list_category ${index === 0 ? "active" : ""}" data-id="${leader.id}" tabindex="0" role="button">
            <span>${ChefiUI.escapeHtml(leader.category)}</span>
            <i class="bi bi-chevron-right"></i>
        </li>
    `).join("");

    renderLeaderContent(result.data[0]);
    leaderContent.classList.add("show");

    leaderList.querySelectorAll(".list_category").forEach((item) => {
        item.addEventListener("mouseenter", () => activateLeaderItem(item, result.data));
        item.addEventListener("click", () => activateLeaderItem(item, result.data));
        item.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                activateLeaderItem(item, result.data);
            }
        });
    });
}

loadLeaders();
