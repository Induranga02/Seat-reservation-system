document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
  
    fetch('http://localhost:8080/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    })
    .then(response => response.json())
    .then(data => {
      alert('Signup successful! Please log in.');
      window.location.href = 'login.html';  // Redirect to login page
    })
    .catch(error => console.error('Error:', error));
  });
  