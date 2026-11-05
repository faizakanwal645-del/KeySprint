// KeySprint Signup Functionality

const signupForm = document.getElementById("signup-form");
const signupMessage = document.getElementById("signup-message");

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    signupMessage.textContent = "Creating your account...";

    try {
        const response = await fetch("/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            signupMessage.textContent = "Account created successfully! 🎉";
            signupMessage.style.color = "#86efac";

            signupForm.reset();

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
        } else {
            signupMessage.textContent = data.message;
            signupMessage.style.color = "#f87171";
        }

    } catch (error) {
        signupMessage.textContent = "Server connection failed. Please try again.";
        signupMessage.style.color = "#f87171";
    }
});