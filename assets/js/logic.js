// Get DOM Elements
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("answer-buttons");
const feedbackEl = document.getElementById("check-answer");
const timerEl = document.getElementById("timer");
const nextButton = document.getElementById("next-btn");
const startButton = document.getElementById("start-btn");
const submitButton = document.getElementById("submit-btn");
const initialsField = document.getElementById("initials-field");
const scoreField = document.getElementById("your-score");
const highScoresLink = document.getElementById("highscores-link");
const clearScoresButton = document.getElementById("clear-btn");
const restartButton = document.getElementById("restart-btn");
const startContainer = document.getElementById("start-container");
const questionContainer = document.getElementById("question-container");
const scoreContainer = document.getElementById("score-container");
const highScoresContainer = document.getElementById("highscores");

// Quiz state variables
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 75; // Initial time for the quiz
let timerInterval;

// Event listeners
nextButton.addEventListener("click", nextQuestion);
startButton.addEventListener("click", startQuiz);
submitButton.addEventListener("click", saveScore);
highScoresLink.addEventListener("click", showHighScores);
clearScoresButton.addEventListener("click", clearScores);
restartButton.addEventListener("click", restartQuiz);

// Start the quiz
function startQuiz() {
    startContainer.classList.add("hide");
    questionContainer.classList.remove("hide");
    displayQuestion();
    startTimer();
}

// Display the next question
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        endQuiz();
    }
}

// Display the current question and options
function displayQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionEl.textContent = currentQuestion.prompt;

    // Clear previous options
    optionsEl.innerHTML = "";

    // Display options for current question
    currentQuestion.options.forEach(function(option, index) {
        const button = document.createElement("button");
        button.textContent = option;
        button.classList.add("btn");
        button.addEventListener("click", checkAnswer);
        optionsEl.appendChild(button);
    });
}

// Check the selected answer
function checkAnswer(event) {
    const selectedOption = event.target.textContent;
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.answer) {
        feedbackEl.textContent = "Correct!";
        score += 10; // Increment score for correct answer
    } else {
        feedbackEl.textContent = "Incorrect!"; // Provide feedback for incorrect answer
        timeLeft -= 10; // Deduct time for incorrect answer
        if (timeLeft < 0) {
            timeLeft = 0; // Ensure time doesn't go negative
        }
        timerEl.textContent = "Time: " + timeLeft; // Update displayed time
    }
    feedbackEl.classList.remove("hide"); // Show feedback text
    setTimeout(function() {
        feedbackEl.classList.add("hide"); // Hide feedback text after 1 second delay
        nextQuestion(); // Move to next question
    }, 1000);
}

// End the quiz
function endQuiz() {
    clearInterval(timerInterval); // Stop the timer
    questionContainer.classList.add("hide"); // Hide the question container
    scoreContainer.classList.remove("hide"); // Show the score container
    scoreField.textContent = "Your final score is " + score; // Display final score
}

// Timer function
function startTimer() {
    timerInterval = setInterval(function() {
        timeLeft--; // Decrement time
        timerEl.textContent = "Time: " + timeLeft; // Update displayed time
        if (timeLeft <= 0) {
            endQuiz(); // End the quiz if time runs out
        }
    }, 1000);
}

// Save scores
function saveScore(event) {
    event.preventDefault();
    const initials = initialsField.value.trim();
    if (initials !== "") {
        const newScore = {
            initials: initials,
            score: score
        };
        const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
        highScores.push(newScore);
        localStorage.setItem("highScores", JSON.stringify(highScores));
        showHighScores();
    }
}

// Show high scores
function showHighScores() {
    startContainer.classList.add("hide");
    questionContainer.classList.add("hide");
    scoreContainer.classList.add("hide");
    highScoresContainer.classList.remove("hide");

    const highScoresList = document.getElementById("high-scores");
    highScoresList.innerHTML = "";
    const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    highScores.forEach(function(score, index) {
        const listItem = document.createElement("li");
        listItem.textContent = score.initials + " - " + score.score;
        highScoresList.appendChild(listItem);
    });
}

// Clear scores
function clearScores() {
    localStorage.removeItem("highScores");
    showHighScores();
}

// Restart the quiz
function restartQuiz() {
    location.reload();
}
