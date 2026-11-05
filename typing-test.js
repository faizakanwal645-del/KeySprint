// KeySprint - Typing Test Page

const startButton = document.getElementById("start-test");
const restartButton = document.getElementById("restart-test");
const typingArea = document.getElementById("typing-area");
const typingInput = document.getElementById("typing-input");
const testTextDisplay = document.getElementById("test-text");
const difficultySelect = document.getElementById("difficulty");
function getDifficultyDuration() {
    const durations = {
        easy: 15,
        medium: 60,
        hard: 120
    };

    return durations[difficultySelect.value];
}

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

let timeLeft = getDifficultyDuration();
let timer = null;
let testStarted = false;
let testFinished = false;
let testText = testTextDisplay.textContent.trim();

const difficultyTexts = {
easy: [
"I love to learn new things every day.",
"Practice makes progress. Keep learning every day.",
"Typing is a useful skill for students.",
"Small steps can lead to big success.",
"Every day is a new chance to learn.",
"Good habits help us become better learners.",
"I enjoy using a computer to learn new skills.",
"Keep your hands relaxed while typing."
],

medium: [
 "Computers have become an essential part of modern education. Students use digital tools to research different topics, prepare assignments, attend online classes, and collaborate with classmates.",

"Effective communication is an important skill in both academic and professional environments. People communicate through emails, presentations, reports, and online meetings. Clear language, correct spelling, and well-organized information help readers understand the main message.",

"Time management helps students organize their daily activities and achieve their academic goals. Creating a realistic schedule, setting priorities, and avoiding unnecessary distractions can improve productivity. Taking short breaks between study sessions also helps maintain concentration.",
"Cloud computing allows people to store files, access applications, and share information through the internet. Instead of depending entirely on one computer, users can access their data from different devices. Many educational institutions and businesses use cloud services to improve collaboration, simplify storage, and support remote work.",

"Learning a programming language requires patience, logical thinking, and regular practice. Beginners often make mistakes while writing code, but these mistakes provide valuable opportunities to learn. By understanding error messages, testing different solutions, and reviewing their work, learners gradually develop stronger problem-solving abilities.",

"A healthy study routine can improve concentration and academic performance. Students should organize their workspace, set achievable goals, and divide difficult tasks into smaller steps. Getting enough sleep and taking regular breaks can also support learning. Consistency is often more effective than studying for many hours without a clear plan.",
"Digital technology has changed the way people learn and communicate. Students can use online platforms to attend classes, access educational resources, and work on group projects. These tools make learning more flexible and help students develop important digital skills.",

"Database management systems help organizations store, organize, and retrieve information efficiently. They allow users to manage records, update information, and search for specific data. Proper database design improves accuracy, reduces duplication, and supports better decision-making.",

"Computer networks connect devices and allow them to exchange information. They are widely used in schools, offices, hospitals, and businesses. Understanding network basics helps students learn how computers communicate and how information travels from one device to another.",

"Web development combines creativity and technical knowledge to build useful websites. HTML provides the structure, CSS controls the appearance, and JavaScript adds interactive features. Learning these technologies helps beginners understand how modern websites are designed and developed."
],

    hard: [
 "Developing exceptional typing proficiency requires consistent practice, concentration, patience, and a thorough understanding of keyboard mechanics. Professional typists must maintain an appropriate balance between speed and accuracy while processing complex information, unfamiliar vocabulary, and lengthy passages. As individuals improve their technical abilities, they gradually develop stronger muscle memory, enhanced concentration, and greater confidence when completing demanding computer-based tasks.",


"Modern information technology has revolutionized the way organizations collect, process, and distribute information. Cybersecurity professionals continuously evaluate potential vulnerabilities, implement protective measures, and monitor suspicious activities to safeguard confidential information against unauthorized access. Developing expertise in this field requires analytical thinking, technical knowledge, and the ability to respond effectively to rapidly evolving digital threats.",

"Software development involves much more than writing lines of code. Programmers must understand user requirements, design efficient algorithms, identify logical errors, and perform comprehensive testing before releasing an application. Maintaining readable code, following established programming standards, and documenting important decisions can significantly improve the reliability and maintainability of complex software systems.",

"Artificial intelligence enables computer systems to perform tasks that traditionally require human intelligence, including recognizing patterns, interpreting language, and making predictions. However, responsible implementation requires careful consideration of privacy, fairness, accuracy, and security. Professionals must evaluate the limitations of intelligent systems and ensure that automated decisions are transparent, reliable, and appropriate for their intended purpose.",
"Advanced cybersecurity practices involve identifying vulnerabilities, evaluating risks, and protecting computer systems from digital attacks. Organizations use firewalls, encryption, authentication, and regular security updates to protect sensitive information. Continuous monitoring helps security teams detect unusual activities and respond to potential threats.",

"Machine learning is a branch of artificial intelligence that enables computers to identify patterns and learn from data. These systems can support applications such as image recognition, recommendation systems, and predictive analysis. However, reliable results depend on accurate data, suitable algorithms, and careful evaluation.",

"Efficient software engineering requires developers to consider performance, reliability, security, and maintainability. A well-designed application should meet user requirements while remaining easy to update and improve. Testing, debugging, and code reviews help development teams identify problems before software is released.",

"Cloud infrastructure provides computing resources such as storage, servers, and databases through internet-based services. Businesses can increase or reduce these resources according to their requirements. Although cloud platforms offer flexibility and scalability, organizations must also manage access controls, data protection, and service reliability."
]


};
function getSavedProgress(difficulty) {
    return Number(localStorage.getItem("keysprintProgress_" + difficulty) || 0);
}

