document.addEventListener('DOMContentLoaded', () => {
    const rulesContainer = document.getElementById('rules-container');
    const quizContainer = document.getElementById('quiz-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageInfo = document.getElementById('page-info');

    let allRules = [];
    let currentPage = 1;
    const rulesPerPage = 5;
    let totalPages = 0;
    let currentQuiz = null;

    function displayRules() {
        rulesContainer.innerHTML = '';
        const startIndex = (currentPage - 1) * rulesPerPage;
        const endIndex = startIndex + rulesPerPage;
        const rulesToShow = allRules.slice(startIndex, endIndex);

        rulesToShow.forEach(rule => {
            const ruleElement = document.createElement('div');
            ruleElement.classList.add('rule-card');

            let examplesHTML = '';
            if (rule.examples && rule.examples.length > 0) {
                const exampleItems = rule.examples.map(example => {
                    const icon = example.type === 'correct' ? 'fa-check' : 'fa-times';
                    return `<li class="example-item ${example.type}"><i class="fas ${icon}"></i>${example.sentence}</li>`;
                }).join('');

                examplesHTML = `
                    <h4 class="examples-heading"><i class="fas fa-lightbulb"></i>Examples</h4>
                    <ul class="examples-list">
                        ${exampleItems}
                    </ul>
                `;
            }

            ruleElement.innerHTML = `
                <h3 class="rule-title"><i class="fas fa-book"></i>Rule ${rule.rule_number}: ${rule.title}</h3>
                <p class="rule-explanation">${rule.explanation}</p>
                ${examplesHTML}
            `;
            rulesContainer.appendChild(ruleElement);
        });

        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        updateButtonStates();
        displayQuiz();
    }

    function displayQuiz() {
        quizContainer.innerHTML = '';
        const lastRuleOnPage = allRules[currentPage * rulesPerPage - 1];

        if (lastRuleOnPage && lastRuleOnPage.quiz) {
            currentQuiz = lastRuleOnPage.quiz;
            let quizHTML = '<h2 class="quiz-title"><i class="fas fa-question-circle"></i>Test Your Knowledge</h2>';

            currentQuiz.forEach((q, index) => {
                const optionsHTML = q.options.map(option => `
                    <label class="option">
                        <input type="radio" name="question${index}" value="${option}">
                        ${option}
                    </label>
                `).join('');

                quizHTML += `
                    <div class="question">
                        <p>${index + 1}. ${q.question}</p>
                        <div class="options">
                            ${optionsHTML}
                        </div>
                    </div>
                `;
            });

            quizHTML += '<button id="submit-quiz-btn" class="submit-btn">Submit Quiz</button>';
            quizHTML += '<div id="quiz-results"></div>';
            quizContainer.innerHTML = quizHTML;

            document.getElementById('submit-quiz-btn').addEventListener('click', checkQuiz);
        } else {
            currentQuiz = null;
        }
    }

    function checkQuiz() {
        if (!currentQuiz) return;

        let score = 0;
        currentQuiz.forEach((q, index) => {
            const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
            if (selectedOption && selectedOption.value === q.correct_answer) {
                score++;
            }
        });

        const resultsContainer = document.getElementById('quiz-results');
        resultsContainer.innerHTML = `You scored ${score} out of ${currentQuiz.length}!`;
    }

    function updateButtonStates() {
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

    function goToPrevPage() {
        if (currentPage > 1) {
            currentPage--;
            displayRules();
        }
    }

    function goToNextPage() {
        if (currentPage < totalPages) {
            currentPage++;
            displayRules();
        }
    }

    prevBtn.addEventListener('click', goToPrevPage);
    nextBtn.addEventListener('click', goToNextPage);

    async function initializeApp() {
        try {
            const response = await fetch('120_Grammar_Rules.json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            allRules = await response.json();
            totalPages = Math.ceil(allRules.length / rulesPerPage);
            displayRules();
        } catch (error) {
            console.error('Error fetching grammar rules:', error);
            rulesContainer.innerHTML = `<p style="color: red;">Could not load grammar rules. Please check if '120_Grammar_Rules.json' is in the same folder and is a valid JSON file.</p>`;
        }
    }

    initializeApp();
});
