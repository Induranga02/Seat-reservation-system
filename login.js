
document.addEventListener('DOMContentLoaded', () => {
  const userLoginForm = document.getElementById('user-login-form');
  const adminLoginForm = document.getElementById('admin-login-form');
  const userLoginBtn = document.getElementById('user-login-btn');
  const adminLoginBtn = document.getElementById('admin-login-btn');

  // Toggle between User and Admin login forms
  userLoginBtn.addEventListener('click', () => {
    userLoginForm.style.display = 'block';
    adminLoginForm.style.display = 'none';
    userLoginBtn.classList.add('active');
    adminLoginBtn.classList.remove('active');
  });

  adminLoginBtn.addEventListener('click', () => {
    userLoginForm.style.display = 'none';
    adminLoginForm.style.display = 'block';
    adminLoginBtn.classList.add('active');
    userLoginBtn.classList.remove('active');
  });

  // Handle User Login
  userLoginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch('http://localhost:8080/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
      .then(response => response.json())
      .then(data => {
        localStorage.setItem('userId', data.id);
        localStorage.setItem('userName', data.name);
        alert(`Login successful! Welcome, ${data.name}`);
        window.location.href = 'landingPage.html';  // Redirect to main page
      })
      .catch(error => console.error('Error:', error));
  });

  // Handle Admin Login
  adminLoginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const adminUsername = document.getElementById('admin-username').value;
    const adminPassword = document.getElementById('admin-password').value;

    // Hardcoded admin credentials for now
    if (adminUsername === 'admin01' && adminPassword === '1234') {
      alert('Login successful! Welcome, Admin.');
      window.location.href ='admin-dashboard.html'; // Redirect to Admin Dashboard
    } else {
      alert('Invalid Admin Credentials!');
    }
  });

});