function saveProgress(difficulty, index) {
    localStorage.setItem("keysprintProgress_" + difficulty, index);
}

function updateDifficulty() {
    clearInterval(timer);

   const difficulty = difficultySelect.value;
const texts = difficultyTexts[difficulty];

let savedIndex = getSavedProgress(difficulty);

if (savedIndex >= texts.length) {
    savedIndex = 0;
    saveProgress(difficulty, 0);
}

testText = texts[savedIndex];

localStorage.setItem("keysprintCurrentDifficulty", difficulty);
    testTextDisplay.textContent = testText;

    typingInput.maxLength = testText.length;
    typingInput.value = "";
    typingInput.disabled = false;

    typingFeedback.innerHTML = "";
    resultsCard.hidden = true;

    timeLeft = getDifficultyDuration();
    timerDisplay.textContent = timeLeft;
    timerProgress.style.width = "100%";

    wpmDisplay.textContent = "0";
    accuracyDisplay.textContent = "100";

    testStarted = false;
    testFinished = false;

    startButton.textContent = "Start Your Test";
}

function showTypingFeedback() {
    const typedText = typingInput.value;
    let feedbackHTML = "";

    for (let i = 0; i < testText.length; i++) {
        const character = testText[i]
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        if (i < typedText.length) {
            if (typedText[i] === testText[i]) {
                feedbackHTML += `<span class="correct-char">${character}</span>`;
            } else {
                feedbackHTML += `<span class="incorrect-char">${character}</span>`;
            }
        } else {
            feedbackHTML += character;
        }
    }

    typingFeedback.innerHTML = feedbackHTML;
}

function updateAchievements(wpm, accuracy) {
    localStorage.setItem("keysprintFirstBadge", "unlocked");

    if (accuracy >= 95) {
        localStorage.setItem("keysprintAccuracyBadge", "unlocked");
    }

    if (wpm >= 40) {
        localStorage.setItem("keysprintSpeedBadge", "unlocked");
    }
}

