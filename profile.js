// profile.js
document.getElementById("edit-button").addEventListener("click", function () {
    const form = document.getElementById("edit-profile-form");
    if (form.style.display === "none") {
        form.style.display = "block";
    } else {
        form.style.display = "none";
    }
});
