document.addEventListener('DOMContentLoaded', function() {
    // Fetch the attendance data from the backend
    fetch('http://localhost:8080/api/admin/attendance')
        .then(response => response.json())
        .then(attendanceData => {
            const attendanceTable = document.getElementById('attendanceTable').getElementsByTagName('tbody')[0];
            attendanceTable.innerHTML = ''; // Clear any existing rows

            attendanceData.forEach((record, index) => {
                const row = attendanceTable.insertRow();
                row.insertCell(0).textContent = record.name;
                row.insertCell(1).textContent = record.date;

                // Create a dropdown for the status (Present/Absent)
                const statusCell = row.insertCell(2);
                const select = document.createElement('select');
                const presentOption = document.createElement('option');
                presentOption.value = 'Present';
                presentOption.textContent = 'Present';
                const absentOption = document.createElement('option');
                absentOption.value = 'Absent';
                absentOption.textContent = 'Absent';

                select.appendChild(presentOption);
                select.appendChild(absentOption);

                // Set the selected value based on the current status
                select.value = record.status;

                // Add a CSS class if the status is 'Absent'
                if (record.status === 'Absent') {
                    row.classList.add('absent');
                }

                // Update the row's class when the status changes
                select.addEventListener('change', function() {
                    row.classList.toggle('absent', select.value === 'Absent');
                });

                statusCell.appendChild(select);

                // Store the selected value for saving later
                record.statusSelect = select;
            });

            // Save button listener
            document.getElementById('saveAttendance').addEventListener('click', function() {
                // Prepare updated attendance data
                const updatedAttendance = attendanceData.map(record => ({
                    name: record.name,
                    date: record.date,
                    status: record.statusSelect.value
                }));

                // Send the updated data to the backend
                fetch('http://localhost:8080/api/admin/saveAttendance', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedAttendance)
                })
                .then(response => response.json())
                .then(data => {
                    alert('Attendance updated successfully!');
                })
                .catch(error => console.error('Error saving attendance:', error));
            });

            // Download attendance report as CSV
            document.getElementById('downloadAttendance').addEventListener('click', function() {
                const csvContent = "data:text/csv;charset=utf-8,Intern Name,Date,Status\n"
                    + attendanceData.map(record => `${record.name},${record.date},${record.statusSelect.value}`).join('\n');

                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "attendance_report.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        })
        .catch(error => console.error('Error fetching attendance data:', error));

    // Logout functionality
    document.getElementById('logout-link').addEventListener('click', function() {
        localStorage.removeItem('adminId');
        localStorage.removeItem('adminName');
        alert('Logged out successfully.');
        window.location.href = 'login.html';
    });
});
