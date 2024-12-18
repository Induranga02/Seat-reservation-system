package com.induranga.seat_reserve.Service;

import com.induranga.seat_reserve.Model.User;
import com.induranga.seat_reserve.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    public User registerUser(User user) {
        return userRepo.save(user);
    }

    public User loginUser(String email, String password) {
        User user = userRepo.findByEmail(email);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }

    public User findUserById(int userId) {
        return userRepo.findById(userId).orElse(null);
    }

    public User findOrRegisterGoogleUser(String email, String name) {
        // Check if user exists
        User user = userRepo.findByEmail(email);
        if (user != null) {
            return user; // Existing user
        }

        // Create a new user for Google Sign-In
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setName(name);
        newUser.setPassword(null); // Password is not required for Google users
        return userRepo.save(newUser);
    }

    public User findByEmail(String email) {
        return userRepo.findByEmail(email);
    }
}
