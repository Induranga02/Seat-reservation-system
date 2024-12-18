document.addEventListener('DOMContentLoaded', () => {
  fetchBookings();
});

function fetchBookings() {
  const userId = localStorage.getItem('userId'); // Retrieve the logged-in user ID

  if (!userId) {
    alert('You must be logged in to view your bookings.');
    window.location.href = 'login.html'; // Redirect to login if not logged in
    return;
  }

  fetch(`http://localhost:8080/api/mybookings?userId=${userId}`)
    .then(response => response.json())
    .then(data => {
      const bookingRows = document.getElementById('booking-rows');
      bookingRows.innerHTML = ''; // Clear any existing rows

      if (data.length === 0) {
        bookingRows.innerHTML = '<tr><td colspan="4">No bookings available</td></tr>';
      } else {
        data.forEach(booking => {
          const formattedDate = booking.date; // Date will be already formatted
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${booking.userName}</td>
              <td>${formattedDate}</td>
              <td>${booking.seatNumber}</td>
              <td>
                <button class="edit-booking" data-id="${booking.id}" data-date="${formattedDate}" data-seat="${booking.seatNumber}">Edit</button>
                <button class="cancel-booking" data-id="${booking.id}">Cancel</button>
              </td>
          `;
          bookingRows.appendChild(row);
        });

        // Add event listeners for edit and cancel buttons (no changes needed here)
        addEventListenersForButtons();
      }
    })
    .catch(error => console.error('Error fetching bookings:', error));
}

function addEventListenersForButtons() {
  const editButtons = document.querySelectorAll('.edit-booking');
  editButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const bookingId = e.target.getAttribute('data-id');
      const bookingDate = e.target.getAttribute('data-date');
      const bookingSeat = e.target.getAttribute('data-seat');

      // Store the current booking details in localStorage
      localStorage.setItem('editBookingId', bookingId);
      localStorage.setItem('editBookingDate', bookingDate);
      localStorage.setItem('editBookingSeat', bookingSeat);

      // Redirect to the home page for editing
      window.location.href = 'index.html';
    });
  });

  const cancelButtons = document.querySelectorAll('.cancel-booking');
  cancelButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const bookingId = e.target.getAttribute('data-id');
      cancelBooking(bookingId);
    });
  });
}
