const container = document.querySelector('.container');
const regiserBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

regiserBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});


function selectChios(element) {
  document.querySelectorAll(".student-chios, .chef-chios").forEach(function (card) {
    card.classList.remove("selected");
  });

  element.classList.add("selected");
}