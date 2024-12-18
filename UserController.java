package com.induranga.seat_reserve.Controller;

import com.induranga.seat_reserve.DTO.LoginRequest;
import com.induranga.seat_reserve.Model.User;
import com.induranga.seat_reserve.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public User loginUser(@RequestBody LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        User user = userService.loginUser(email, password);
        if (user != null) {
            return user;
        } else {
            throw new RuntimeException("Invalid email or password");
        }
    }

    @PostMapping("/google-login")
    public User loginOrRegisterGoogleUser(@RequestBody Map<String, String> googleUserData) {
        String email = googleUserData.get("email");
        String name = googleUserData.get("name");

        if (email == null || name == null) {
            throw new RuntimeException("Invalid Google User Data");
        }

        // Check if user exists
        User existingUser = userService.findByEmail(email);

        if (existingUser != null) {
            // Existing user; return the user data
            return existingUser;
        }

        // If not found, register a new user
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setName(name);
        newUser.setPassword(null); // Google users don't have passwords
        return userService.registerUser(newUser);
    }

}
