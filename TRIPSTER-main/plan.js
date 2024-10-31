// JavaScript to update budget display in real-time
const minBudgetSlider = document.getElementById('min-budget');
const maxBudgetSlider = document.getElementById('max-budget');
const minValueDisplay = document.getElementById('min-value');
const maxValueDisplay = document.getElementById('max-value');

// Function to update budget display
function updateBudgetDisplay() {
    const minValue = parseInt(minBudgetSlider.value);
    const maxValue = parseInt(maxBudgetSlider.value);

    if (minValue > maxValue) {
        minBudgetSlider.value = maxValue;  // Prevent min budget from exceeding max budget
    }

    minValueDisplay.textContent = minBudgetSlider.value.toLocaleString();
    maxValueDisplay.textContent = maxBudgetSlider.value.toLocaleString();
}

// Event listeners for real-time updates
minBudgetSlider.addEventListener('input', updateBudgetDisplay);
maxBudgetSlider.addEventListener('input', updateBudgetDisplay);
