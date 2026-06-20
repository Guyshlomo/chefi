const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value.trim();

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const subjectError = document.getElementById("subjectError");
  const messageError = document.getElementById("messageError");
  const formStatus = document.getElementById("formStatus");

  nameError.textContent = "";
  emailError.textContent = "";
  subjectError.textContent = "";
  messageError.textContent = "";
  formStatus.textContent = "";
  formStatus.className = "form-status";

  let isValid = true;

  if (fullName === "") {
    nameError.textContent = "Please enter your full name.";
    isValid = false;
  }

  if (email === "") {
    emailError.textContent = "Please enter your email.";
    isValid = false;
  } else if (!isValidEmail(email)) {
    emailError.textContent = "Please enter a valid email address.";
    isValid = false;
  }

  if (subject === "") {
    subjectError.textContent = "Please choose a subject.";
    isValid = false;
  }

  if (message === "") {
    messageError.textContent = "Please write a message.";
    isValid = false;
  } else if (message.length < 10) {
    messageError.textContent = "Message must be at least 10 characters.";
    isValid = false;
  }

  if (isValid) {
    contactForm.submit();
  } else {
    formStatus.textContent = "Please fix the errors and try again.";
    formStatus.classList.add("error");
  }
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}