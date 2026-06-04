
package com.slts.expense_tracker.service;

import com.slts.expense_tracker.dto.AuthResponse;
import com.slts.expense_tracker.dto.LoginRequest;
import com.slts.expense_tracker.dto.RegisterRequest;
import com.slts.expense_tracker.model.User;
import com.slts.expense_tracker.repository.UserRepository;
import com.slts.expense_tracker.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

// Tells JUnit to use Mockito to create mocks automatically
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    // @Mock creates a fake version — no real database calls
    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    // @InjectMocks creates real AuthService and injects the mocks above
    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User existingUser;

    @BeforeEach
    void setUp() {
        // Set up test data before each test
        registerRequest = new RegisterRequest();
        registerRequest.setName("Test User");
        registerRequest.setEmail("test@test.com");
        registerRequest.setPassword("password123");

        loginRequest = new LoginRequest();
        loginRequest.setEmail("test@test.com");
        loginRequest.setPassword("password123");

        existingUser = new User();
        existingUser.setId(1L);
        existingUser.setName("Test User");
        existingUser.setEmail("test@test.com");
        existingUser.setPassword("hashedPassword");
    }

    @Test
    void register_ShouldReturnToken_WhenEmailNotTaken() {
        // ARRANGE — set up what mocks should return
        when(userRepository.existsByEmail("test@test.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(existingUser);
        when(jwtUtil.generateToken("test@test.com")).thenReturn("fake-token");

        // ACT — call the real method
        AuthResponse response = authService.register(registerRequest);

        // ASSERT — verify the result
        assertNotNull(response);
        assertEquals("fake-token", response.getToken());
        assertEquals("Test User", response.getName());
        assertEquals("test@test.com", response.getEmail());

        // Verify save was called exactly once
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_ShouldThrowException_WhenEmailAlreadyExists() {
        // ARRANGE — email already taken
        when(userRepository.existsByEmail("test@test.com")).thenReturn(true);

        // ACT + ASSERT — expect exception
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.register(registerRequest));

        assertEquals("Email already registered", ex.getMessage());

        // Save should never be called if email exists
        verify(userRepository, never()).save(any());
    }

    @Test
    void login_ShouldReturnToken_WhenCredentialsCorrect() {
        // ARRANGE
        when(userRepository.findByEmail("test@test.com"))
                .thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("password123", "hashedPassword"))
                .thenReturn(true);
        when(jwtUtil.generateToken("test@test.com")).thenReturn("fake-token");

        // ACT
        AuthResponse response = authService.login(loginRequest);

        // ASSERT
        assertNotNull(response);
        assertEquals("fake-token", response.getToken());
    }

    @Test
    void login_ShouldThrowException_WhenUserNotFound() {
        // ARRANGE — user doesn't exist
        when(userRepository.findByEmail("test@test.com"))
                .thenReturn(Optional.empty());

        // ACT + ASSERT
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.login(loginRequest));

        assertEquals("User not found", ex.getMessage());
    }

    @Test
    void login_ShouldThrowException_WhenPasswordWrong() {
        // ARRANGE — user exists but password is wrong
        when(userRepository.findByEmail("test@test.com"))
                .thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("password123", "hashedPassword"))
                .thenReturn(false);

        // ACT + ASSERT
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.login(loginRequest));

        assertEquals("Invalid password", ex.getMessage());
    }
}