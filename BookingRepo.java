package com.induranga.seat_reserve.Repo;

import com.induranga.seat_reserve.Model.Booking;
import com.induranga.seat_reserve.Model.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Repository
public interface BookingRepo extends JpaRepository<Booking,Integer> {
    List<Booking> findByUserOrderByDateDesc(User user); // Orders bookings by date in descending order

    @Query("SELECT b.seatNumber FROM Booking b WHERE DATE(b.date) = :date")
    List<Integer> findBookedSeatsByDate(@Param("date") Date date);

    @Query("SELECT COUNT(b) FROM Booking b WHERE DATE(b.date) = :date")
    int countBookingsForDate(@Param("date") Date date);

    // Fetch recent bookings (limit by provided number)
    @Query("SELECT b FROM Booking b ORDER BY b.date DESC")
    List<Booking> findRecentBookingsWithLimit(Pageable pageable);

    @Query("SELECT b.seatNumber FROM Booking b WHERE DATE(b.date) = :date AND b.status = 'Occupied'")
    List<Integer> findOccupiedSeatsByDate(@Param("date") Date date);

    @Query("SELECT b FROM Booking b WHERE b.status = :status AND b.date >= CURRENT_DATE")
    List<Booking> findBookingsByStatus(@Param("status") String status);

    @Query("SELECT b FROM Booking b WHERE b.date >= CURRENT_DATE ORDER BY b.date ASC")
    List<Booking> findUpcomingBookings();

}