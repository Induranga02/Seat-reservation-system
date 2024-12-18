document.addEventListener('DOMContentLoaded', () => {
    const bookNowButton = document.getElementById('book-now-btn');
    const logoutButton = document.getElementById('logout-btn');
  
    // Redirect to bookings page when clicking the "Book Now" button
    bookNowButton.addEventListener('click', () => {
      window.location.href = 'index.html'; // Redirect to bookings.html
    });
  
    // Log out functionality
    logoutButton.addEventListener('click', () => {
      // Clear user data from localStorage (or sessionStorage)
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      
      // Show alert message and redirect to login page
      alert('Logged out successfully.');
      window.location.href = 'login.html'; // Redirect to login.html
    });
  });
  