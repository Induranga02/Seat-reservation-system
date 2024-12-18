document.addEventListener('DOMContentLoaded', () => {
  const seats = document.querySelectorAll('.seat');
  const bookNowButton = document.getElementById('book-now');
  const reservationDateInput = document.getElementById('reservation-date');
  const logoutButton = document.getElementById('logout-btn'); // Log-out button
  let selectedSeat = null;

  // Set the min and max dates for the date picker
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 7); // Set max date to 7 days ahead

  // Format the dates to yyyy-mm-dd for the input
  const todayFormatted = today.toISOString().split('T')[0];
  const maxDateFormatted = maxDate.toISOString().split('T')[0];

  reservationDateInput.setAttribute('min', todayFormatted);
  reservationDateInput.setAttribute('max', maxDateFormatted);

  // Check if user is logged in
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  if (!userId) {
    alert('You must be logged in to book a seat.');
    window.location.href = 'login.html'; // Redirect to login page if not logged in
    return;
  }

  // Handle Log Out functionality
  logoutButton.addEventListener('click', () => {
    // Clear user data from localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    
    // Show alert message and redirect to login page
    alert('Logged out successfully.');
    window.location.href = 'login.html'; // Redirect to login.html
  });

  // Check if we are in edit mode
  const editBookingId = localStorage.getItem('editBookingId');
  const editBookingDate = localStorage.getItem('editBookingDate');
  const editBookingSeat = localStorage.getItem('editBookingSeat');

  if (editBookingId) {
    // Pre-fill the date and seat selection for editing
    reservationDateInput.value = formatDateForInput(editBookingDate);

    // Pre-select the seat
    seats.forEach(seat => {
      if (seat.dataset.seat === editBookingSeat) {
        seat.classList.add('selected');
        selectedSeat = seat;
      }
    });
  }

  // Fetch booked seats when a date is selected
  reservationDateInput.addEventListener('change', () => {
    const selectedDate = reservationDateInput.value;
    if (selectedDate) {
      fetchBookedSeats(selectedDate); // Fetch booked seats for the selected date
    }
  });

  // Fetch booked seats from the backend
  function fetchBookedSeats(date) {
    fetch(`http://localhost:8080/api/bookedSeats?date=${date}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch booked seats.');
        }
        return response.json();
      })
      .then(bookedSeats => {
        // Reset all seats to available
        seats.forEach(seat => {
          seat.classList.remove('unavailable', 'selected');
          seat.classList.add('available');
          seat.disabled = false;
        });

        // Mark booked seats as unavailable
        bookedSeats.forEach(seatNumber => {
          const seatElement = document.querySelector(`.seat[data-seat="${seatNumber}"]`);
          if (seatElement) {
            seatElement.classList.remove('available');
            seatElement.classList.add('unavailable');
            seatElement.disabled = true; // Disable the booked seat
          }
        });
      })
      .catch(error => {
        console.error('Error fetching booked seats:', error);
        alert('Failed to fetch booked seats. Please try again later.');
      });
  }

  // Select/Deselect seat (only one seat allowed)
  seats.forEach(seat => {
    seat.addEventListener('click', () => {
      if (seat.classList.contains('unavailable')) {
        alert('This seat is already booked.');
        return; // Prevent selection of unavailable seats
      }

      if (selectedSeat && selectedSeat !== seat) {
        selectedSeat.classList.remove('selected');
      }
      seat.classList.toggle('selected');
      selectedSeat = seat.classList.contains('selected') ? seat : null;
    });
  });

  // Booking the seat and sending data to backend
  bookNowButton.addEventListener('click', () => {
    const reservationDate = reservationDateInput.value;

    if (!reservationDate) {
      alert('Please select a date for your reservation!');
      return;
    }

    // Check if the selected date is a weekend (Saturday or Sunday)
    const selectedDate = new Date(reservationDate);
    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 6 || dayOfWeek === 0) { // 6 = Saturday, 0 = Sunday
      alert('Bookings are not allowed on weekends (Saturday or Sunday).');
      return;
    }

    const seatNumber = selectedSeat ? selectedSeat.dataset.seat : null;

    if (!seatNumber) {
      alert('Please select a seat to book!');
      return;
    }

    // Format the reservation date to dd-MM-yyyy
    const formattedDate = `${selectedDate.getDate().toString().padStart(2, '0')}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getFullYear()}`;

    const bookingData = {
      date: formattedDate,
      seatNumber: seatNumber,
      user: {
        id: userId,
        name: userName
      }
    };

    // If in edit mode, update the booking
    if (editBookingId) {
      fetch(`http://localhost:8080/api/bookings/${editBookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      })
      .then(response => response.json())
      .then(() => {
        alert('Booking updated successfully.');
        localStorage.removeItem('editBookingId');
        localStorage.removeItem('editBookingDate');
        localStorage.removeItem('editBookingSeat');
        window.location.href = 'mybookings.html'; // Redirect back to the bookings page
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to update booking. Please try again.');
      });
    } else {
      // Create a new booking
      fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      })
      .then(response => response.json())
      .then(data => {
        alert(`Seat ${data.seatNumber} booked successfully for ${data.date}.`);
        selectedSeat.classList.remove('selected');
        selectedSeat = null;
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Booking failed. Please try again.');
      });
    }
  });
});

// Helper function to format date for input[type="date"]
function formatDateForInput(dateStr) {
  const parts = dateStr.split('-');
  return `${parts[2]}-${parts[1]}-${parts[0]}`; // Format: yyyy-mm-dd for input element
}
