// KeySprint User Welcome and Logout

document.addEventListener("DOMContentLoaded", async () => {

    const userWelcome = document.getElementById("user-welcome");
    const userName = document.getElementById("user-name");
    const logoutButton = document.getElementById("logout-btn");

    if (!userWelcome || !userName || !logoutButton) return;

    try {
        const response = await fetch("/api/me");

        if (response.ok) {
            const data = await response.json();

            userName.textContent = data.user.name;
            userWelcome.hidden = false;
        } else {
            userWelcome.hidden = true;
        }

    } catch (error) {
        console.error("Login status error:", error);
    }

    logoutButton.addEventListener("click", async () => {

        try {
            const response = await fetch("/api/logout", {
                method: "POST"
            });

            if (response.ok) {
                window.location.href = "login.html";
            } else {
                alert("Logout failed. Please try again.");
            }

        } catch (error) {
            alert("Server connection failed.");
        }

    });

});