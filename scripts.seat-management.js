document.addEventListener('DOMContentLoaded', function () {
    // Fetch upcoming bookings from the backend
    fetch('http://localhost:8080/api/admin/upcomingBookings')
        .then(response => response.json())
        .then(bookings => {
            const seatTable = document.getElementById('seatTable').getElementsByTagName('tbody')[0];
            seatTable.innerHTML = ''; // Clear the existing table rows

            // Populate the table with upcoming bookings
            bookings.forEach(booking => {
                const row = seatTable.insertRow();
                row.insertCell(0).textContent = booking.seatNumber;
                row.insertCell(1).textContent = booking.userName;
                row.insertCell(2).textContent = booking.status || 'Occupied'; // Default to "Occupied" if no status
                const actionCell = row.insertCell(3);

                // Create Hold/Unhold button
                const holdButton = document.createElement('button');
                holdButton.textContent = booking.status === 'Held' ? 'Unhold Seat' : 'Hold Seat';
                holdButton.style.backgroundColor = booking.status === 'Held' ? 'yellow' : '';

                holdButton.addEventListener('click', function () {
                    const newStatus = booking.status === 'Held' ? 'Occupied' : 'Held';
                    holdSeat(booking.id, newStatus, row, holdButton); // Function to handle the hold/unhold logic
                });

                actionCell.appendChild(holdButton);
            });
        })
        .catch(error => console.error('Error fetching seat data:', error));

    // Handle holding/unholding a seat
    function holdSeat(bookingId, newStatus, row, holdButton) {
        // Send the request to the backend to update the seat status
        fetch(`http://localhost:8080/api/admin/bookings/${bookingId}/status?status=${newStatus}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(updatedBooking => {
                // Update the status in the frontend
                row.cells[2].textContent = updatedBooking.status;
                holdButton.textContent = updatedBooking.status === 'Held' ? 'Unhold Seat' : 'Hold Seat';
                holdButton.style.backgroundColor = updatedBooking.status === 'Held' ? 'yellow' : ''; // Change color
            })
            .catch(error => console.error('Error updating seat status:', error));
    }

    // Handle adding a new seat (For demonstration purposes)
    document.getElementById('addSeat').addEventListener('click', function () {
        const newSeat = {
            seatNumber: prompt("Enter seat number:"),
            internName: 'New Intern',
            status: 'Occupied'
        };

        // Add new seat locally and re-render the table (For now, doesn't persist to backend)
        const seatTable = document.getElementById('seatTable').getElementsByTagName('tbody')[0];
        const row = seatTable.insertRow();
        row.insertCell(0).textContent = newSeat.seatNumber;
        row.insertCell(1).textContent = newSeat.internName;
        row.insertCell(2).textContent = newSeat.status;

        const actionCell = row.insertCell(3);
        const holdButton = document.createElement('button');
        holdButton.textContent = 'Hold Seat';
        holdButton.addEventListener('click', function () {
            if (newSeat.status === 'Occupied') {
                newSeat.status = 'Held';
                row.cells[2].textContent = 'Held';
                holdButton.textContent = 'Unhold Seat';
                holdButton.style.backgroundColor = 'yellow';
            } else {
                newSeat.status = 'Occupied';
                row.cells[2].textContent = 'Occupied';
                holdButton.textContent = 'Hold Seat';
                holdButton.style.backgroundColor = '';
            }
        });
        actionCell.appendChild(holdButton);
    });

    // Logout functionality
    document.getElementById('logout-link').addEventListener('click', function () {
        // Clear any user data from localStorage
        localStorage.removeItem('adminId');
        localStorage.removeItem('adminName');
        alert('Logged out successfully.');
        window.location.href = 'login.html';
    });
});
