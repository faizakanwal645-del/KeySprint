const gameTime = document.getElementById("game-time");
const gameScore = document.getElementById("game-score");
const gameBest = document.getElementById("game-best");
const gameWord = document.getElementById("game-word");
const gameInput = document.getElementById("game-input");
const gameMessage = document.getElementById("game-message");
const gameStart = document.getElementById("game-start");
const gameRestart = document.getElementById("game-restart");

const words = [
    "speed", "keyboard", "practice", "purple",
    "computer", "typing", "challenge", "success",
    "focus", "accuracy", "student", "progress",
    "website", "javascript", "learning", "creative",
    "exciting", "button", "beautiful", "important",
    "connect", "answer", "deliver", "mention", "exit",
    "travel", "switch", "scroll", "green", "large"
];

let score = 0;
let timeLeft = 30;
let timer = null;
let gameRunning = false;
let currentWord = "";

let bestScore = Number(localStorage.getItem("keysprintGameBest") || 0);
gameBest.textContent = bestScore;

function showNewWord() {
    let nextWord;

    do {
        nextWord = words[Math.floor(Math.random() * words.length)];
    } while (nextWord === currentWord && words.length > 1);

    currentWord = nextWord;
    gameWord.textContent = currentWord;
    gameInput.value = "";
}

function startGame() {
    clearInterval(timer);

    score = 0;
    timeLeft = 30;
    gameRunning = true;

    gameScore.textContent = score;
    gameTime.textContent = timeLeft;
    gameMessage.textContent = "Go! Type the words correctly.";
    gameInput.disabled = false;

    showNewWord();
    gameInput.focus();
    gameStart.disabled = true;

    timer = setInterval(function () {
        timeLeft--;
        gameTime.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    gameRunning = false;
    gameInput.disabled = true;
    gameStart.disabled = false;

    gameWord.textContent = "GAME OVER!";
    gameMessage.textContent = "Your final score: " + score;

    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("keysprintGameBest", bestScore);
        gameBest.textContent = bestScore;
        gameMessage.textContent += " 🎉 New Best Score!";
    }
}

gameInput.addEventListener("input", function () {
    if (!gameRunning) return;

    if (gameInput.value.trim().toLowerCase() === currentWord) {
        score++;
        gameScore.textContent = score;
        showNewWord();
    }
});

gameStart.addEventListener("click", startGame);
gameRestart.addEventListener("click", startGame);
// Typing Race Game
const raceCar = document.getElementById("race-car");
const raceText = document.getElementById("race-text");
const raceInput = document.getElementById("race-input");
const raceTime = document.getElementById("race-time");
const raceProgress = document.getElementById("race-progress");
const raceStart = document.getElementById("race-start");
const raceReset = document.getElementById("race-reset");
const raceMessage = document.getElementById("race-message");
const raceTrack = document.querySelector(".race-track");

const raceSentences = [
    "Practice makes progress every day.",
    "Typing helps improve speed and accuracy.",
    "Keep learning and never stop improving.",
    "A good student practices every day.",
    "Focus on accuracy before increasing speed.",
    "JavaScript makes websites interactive.",
    "Small steps lead to great success.",
    "Keyboard skills improve with daily practice.",
    "Stay focused and achieve your goals.",
    "Learning new skills is always exciting.",
    "The course start next Sunday.",
    "Success comes with patience.",
    "The train leaves every morning at 8 AM."
];

let raceSentence = raceSentences[0];

let raceSeconds = 30;
let raceTimer = null;
let raceRunning = false;

function resetRace() {
    clearInterval(raceTimer);
    raceRunning = false;
    raceSeconds = 30;

    raceTime.textContent = raceSeconds;
    raceProgress.textContent = "0";
    raceCar.style.left = "0px";
    raceInput.value = "";
    raceInput.disabled = true;
    raceSentence = raceSentences[
    Math.floor(Math.random() * raceSentences.length)
];

raceText.textContent = raceSentence;
    raceMessage.textContent = "Ready to race? 🚦";
    raceStart.disabled = false;
}

function startRace() {
    resetRace();

    raceRunning = true;
    raceInput.disabled = false;
    raceStart.disabled = true;
    raceMessage.textContent = "Go! Type the sentence correctly.";
    raceInput.focus();

    raceTimer = setInterval(function () {
        raceSeconds--;
        raceTime.textContent = raceSeconds;

        if (raceSeconds <= 0) {
            finishRace(false);
        }
    }, 1000);
}

function finishRace(won) {
    clearInterval(raceTimer);
    raceRunning = false;
    raceInput.disabled = true;
    raceStart.disabled = false;

    if (won) {
        raceProgress.textContent = "100";
        raceMessage.textContent = "🏆 You won the race! Excellent typing!";
    } else {
        raceMessage.textContent =
            "⏰ Time's up! Your progress: " +
            raceProgress.textContent + "%";
    }
}

raceInput.addEventListener("input", function () {
    if (!raceRunning) return;

    const typed = raceInput.value;
    const correctLength = Math.min(
        typed.length,
        raceSentence.length
    );

    let correctCharacters = 0;

    for (let i = 0; i < correctLength; i++) {
        if (typed[i] === raceSentence[i]) {
            correctCharacters++;
        }
    }

    const progress = Math.floor(
        (correctCharacters / raceSentence.length) * 100
    );

    raceProgress.textContent = progress;

    const maxLeft = raceTrack.clientWidth - raceCar.offsetWidth - 20;
    raceCar.style.left = (maxLeft * progress / 100) + "px";

    if (typed === raceSentence) {
        finishRace(true);
    }
});

raceStart.addEventListener("click", startRace);
raceReset.addEventListener("click", resetRace);

resetRace();
// Falling Letters Game
const fallingArena = document.getElementById("falling-arena");
const fallingLetter = document.getElementById("falling-letter");
const fallingInput = document.getElementById("falling-input");
const fallingScore = document.getElementById("falling-score");
const fallingTime = document.getElementById("falling-time");
const fallingStart = document.getElementById("falling-start");
const fallingRestart = document.getElementById("falling-restart");
const fallingMessage = document.getElementById("falling-message");

let fallingPoints = 0;
let fallingSeconds = 30;
let fallingRunning = false;
let fallingTimer = null;
let letterTimer = null;
let currentFallingLetter = "";

function newFallingLetter() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    currentFallingLetter =
        letters[Math.floor(Math.random() * letters.length)];

    fallingLetter.textContent = currentFallingLetter;

    const maxLeft = Math.max(
        0,
        fallingArena.clientWidth - fallingLetter.offsetWidth
    );

    fallingLetter.style.left =
        Math.floor(Math.random() * (maxLeft + 1)) + "px";

    fallingLetter.style.top = "0px";
}

