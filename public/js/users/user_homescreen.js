const params = new URLSearchParams(window.location.search);
const username = params.get("username");

if (username) {
    const usernameText = document.getElementById("usernameText");

    if (usernameText) {
        usernameText.textContent = username;
    }
}


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