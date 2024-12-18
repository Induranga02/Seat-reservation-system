package com.induranga.seat_reserve.Repo;

import com.induranga.seat_reserve.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User,Integer> {
    User findByEmail(String email);
}
