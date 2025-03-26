const states = { 
    "Andhra Pradesh": "Andhra Pradesh", 
    "Arunachal Pradesh": "Arunachal Pradesh", 
    "Assam": "Assam", 
    "Bihar": "Bihar", 
    "Chhattisgarh": "Chhattisgarh", 
    "Goa": "Goa", 
    "Gujarat": "Gujarat", 
    "Haryana": "Haryana", 
    "Himachal Pradesh": "Himachal Pradesh", 
    "Jharkhand": "Jharkhand", 
    "Karnataka": "Karnataka", 
    "Kerala": "Kerala", 
    "Madhya Pradesh": "Madhya Pradesh", 
    "Maharashtra": "Maharashtra", 
    "Manipur": "Manipur", 
    "Meghalaya": "Meghalaya", 
    "Mizoram": "Mizoram", 
    "Nagaland": "Nagaland", 
    "Odisha": "Odisha", 
    "Punjab": "Punjab", 
    "Rajasthan": "Rajasthan",
    "Sikkim": "Sikkim", 
    "Tamil Nadu": "Tamil Nadu",
    "Telangana": "Telangana", 
    "Tripura": "Tripura", 
    "Uttar Pradesh": "Uttar Pradesh", 
    "Uttarakhand": "Uttarakhand", 
    "West Bengal": "West Bengal"
};


// Get the select element
const destinationSelect = document.getElementById("destination");

// Get the state names
const stateNames = Object.keys(states);

// Populate the dropdown with state names
stateNames.forEach(state => {
    const option = document.createElement("option");
    option.value = state; // Set the value of the option
    option.textContent = state; // Set the display text of the option
    destinationSelect.appendChild(option); // Append the option to the select element
});


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


minBudgetSlider.addEventListener('input', updateBudgetDisplay);
maxBudgetSlider.addEventListener('input', updateBudgetDisplay);

document.getElementById('trip-form').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const tripData = {
        destination: document.getElementById('destination').value,
        from: document.getElementById('from').value,
        startDate: new Date(document.getElementById('start-date').value),
        endDate: new Date(document.getElementById('end-date').value),
        minBudget: parseFloat(document.getElementById('min-budgett').value),
        maxBudget: parseFloat(document.getElementById('max-budget').value),
        tourists: parseInt(document.getElementById('tourists').value),
        activities: document.getElementById('activities').value.split(',') 
    };
     console.log(tripData)
 
    try {
        const response = await fetch('/api/user/trip', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tripData)
        });
       

        if (response.ok) {
            const result = await response.json();
            console.log('Trip added successfully:', result,tripData);
            
        } else {
            const error = await response.json();
            console.log(response)
            console.error('Error adding trip:', error);
            
        }
    } catch (error) {
        console.error('Network error:', error);
    }
});

