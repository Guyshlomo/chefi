const contactForm = document.getElementById("contactForm");
const submitBtn = contactForm.querySelector(".submit-btn");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value;
    const messageValue = document.getElementById("message").value.trim();

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const subjectError = document.getElementById("subjectError");
    const messageError = document.getElementById("messageError");

    nameError.textContent = "";
    emailError.textContent = "";
    subjectError.textContent = "";
    messageError.textContent = "";
    ChefiUI.clearElementStatus(formStatus);

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

    if (messageValue === "") {
        messageError.textContent = "Please write a message.";
        isValid = false;
    } else if (messageValue.length < 10) {
        messageError.textContent = "Message must be at least 10 characters.";
        isValid = false;
    }

    if (!isValid) {
        ChefiUI.setElementStatus(formStatus, "error", "Please fix the errors and try again.");
        return;
    }

    ChefiUI.setButtonLoading(submitBtn, true, "Sending...", "Send Message");
    ChefiUI.setElementStatus(formStatus, "loading", "Sending your message...");

    const result = await ChefiUI.fetchJson("/contact", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fullName,
            email,
            subject,
            message: messageValue
        })
    });

    ChefiUI.setButtonLoading(submitBtn, false, "Sending...", "Send Message");

    if (!result.ok) {
        ChefiUI.setElementStatus(formStatus, "error", result.error);
        return;
    }

    contactForm.reset();
    ChefiUI.setElementStatus(formStatus, "success", result.data?.message || "Thank you for your message!");
});

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
