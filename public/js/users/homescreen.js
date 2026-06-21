const profileBtn = document.getElementById("profileBtn");
const profileMenu = document.getElementById("profileMenu");

if (profileBtn && profileMenu) {
  profileBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    profileMenu.classList.toggle("show");
  });

  document.addEventListener("click", () => {
    profileMenu.classList.remove("show");
  });

  profileMenu.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}