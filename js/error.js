document.addEventListener('DOMContentLoaded', function() {
// List of valid paths (you can dynamically fetch this from your server if needed)
const validPaths = ['/home', '/about', '/contest', '/terms']; // Adjust with actual valid URLs

// Function to handle showing the 404 page
function handle404() {
    const errorPage = document.getElementById("error-page");
    const content = document.getElementById("content");
    
    content.style.display = "none"; // Hide main content
    errorPage.style.display = "block"; // Show 404 page
}

// Check the current page's path
const currentPath = window.location.pathname;

// If the current path is not valid, show the 404 page
if (!validPaths.includes(currentPath)) {
    handle404();
}
});
