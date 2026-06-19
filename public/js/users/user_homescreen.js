const params = new URLSearchParams(window.location.search);
const username = params.get("username");

if (username) {
    const usernameText = document.getElementById("usernameText");

    if (usernameText) {
        usernameText.textContent = username;
    }
}