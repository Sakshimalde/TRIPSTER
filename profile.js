// profile.js
document.getElementById("edit-button").addEventListener("click", function () {
    const form = document.getElementById("edit-profile-form");
    if (form.style.display === "none") {
        form.style.display = "block";
    } else {
        form.style.display = "none";
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const editProfileForm = document.getElementById('edit-profile-form');
    
    editProfileForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = {
            fullName: document.getElementById('full-name').value,
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            location: document.getElementById('location').value,
            bio: document.getElementById('bio').value
        };

        try {
            const response = await fetch('/api/update-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                alert('Profile updated successfully!');
                // Optionally, you can update the UI with the new data
            } else {
                alert('Error updating profile: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});