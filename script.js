// KeySprint - Typing Speed & Performance Analyzer

const startButton = document.getElementById("start-test");
const restartButton = document.getElementById("restart-test");
const typingArea = document.getElementById("typing-area");
const typingInput = document.getElementById("typing-input");
let testText = document.getElementById("test-text").textContent.trim();
const difficultySelect = document.getElementById("difficulty");

const difficultyTexts = {
    easy: "Practice makes progress. Keep learning every day.",
    medium: "Practice makes progress. Keep learning and improve your typing speed every day.",
    hard: "Consistent practice improves typing speed, accuracy, concentration, and overall productivity."
};
typingInput.maxLength = testText.length;
const timerDisplay = document.getElementById("timer");
const timerProgress = document.getElementById("timer-progress");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const typingFeedback = document.getElementById("typing-feedback");
const resultsCard = document.getElementById("results-card");
const finalWPMDisplay = document.getElementById("final-wpm");
const finalAccuracyDisplay = document.getElementById("final-accuracy");
const finalBestDisplay = document.getElementById("final-best");
const improvementTip = document.getElementById("improvement-tip");

let timeLeft = 30;
let timer = null;
let testStarted = false;
let testFinished = false;
let correctCharacters = 0;
function showTypingFeedback() {
    const typedText = typingInput.value;
    let feedbackHTML = "";

    for (let i = 0; i < testText.length; i++) {
        if (i < typedText.length) {
            if (typedText[i] === testText[i]) {
                feedbackHTML += '<span class="correct-char">' +
                    testText[i] + '</span>';
            } else {
                feedbackHTML += '<span class="incorrect-char">' +
                    testText[i] + '</span>';
            }
        } else {
            feedbackHTML += '<span>' + testText[i] + '</span>';
        }
    }

    typingFeedback.innerHTML = feedbackHTML;
    console.log("Typing feedback updated");
}
// Start the typing test
function updateDifficulty() {
const selectedDifficulty = difficultySelect.value;

testText = difficultyTexts[selectedDifficulty];

document.getElementById("test-text").textContent = testText;

typingInput.value = "";
typingInput.maxLength = testText.length;

if (typingFeedback) {
    typingFeedback.innerHTML = "";
}

}
function updateAchievements(wpm, accuracy) {
    const firstBadge = document.getElementById("first-test-badge");
    const accuracyBadge = document.getElementById("accuracy-badge");
    const speedBadge = document.getElementById("speed-badge");

    firstBadge.textContent = "🏆 Unlocked";
    firstBadge.classList.add("unlocked");

    if (accuracy >= 95) {
    accuracyBadge.textContent = "🎯 Unlocked";
    accuracyBadge.classList.add("unlocked");
    localStorage.setItem("keysprintAccuracyBadge", "unlocked");
}

   if (wpm >= 40) {
    speedBadge.textContent = "⚡ Unlocked";
    speedBadge.classList.add("unlocked");
    localStorage.setItem("keysprintSpeedBadge", "unlocked");
}
}
function startTest() {
    clearInterval(timer);

    timeLeft = 30;
    testStarted = false;
    testFinished = false;
    correctCharacters = 0;

    timerDisplay.textContent = timeLeft;
    timerProgress.style.width = "100%";
    wpmDisplay.textContent = "0";
    accuracyDisplay.textContent = "100";
    typingInput.value = "";
    typingInput.disabled = false;

    typingArea.hidden = false;
    resultsCard.hidden = true;
    typingInput.focus();

    startButton.textContent = "Start Your Test";

    clearInterval(timer);
}

// Calculate typing performance
function calculatePerformance() {
    const typedText = typingInput.value;
    const correctLength = Math.min(typedText.length, testText.length);

    correctCharacters = 0;

    for (let i = 0; i < correctLength; i++) {
        if (typedText[i] === testText[i]) {
            correctCharacters++;
        }
    }

    const elapsedTime = 30 - timeLeft;
    const minutes = Math.max(elapsedTime / 60, 1 / 60);

    const wpm = Math.round((correctCharacters / 5) / minutes);

    const accuracy = typedText.length > 0
        ? Math.round((correctCharacters / typedText.length) * 100)
        : 100;

    wpmDisplay.textContent = wpm;
    accuracyDisplay.textContent = accuracy;
}

// Finish the typing test
function finishTest() {
    if (testFinished) return;

    clearInterval(timer);

    testFinished = true;
    typingInput.disabled = true;
    startButton.textContent = "Test Completed";

    calculatePerformance();

    const typedText = typingInput.value;
    const elapsedTime = 30 - timeLeft;

    const finalWPM = Math.round(
        (correctCharacters / 5) / Math.max(elapsedTime / 60, 1 / 60)
    );

    const finalAccuracy = typedText.length > 0
        ? Math.round((correctCharacters / typedText.length) * 100)
        : 0;
        function loadAchievements() {
    if (localStorage.getItem("keysprintFirstBadge") === "unlocked") {
        const firstBadge = document.getElementById("first-test-badge");
        firstBadge.textContent = "🏆 Unlocked";
        firstBadge.classList.add("unlocked");
    }
}

    if (localStorage.getItem("keysprintAccuracyBadge") === "unlocked") {
        const accuracyBadge = document.getElementById("accuracy-badge");
        accuracyBadge.textContent = "🎯 Unlocked";
        accuracyBadge.classList.add("unlocked");
    }

    if (localStorage.getItem("keysprintSpeedBadge") === "unlocked") {
        const speedBadge = document.getElementById("speed-badge");
        speedBadge.textContent = "⚡ Unlocked";
        speedBadge.classList.add("unlocked");
    }
}
        updateAchievements(finalWPM, finalAccuracy);
        firstBadge.classList.add("unlocked");
        localStorage.setItem("keysprintFirstBadge", "unlocked");

    const previousBest = Number(
        localStorage.getItem("keysprintBest") || 0
    );

    const bestScore = Math.max(previousBest, finalWPM);

    localStorage.setItem("keysprintBest", bestScore);

    finalWPMDisplay.textContent = finalWPM;
    finalAccuracyDisplay.textContent = finalAccuracy;
    finalBestDisplay.textContent = bestScore;

    if (finalAccuracy >= 95 && finalWPM >= 40) {
        improvementTip.textContent =
            "Excellent! Your typing is fast and accurate. Try a harder passage next.";
    } else if (finalAccuracy < 90) {
        improvementTip.textContent =
            "Tip: Focus on accuracy first. Slow down and practise difficult words.";
    } else {
        improvementTip.textContent =
            "Good work! Keep practising regularly to improve your typing speed.";
    }

    resultsCard.hidden = false;
    resultsCard.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}
    
// Start the timer when the user begins typing
typingInput.addEventListener("input", function () {
    if (testFinished) {
        return;
    }
        showTypingFeedback();
    }

    if (!testStarted && typingInput.value.length > 0) {
        testStarted = true;

        timer = setInterval(function () {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            timerProgress.style.width = (timeLeft / 30) * 100 + "%";

            calculatePerformance();

            if (timeLeft <= 0) {
                timeLeft = 0;
                timerDisplay.textContent = "0";
                finishTest();
            }
        }, 1000);
    }

    calculatePerformance();

    if (typingInput.value === testText) {
        finishTest();
    }
});

// Start button
startButton.addEventListener("click", startTest);

// Restart button
restartButton.addEventListener("click", startTest);
difficultySelect.addEventListener("change", updateDifficulty);
loadAchievements();
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
        console.error("Could not check login status:", error);
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