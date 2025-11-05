// Wait for the HTML document to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // --- DOM ELEMENTS ---
    const rulesContainer = document.getElementById('rules-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageInfo = document.getElementById('page-info');

    // --- PAGINATION STATE ---
    let allRules = []; // This will be filled from the JSON
    let currentPage = 1;
    const rulesPerPage = 5;
    let totalPages = 0;

    /**
     * Renders the rules for the given page number
     */
    function displayRules() {
        // Clear the container of old rules
        rulesContainer.innerHTML = '';

        // Calculate the start and end index for the current page
        const startIndex = (currentPage - 1) * rulesPerPage;
        const endIndex = startIndex + rulesPerPage;

        // Get the slice of rules for the current page
        const rulesToShow = allRules.slice(startIndex, endIndex);

        // Create and append the HTML for each rule
        rulesToShow.forEach(rule => {
            const ruleElement = document.createElement('div');
            ruleElement.classList.add('rule-card');
            // Use the keys from the JSON file
            ruleElement.innerHTML = `
                <h3>Rule ${rule.rule_number}: ${rule.title}</h3>
                <p>${rule.explanation}</p>
            `;
            rulesContainer.appendChild(ruleElement);
        });

        // Update the page info text
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

        // Update the button disabled states
        updateButtonStates();
    }

    /**
     * Disables or enables the Previous/Next buttons
     */
    function updateButtonStates() {
        prevBtn.disabled = (currentPage === 1);
        nextBtn.disabled = (currentPage === totalPages);
    }

    /**
     * Navigates to the previous page
     */
    function goToPrevPage() {
        if (currentPage > 1) {
            currentPage--;
            displayRules();
        }
    }

    /**
     * Navigates to the next page
     */
    function goToNextPage() {
        if (currentPage < totalPages) {
            currentPage++;
            displayRules();
        }
    }

    // --- EVENT LISTENERS ---
    prevBtn.addEventListener('click', goToPrevPage);
    nextBtn.addEventListener('click', goToNextPage);

    /**
     * --- INITIALIZE APP ---
     * Fetches the rules from the JSON file and starts the app
     */
    async function initializeApp() {
        try {
            const response = await fetch('120_Grammar_Rules.json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            allRules = await response.json();
            
            // Now that we have the rules, set total pages
            totalPages = Math.ceil(allRules.length / rulesPerPage);
            
            // Display the first page
            displayRules();

        } catch (error) {
            console.error('Error fetching grammar rules:', error);
            rulesContainer.innerHTML = `<p style="color: red;">Could not load grammar rules. Please check if '120_Grammar_Rules.json' is in the same folder and is a valid JSON file.</p>`;
        }
    }

    // Start the application
    initializeApp();
});
