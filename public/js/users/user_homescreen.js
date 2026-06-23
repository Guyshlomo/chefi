const params = new URLSearchParams(window.location.search);
const username = params.get("username");
const usernameText = document.getElementById("usernameText");

async function setLoggedInUsername() {
  if (!usernameText) {
    return;
  }

  if (username) {
    usernameText.textContent = username;
    return;
  }

  try {
    const response = await fetch("/api/users/me", {
      credentials: "include"
    });

    if (!response.ok) {
      return;
    }

    const user = await response.json();

    if (user.username) {
      usernameText.textContent = user.username;
    }
  } catch (error) {
    if (usernameText) {
      usernameText.textContent = "chef";
    }
  }
}

setLoggedInUsername();


const profileDropdown = document.querySelector(".profile-dropdown");
const profileMenu = document.getElementById("profileMenu");

let isDropdownPinned = false;

if (profileDropdown && profileMenu) {
  profileDropdown.addEventListener("mouseenter", () => {
    profileMenu.classList.add("show");
  });

  profileDropdown.addEventListener("mouseleave", () => {
    if (!isDropdownPinned) {
      profileMenu.classList.remove("show");
    }
  });

  profileDropdown.addEventListener("click", (event) => {
    event.stopPropagation();

    isDropdownPinned = !isDropdownPinned;

    if (isDropdownPinned) {
      profileMenu.classList.add("show");
    } else {
      profileMenu.classList.remove("show");
    }
  });

  profileMenu.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", () => {
    isDropdownPinned = false;
    profileMenu.classList.remove("show");
  });
}

const pageLinks = document.querySelectorAll(".navbar-nav .nav-link[href]");

pageLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");

    if (!href || href.startsWith("#") || link.classList.contains("dropdown-toggle")) {
      return;
    }

    const targetUrl = new URL(href, window.location.href);

    if (targetUrl.origin !== window.location.origin || targetUrl.href === window.location.href) {
      return;
    }

    event.preventDefault();

    document.querySelectorAll(".navbar-nav .nav-link.active").forEach((activeLink) => {
      activeLink.classList.remove("active");
      activeLink.removeAttribute("aria-current");
    });

    link.classList.add("active");
    link.setAttribute("aria-current", "page");
    document.body.classList.add("page-is-leaving");

    window.setTimeout(() => {
      window.location.href = targetUrl.href;
    }, 220);
  });
});