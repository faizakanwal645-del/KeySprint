// KeySprint Login Functionality

const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    loginMessage.textContent = "Logging in...";

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            loginMessage.textContent = "Login successful! 🎉";
            loginMessage.style.color = "#86efac";

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);

        } else {
            loginMessage.textContent = data.message;
            loginMessage.style.color = "#f87171";
        }

    } catch (error) {
        loginMessage.textContent = "Server connection failed. Please try again.";
        loginMessage.style.color = "#f87171";
    }
});