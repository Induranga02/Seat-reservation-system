package com.induranga.seat_reserve.Controller;

import com.induranga.seat_reserve.Model.Booking;
import com.induranga.seat_reserve.Model.User;
import com.induranga.seat_reserve.Service.BookingService;
import com.induranga.seat_reserve.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserService userService; // To fetch the user

    // Get bookings for a specific user
    @GetMapping("/mybookings")
    public List<Booking> getUserBookings(@RequestParam int userId) {
        User user = userService.findUserById(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        return bookingService.getBookingsByUser(user); // Fetch bookings filtered by user
    }

    // Create a new booking
    @PostMapping("/bookings")
    public Booking addBooking(@RequestBody Booking booking) {
        User user = userService.findUserById(booking.getUser().getId());
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Date bookingDate = booking.getDate();
        Date today = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(today);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        Date currentDate = calendar.getTime();

        // Add 7 days to the current date to calculate the max date
        calendar.add(Calendar.DAY_OF_YEAR, 7);
        Date maxDate = calendar.getTime();

        // Ensure the booking date is within the valid range
        if (bookingDate.before(currentDate) || bookingDate.after(maxDate)) {
            throw new RuntimeException("Booking date must be within the next 7 days, starting from today.");
        }

        // Weekend validation: ensure bookings are not allowed on Saturday or Sunday
        Calendar bookingCalendar = Calendar.getInstance();
        bookingCalendar.setTime(bookingDate);
        int dayOfWeek = bookingCalendar.get(Calendar.DAY_OF_WEEK);
        if (dayOfWeek == Calendar.SATURDAY || dayOfWeek == Calendar.SUNDAY) {
            throw new RuntimeException("Bookings are not allowed on weekends (Saturday or Sunday).");
        }

        // Set user and username
        booking.setUser(user);
        booking.setUserName(booking.getUser().getName());

        return bookingService.addBooking(booking);
    }

    @DeleteMapping("/bookings/{id}")
    public String cancelBooking(@PathVariable int id){
        boolean isDeleted = bookingService.cancelBooking(id);
        if (isDeleted){
            return "Booking cancelled successfully."; // Simple message indicating success
        } else {
            throw new RuntimeException("Booking not found.");
        }
    }

    @PutMapping("/bookings/{id}")
    public Booking updateBooking(@PathVariable int id, @RequestBody Booking bookingDetails) {
        // Apply the same validations for updating
        Date bookingDate = bookingDetails.getDate();
        Date today = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(today);
        calendar.add(Calendar.DAY_OF_YEAR, 7);
        Date maxDate = calendar.getTime();

        if (bookingDate.before(today) || bookingDate.after(maxDate)) {
            throw new RuntimeException("Booking date must be within the next 7 days.");
        }

        Calendar bookingCalendar = Calendar.getInstance();
        bookingCalendar.setTime(bookingDate);
        int dayOfWeek = bookingCalendar.get(Calendar.DAY_OF_WEEK);
        if (dayOfWeek == Calendar.SATURDAY || dayOfWeek == Calendar.SUNDAY) {
            //throw new RuntimeException("Bookings are not allowed on weekends (Saturday or Sunday).");
        }

        return bookingService.updateBooking(id, bookingDetails);
    }

    @GetMapping ("/bookedSeats")
    public List<Integer>getBookedSeats(@RequestParam String date){
        return bookingService.getBookedSeatsByDate(date);
    }

    @GetMapping("/admin/totalBookedSeats")
    public ResponseEntity<Map<String, Object>> getTotalBookedSeats(@RequestParam String date) {
        int totalSeats = 60;
        int bookedSeats = bookingService.countBookingsForDate(date);
        int availableSeats = totalSeats - bookedSeats;

        Map<String, Object> response = new HashMap<>();
        response.put("bookedSeats", bookedSeats);
        response.put("availableSeats", availableSeats);

        return ResponseEntity.ok(response);
    }

    // Fetch recent bookings (latest 3)
    @GetMapping("/admin/recentBookings")
    public ResponseEntity<List<Booking>> getRecentBookings() {
        List<Booking> recentBookings = bookingService.getRecentBookings(3); // Fetch 3 recent bookings
        return ResponseEntity.ok(recentBookings);
    }

    @GetMapping("/admin/attendance")
    public ResponseEntity<List<Map<String, String>>> getAllBookingsForAttendance() {
        List<Map<String, String>> bookings = bookingService.getAllBookingsForAttendance();
        return ResponseEntity.ok(bookings);
    }

    // Fetch upcoming bookings with status 'Occupied'
    @GetMapping("/admin/upcomingBookings")
    public ResponseEntity<List<Booking>> getUpcomingBookings() {
        List<Booking> upcomingBookings = bookingService.getUpcomingBookings();
        return ResponseEntity.ok(upcomingBookings);
    }

    // Update the status of a booking (Hold/Unhold)
    @PutMapping("/admin/bookings/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(@PathVariable int id, @RequestParam String status) {
        Booking updatedBooking = bookingService.updateBookingStatus(id, status);
        return ResponseEntity.ok(updatedBooking);
    }
}
