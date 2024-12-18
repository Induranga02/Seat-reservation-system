package com.induranga.seat_reserve.Service;

import com.induranga.seat_reserve.Model.Booking;
import com.induranga.seat_reserve.Model.User;
import com.induranga.seat_reserve.Repo.BookingRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;

@Service
public class BookingService {

    @Autowired
    private BookingRepo bookingRepo;

    // Fetch all bookings for a specific user
    public List<Booking> getBookingsByUser(User user) {
        return bookingRepo.findByUserOrderByDateDesc(user);
    }

    public Booking addBooking(Booking booking) {
        return bookingRepo.save(booking);
    }

    public boolean cancelBooking(int id) {
        if(bookingRepo.existsById(id)){
            bookingRepo.deleteById(id);
            return true;
        }
        return false;
    }

    public Booking updateBooking(int id, Booking bookingDetails) {
        return bookingRepo.findById(id).map(booking -> {
            booking.setDate(bookingDetails.getDate());
            booking.setSeatNumber(bookingDetails.getSeatNumber());
            return bookingRepo.save(booking);
        }).orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public List<Integer> getBookedSeatsByDate(String date) {
        // Format the date from string to match your database format (dd-MM-yyyy or yyyy-MM-dd)
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        Date bookingDate;
        try {
            bookingDate = format.parse(date);
        } catch (ParseException e) {
            throw new RuntimeException("Invalid date format");
        }
        return bookingRepo.findBookedSeatsByDate(bookingDate);
    }

    public int countBookingsForDate(String date) {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        Date bookingDate;
        try {
            bookingDate = format.parse(date);
        } catch (ParseException e) {
            throw new RuntimeException("Invalid date format");
        }
        return bookingRepo.countBookingsForDate(bookingDate);
    }

    public List<Booking> getRecentBookings(int limit) {
        Pageable pageable = PageRequest.of(0, limit); // Page index 0, and limit to 3
        return bookingRepo.findRecentBookingsWithLimit(pageable);
    }

    public List<Map<String, String>> getAllBookingsForAttendance() {
        List<Booking> allBookings = bookingRepo.findAll();
        List<Map<String, String>> attendanceList = new ArrayList<>();

        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");

        for (Booking booking : allBookings) {
            Map<String, String> record = new HashMap<>();
            record.put("name", booking.getUser().getName());
            record.put("date", dateFormat.format(booking.getDate()));  // Format the date to dd-MM-yyyy
            record.put("status", "Present");  // Default to "Present" initially, you can modify this based on logic

            attendanceList.add(record);
        }

        return attendanceList;
    }

    public List<Booking> getUpcomingBookings() {
        return bookingRepo.findUpcomingBookings();  // Fetch bookings for future dates
    }

    public Booking updateBookingStatus(int bookingId, String status) {
        return bookingRepo.findById(bookingId).map(booking -> {
            booking.setStatus(status);
            return bookingRepo.save(booking);
        }).orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public List<Integer> getOccupiedSeatsByDate(String date) {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        Date bookingDate;
        try {
            bookingDate = format.parse(date);
        } catch (ParseException e) {
            throw new RuntimeException("Invalid date format");
        }
        return bookingRepo.findOccupiedSeatsByDate(bookingDate);
    }

}
