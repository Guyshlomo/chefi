const container = document.querySelector(".container");
const registerBtn = document.querySelector(".register-btn");
const loginBtn = document.querySelector(".login-btn");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

function selectChios(element, role) {
  document.querySelectorAll(".student-chios, .chef-chios").forEach(function (card) {
    card.classList.remove("selected");
  });

  element.classList.add("selected");

  const roleInput = document.getElementById("roleInput");
  roleInput.value = role;
}