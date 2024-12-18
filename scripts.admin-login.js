document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    
    if (username === "admin" && password === "admin123") {
        window.location.href = 'admin-dashboard.html'; 
    } else {
        alert('Invalid credentials. Please try again.');
    }
});
