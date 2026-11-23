const questionElement = document.querySelector(".question");
const questionNumberElement = document.querySelector(".question-number");
const totalQuestionsElement  = document.querySelector(".total-question");
const scoreElement = document.querySelector(".score");
const answerButtonsElement = document.querySelectorAll(".answer");
const nextButtonElement = document.querySelector(".next-button");

const questions = [
    {
        question: "What is the capital of France?",
        answers: ["London", "Paris", "Rome", "Madrid"],
        correctAnswer: "Paris"
    },

    {
        question: "Which planet is known as the Red Planet?",
        answers: ["Venus", "Mars", "Jupiter", "Mercury"],
        correctAnswer: "Mars"
    },
    {
        question: "Which is the largest ocean in the world?",
        answers: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
        correctAnswer: "Pacific Ocean"
    },
    {
        question: "How many days are there in a leap year?",
        answers: ["364", "365", "366", "367"],
        correctAnswer: "366"
    },
    {
        question: "Which country is famous for the Great Wall?",
        answers: ["India", "China", "Japan", "Thailand"],
        correctAnswer: "China"
    },
    {
        question: "What is 18 x 7?",
        answers: ["116", "126", "136", "146"],
        correctAnswer: "126"
    },
    {
        question: "What is 25% of 240?",
        answers: ["40", "60", "80", "90"],
        correctAnswer: "60"
    },
    {
        question: "What is 3/4 + 1/2?",
        answers: ["1", "1.25", "1.75", "2"],
        correctAnswer: "1.25"
    },
    {
        question: "If 144 is divided by 12, then multiplied by 5, what is the answer?",
        answers: ["50", "60", "65", "70"],
        correctAnswer: "60"
    },
    {
        question: "If 3x + 5 = 20, what is the value of x?",
        answers: ["1", "5", "10", "15"],
        correctAnswer: "5"
    }
];

let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;

function loadQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    questionNumberElement.textContent = currentQuestionIndex + 1;
    totalQuestionsElement.textContent = questions.length;
    nextButtonElement.disabled = true;

    answerButtonsElement.forEach((button, index) => {
        button.textContent = currentQuestion.answers[index];
        button.disabled = false;
        button.classList.remove("correct", "incorrect");
    });
}

answerButtonsElement.forEach((button) => {
    button.addEventListener("click", () => {
        selectedAnswer = button.textContent;

        const currentQuestion = questions[currentQuestionIndex];

        answerButtonsElement.forEach((answerButton) => {
            answerButton.disabled = true;

            if (answerButton.textContent === currentQuestion.correctAnswer) {
                answerButton.classList.add("correct");
            }
        });

        if (selectedAnswer !== currentQuestion.correctAnswer) {
            button.classList.add("incorrect");
        }

        nextButtonElement.disabled = false;
    });
});

function checkAnswer() {
    const currentQuestion = questions[currentQuestionIndex];

    if (selectedAnswer === currentQuestion.correctAnswer) {
        score++;
        scoreElement.textContent = score;
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    selectedAnswer = null;

    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    document.querySelector(".quiz-content").classList.add("hidden");
    document.querySelector(".quiz-results").classList.remove("hidden");

    document.querySelector(".final-score").textContent = score;
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = null;

    scoreElement.textContent = score;

    document.querySelector(".quiz-content").classList.remove("hidden");
    document.querySelector(".quiz-results").classList.add("hidden");

    loadQuestion();
}

nextButtonElement.addEventListener("click", () => {
    checkAnswer();
    nextQuestion();
});

document.querySelector(".restart-button").addEventListener("click", restartQuiz);

loadQuestion();
