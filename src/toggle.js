// Toggle Dark Mode Script
document.addEventListener("DOMContentLoaded", function () {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;

    // Check for saved preference in localStorage
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
        darkModeToggle.textContent = "Light Mode"; // Update button text to reflect current mode
        console.log("Dark mode is enabled from localStorage");
    } else {
        // Light mode is the default
        darkModeToggle.textContent = "Dark Mode"; // Default button text
        console.log("Light mode is enabled by default");
    }

    // Event listener for dark mode toggle
    darkModeToggle.addEventListener("click", function () {
        body.classList.toggle("dark-mode");
        const isDarkMode = body.classList.contains("dark-mode");
        darkModeToggle.textContent = isDarkMode ? "Light Mode" : "Dark Mode"; // Update button text
        console.log("Dark mode toggled:", isDarkMode);

        // Save preference in localStorage
        localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");
    });
});