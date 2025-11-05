document.addEventListener('DOMContentLoaded', () => {
    const rulesContainer = document.getElementById('rules-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageInfo = document.getElementById('page-info');

    let allRules = [];
    let currentPage = 1;
    const rulesPerPage = 10; // Changed from 5 to 10
    let totalPages = 0;

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
                    return `<li class="example-item ${example.type}">${example.sentence}</li>`;
                }).join('');

                examplesHTML = `
                    <h4 class="examples-heading">Examples</h4>
                    <ul class="examples-list">
                        ${exampleItems}
                    </ul>
                `;
            }

            ruleElement.innerHTML = `
                <h3 class="rule-title">Rule ${rule.rule_number}: ${rule.title}</h3>
                <p class="rule-explanation">${rule.explanation}</p>
                ${examplesHTML}
            `;
            rulesContainer.appendChild(ruleElement);
        });

        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        updateButtonStates();
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
