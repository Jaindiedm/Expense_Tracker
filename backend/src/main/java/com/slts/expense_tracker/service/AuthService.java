
package com.slts.expense_tracker.service;

import com.slts.expense_tracker.dto.AuthResponse;
import com.slts.expense_tracker.dto.LoginRequest;
import com.slts.expense_tracker.dto.RegisterRequest;
import com.slts.expense_tracker.model.User;
import com.slts.expense_tracker.repository.UserRepository;
import com.slts.expense_tracker.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

// Marks this class as a Spring service component and generates a constructor for all final fields.
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;


    /*Registers a new user.
     - Checks if email already exists
     - Encodes password before saving
     - Saves user in database
     - Generates JWT token for authentication */

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create new user entity
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAddress(request.getAddress());

        // Save user to database
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getName(), user.getEmail());
    }

    //Logs in an existing user.
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify password matches the stored (encoded) password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Generate JWT token for authenticated user
        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getName(), user.getEmail());
    }
}