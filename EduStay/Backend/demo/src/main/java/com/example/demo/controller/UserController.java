package com.example.demo.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService;
import com.example.demo.utils.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/auth/users")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://edustay-frontend-56xj.onrender.com"  // replace with your real URL
})
public class UserController {

    @Autowired
    private UserService userservice;

    @Autowired
    private JwtUtil jwtUtil;

    // -----------------------------------------------------
    // REGISTER USER
    // -----------------------------------------------------
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {

            if (user.getName() == null || user.getName().trim().length() < 3)
                return ResponseEntity.badRequest().body(Map.of("error", "Name must be at least 3 characters."));

            if (user.getEmail() == null || !user.getEmail().contains("@"))
                return ResponseEntity.badRequest().body(Map.of("error", "Please enter a valid email address."));

            if (user.getPassword() == null || user.getPassword().length() < 8)
                return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 8 characters."));

            // Check if email exists
            if (userservice.getUserByEmail(user.getEmail()).isPresent())
                return ResponseEntity.badRequest().body(Map.of("error", "Email already exists."));

            userservice.saveUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(user);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Registration failed."));
        }
    }

    // -----------------------------------------------------
    // LOGIN USER
    // -----------------------------------------------------
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {

        if (user.getEmail() == null || user.getEmail().isEmpty() ||
            user.getPassword() == null || user.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required."));
        }

        var dbUserOpt = userservice.getUserByEmail(user.getEmail());

        if (dbUserOpt.isEmpty())
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid email or password."));

        User dbUser = dbUserOpt.get();

        if (!dbUser.getPassword().equals(user.getPassword()))
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid email or password."));

        String token = jwtUtil.generateToken(dbUser.getEmail());

        return ResponseEntity.ok(Map.of("token", token));
    }

    // -----------------------------------------------------
    // GET CURRENT USER
    // -----------------------------------------------------
    @GetMapping("/profile")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {

        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer "))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Token missing or invalid."));

        try {
            String token = header.substring(7);
            String email = jwtUtil.getUsernameFromToken(token);

            var userOpt = userservice.getUserByEmail(email);

            if (userOpt.isEmpty())
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token."));

            return ResponseEntity.ok(userOpt.get());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid or expired token."));
        }
    }

    // -----------------------------------------------------
    // UPDATE PROFILE
    // -----------------------------------------------------
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody User updatedUser, HttpServletRequest request) {

        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer "))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));

        String token = header.substring(7);
        String email = jwtUtil.getUsernameFromToken(token);

        var userOpt = userservice.getUserByEmail(email);
        if (userOpt.isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));

        User user = userOpt.get();

        // Update allowed fields
        if (updatedUser.getName() != null) user.setName(updatedUser.getName());
        if (updatedUser.getPhone() != null) user.setPhone(updatedUser.getPhone());
        if (updatedUser.getRole() != null) user.setRole(updatedUser.getRole());

        // Email cannot be changed (JWT depends on it)
        if (updatedUser.getEmail() != null && !updatedUser.getEmail().equals(user.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email cannot be changed after registration."));
        }

        userservice.saveUser(user);

        return ResponseEntity.ok(user);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteAllUsers() {
        userservice.deleteAllUsers();
        return ResponseEntity.ok("All users deleted.");
    }

    

}
