document.addEventListener('DOMContentLoaded', function() {
    fetchTotalBookedSeats();
    fetchRecentBookings();
    displayTodayDate();
});

function fetchTotalBookedSeats() {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    fetch(`http://localhost:8080/api/admin/totalBookedSeats?date=${today}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('seatsOccupied').textContent = data.bookedSeats;
            document.getElementById('seatsAvailable').textContent = data.availableSeats;
        })
        .catch(error => console.error('Error fetching total seats:', error));
}

function fetchRecentBookings() {
    fetch('http://localhost:8080/api/admin/recentBookings')
        .then(response => response.json())
        .then(bookings => {
            const recentBookingsList = document.getElementById('recentBookings');
            recentBookingsList.innerHTML = ''; // Clear previous content

            if (bookings.length === 0) {
                const li = document.createElement('li');
                li.textContent = 'No recent bookings available';
                recentBookingsList.appendChild(li);
            } else {
                bookings.forEach(booking => {
                    // Manually parse the date if it's in dd-MM-yyyy format
                    const dateParts = booking.date.split('-'); // Assumes booking.date is in dd-MM-yyyy format
                    const formattedDate = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;

                    const li = document.createElement('li');
                    li.textContent = `${booking.userName} - Seat ${booking.seatNumber} - Date ${formattedDate}`;
                    recentBookingsList.appendChild(li);
                });
            }
        })
        .catch(error => console.error('Error fetching recent bookings:', error));
}

// Function to format and display today's date
function displayTodayDate() {
    const dateElement = document.getElementById('todayDate');
    
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    // Format the date (e.g., Monday 04th November)
    const day = today.getDate();
    const daySuffix = (day == 1 || day == 21 || day == 31) ? 'st' : (day == 2 || day == 22) ? 'nd' : (day == 3 || day == 23) ? 'rd' : 'th';
    const formattedDate = today.toLocaleDateString('en-US', options).replace(today.getDate(), `${day}${daySuffix}`);

    dateElement.textContent = formattedDate;
}

document.getElementById('logout-link').addEventListener('click', function() {
    // Clear any user data from localStorage
    localStorage.removeItem('adminId'); // Assuming you store admin data with key 'adminId'
    localStorage.removeItem('adminName'); // Assuming 'adminName' is stored

    // Optionally display a logout message
    alert('Logged out successfully.');

    // Redirect to the login page
    window.location.href = 'login.html';
});