function calculatePerformance() {
    const typedText = typingInput.value;
    let correctCharacters = 0;

    for (let i = 0; i < Math.min(typedText.length, testText.length); i++) {
        if (typedText[i] === testText[i]) {
            correctCharacters++;
        }
    }

    const selectedDuration = getDifficultyDuration();
    timerProgress.style.width = (timeLeft / selectedDuration) * 100 + "%";
const elapsedTime = selectedDuration - timeLeft;
    const minutes = Math.max(elapsedTime / 60, 1 / 60);

    const wpm = Math.round((correctCharacters / 5) / minutes);

    const accuracy = typedText.length > 0
        ? Math.round((correctCharacters / typedText.length) * 100)
        : 100;

    wpmDisplay.textContent = wpm;
    accuracyDisplay.textContent = accuracy;

    return { wpm, accuracy };
}

function startTest() {
    clearInterval(timer);

    timeLeft = getDifficultyDuration();
    testStarted = false;
    testFinished = false;

    timerDisplay.textContent = timeLeft;
    timerProgress.style.width = "100%";
    wpmDisplay.textContent = "0";
    accuracyDisplay.textContent = "100";

    typingInput.disabled = false;
    typingFeedback.innerHTML = "";

    typingArea.hidden = false;
    resultsCard.hidden = true;
    startButton.textContent = "Test in Progress";

    typingInput.focus();
}

function finishTest() {
    if (testFinished) return;

    clearInterval(timer);
    testFinished = true;
    typingInput.disabled = true;
    startButton.textContent = "Test Completed";

    const performance = calculatePerformance();
    const finalWPM = performance.wpm;
    const finalAccuracy = typingInput.value.length > 0
        ? performance.accuracy
        : 0;

    const previousBest = Number(localStorage.getItem("keysprintBest") || 0);
    const bestScore = Math.max(previousBest, finalWPM);

    localStorage.setItem("keysprintBest", String(bestScore));

    updateAchievements(finalWPM, finalAccuracy);

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
}

function loadAchievements() {
    const badges = [
        ["keysprintFirstBadge", "first-test-badge"],
        ["keysprintAccuracyBadge", "accuracy-badge"],
        ["keysprintSpeedBadge", "speed-badge"]
    ];

    badges.forEach(([storageKey, elementId]) => {
        if (localStorage.getItem(storageKey) === "unlocked") {
            const badge = document.getElementById(elementId);

            if (badge) {
                badge.textContent = "🏆 Unlocked";
                badge.classList.add("unlocked");
            }
        }
    });
}

typingInput.addEventListener("input", function () {
    if (testFinished) return;

    showTypingFeedback();
    const difficulty = difficultySelect.value;
const paragraphIndex = getSavedProgress(difficulty);

localStorage.setItem(
    "keysprintTypedText_" + difficulty + "_" + paragraphIndex,
    typingInput.value
);

    if (!testStarted && typingInput.value.length > 0) {
        testStarted = true;

        timer = setInterval(function () {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            timerProgress.style.width = (timeLeft / 30) * 100 + "%";

            calculatePerformance();

            if (timeLeft <= 0) {
                timeLeft = 0;
                timerDisplay.textContent = "00:00";
                finishTest();
            }
        }, 1000);
    }

    calculatePerformance();

    if (typingInput.value === testText) {
    const difficulty = difficultySelect.value;
    const nextIndex = getSavedProgress(difficulty) + 1;

    saveProgress(difficulty, nextIndex);

localStorage.removeItem(
    "keysprintTypedText_" + difficulty + "_" + (nextIndex - 1)
);

finishTest();
}
});

startButton.addEventListener("click", startTest);
restartButton.addEventListener("click", () => {
    localStorage.removeItem(
        "keysprintTypedText_" + difficultySelect.value + "_" +
        getSavedProgress(difficultySelect.value)
    );

    updateDifficulty();
    startTest();
    typingInput.focus();
});
difficultySelect.addEventListener("change", updateDifficulty);

const savedDifficulty =
    localStorage.getItem("keysprintCurrentDifficulty") || "medium";

difficultySelect.value = savedDifficulty;
updateDifficulty();

loadAchievements();