function moveFallingLetter() {
    if (!fallingRunning) return;

    const currentTop = parseFloat(fallingLetter.style.top) || 0;
    const nextTop = currentTop + 4;

    if (nextTop >= fallingArena.clientHeight - 48) {
        newFallingLetter();
    } else {
        fallingLetter.style.top = nextTop + "px";
    }
}

function startFallingGame() {
    clearInterval(fallingTimer);
    clearInterval(letterTimer);

    fallingPoints = 0;
    fallingSeconds = 30;
    fallingRunning = true;

    fallingScore.textContent = "0";
    fallingTime.textContent = "30";
    fallingMessage.textContent = "Type the letter before it reaches the bottom!";
    fallingInput.value = "";
    fallingInput.disabled = false;
    fallingStart.disabled = true;

    newFallingLetter();
    fallingInput.focus();

    letterTimer = setInterval(moveFallingLetter, 50);

    fallingTimer = setInterval(function () {
        fallingSeconds--;
        fallingTime.textContent = fallingSeconds;

        if (fallingSeconds <= 0) {
            endFallingGame();
        }
    }, 1000);
}

function endFallingGame() {
    fallingRunning = false;

    clearInterval(fallingTimer);
    clearInterval(letterTimer);

    fallingInput.disabled = true;
    fallingStart.disabled = false;
    fallingMessage.textContent =
        "Game Over! Your final score: " + fallingPoints;
}

fallingInput.addEventListener("input", function () {
    if (!fallingRunning) return;

    const typedLetter = fallingInput.value.trim().toUpperCase();

    if (typedLetter === currentFallingLetter) {
        fallingPoints++;
        fallingScore.textContent = fallingPoints;
        newFallingLetter();
        fallingMessage.textContent = "Correct! Keep going! 🎯";
    }

    fallingInput.value = "";
});

fallingStart.addEventListener("click", startFallingGame);
fallingRestart.addEventListener("click", startFallingGame);

// Initial setup
fallingInput.disabled = true;
fallingTime.textContent = "30";
fallingScore.textContent = "0";
fallingLetter.style.top = "0px";