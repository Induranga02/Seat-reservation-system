document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;


    alert(`Admin account created successfully!\nUsername: ${username}\nEmail: ${email}`);
    window.location.href = 'admin-login.html'; 
});
