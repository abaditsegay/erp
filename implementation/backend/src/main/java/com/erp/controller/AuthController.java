package com.erp.controller;

import com.erp.entity.User;
import com.erp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * REST Controller for Authentication operations
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * User login endpoint
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Optional<User> userOpt = userService.getUserByUsername(loginRequest.getUsername());
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid username or password");
            }
            
            User user = userOpt.get();
            
            if (!user.getIsActive()) {
                return ResponseEntity.badRequest().body("Account is disabled");
            }
            
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
                return ResponseEntity.badRequest().body("Invalid username or password");
            }
            
            // Update last login
            userService.updateLastLogin(user.getId());
            
            // Create response (in real implementation, you'd generate JWT token here)
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", createUserResponse(user));
            response.put("token", "mock-jwt-token-" + user.getId()); // Mock token for now
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Login failed: " + e.getMessage());
        }
    }

    /**
     * User logout endpoint
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // In real implementation, you'd invalidate the JWT token
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * Get current user profile
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestParam Long userId) {
        try {
            User user = userService.getUserById(userId);
            return ResponseEntity.ok(createUserResponse(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("User not found");
        }
    }

    /**
     * Create user response without sensitive data
     */
    private Map<String, Object> createUserResponse(User user) {
        Map<String, Object> userResponse = new HashMap<>();
        userResponse.put("id", user.getId());
        userResponse.put("username", user.getUsername());
        userResponse.put("email", user.getEmail());
        userResponse.put("firstName", user.getFirstName());
        userResponse.put("lastName", user.getLastName());
        userResponse.put("department", user.getDepartment());
        userResponse.put("phoneNumber", user.getPhoneNumber());
        userResponse.put("isActive", user.getIsActive());
        userResponse.put("lastLoginDate", user.getLastLoginDate());
        
        if (user.getRole() != null) {
            Map<String, Object> roleResponse = new HashMap<>();
            roleResponse.put("id", user.getRole().getId());
            roleResponse.put("roleName", user.getRole().getRoleName());
            roleResponse.put("description", user.getRole().getDescription());
            userResponse.put("role", roleResponse);
        }
        
        return userResponse;
    }

    /**
     * DTO for login requests
     */
    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
