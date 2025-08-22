package com.erp.service;

import com.erp.entity.User;
import com.erp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service class for User entity operations
 * Handles business logic for user management
 */
@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Create a new user
     */
    public User createUser(User user) {
        // Check if username already exists
        if (userRepository.existsByUsernameIgnoreCase(user.getUsername())) {
            throw new IllegalArgumentException("Username already exists: " + user.getUsername());
        }

        // Check if email already exists
        if (userRepository.existsByEmailIgnoreCase(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + user.getEmail());
        }

        // Encrypt password
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        
        // Set creation timestamp
        user.setCreatedDate(LocalDateTime.now());
        user.setIsActive(true);

        return userRepository.save(user);
    }

    /**
     * Update an existing user
     */
    public User updateUser(Long userId, User userDetails) {
        User existingUser = getUserById(userId);

        // Check username uniqueness (excluding current user)
        if (!existingUser.getUsername().equalsIgnoreCase(userDetails.getUsername()) &&
            userRepository.existsByUsernameIgnoreCase(userDetails.getUsername())) {
            throw new IllegalArgumentException("Username already exists: " + userDetails.getUsername());
        }

        // Check email uniqueness (excluding current user)
        if (!existingUser.getEmail().equalsIgnoreCase(userDetails.getEmail()) &&
            userRepository.existsByEmailIgnoreCase(userDetails.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + userDetails.getEmail());
        }

        // Update fields
        existingUser.setFirstName(userDetails.getFirstName());
        existingUser.setLastName(userDetails.getLastName());
        existingUser.setUsername(userDetails.getUsername());
        existingUser.setEmail(userDetails.getEmail());
        existingUser.setDepartment(userDetails.getDepartment());
        existingUser.setPhoneNumber(userDetails.getPhoneNumber());
        existingUser.setRole(userDetails.getRole());
        existingUser.setModifiedDate(LocalDateTime.now());

        return userRepository.save(existingUser);
    }

    /**
     * Change user password
     */
    public void changePassword(Long userId, String newPassword) {
        User user = getUserById(userId);
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setModifiedDate(LocalDateTime.now());
        userRepository.save(user);
    }

    /**
     * Find user by ID
     */
    @Transactional(readOnly = true)
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
    }

    /**
     * Find user by username
     */
    @Transactional(readOnly = true)
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsernameIgnoreCase(username);
    }

    /**
     * Find user by email
     */
    @Transactional(readOnly = true)
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email);
    }

    /**
     * Get all active users
     */
    @Transactional(readOnly = true)
    public List<User> getAllActiveUsers() {
        return userRepository.findByIsActiveTrueOrderByFirstNameAsc();
    }

    /**
     * Get users by role
     */
    @Transactional(readOnly = true)
    public List<User> getUsersByRole(Long roleId) {
        return userRepository.findByRoleIdAndIsActiveTrue(roleId);
    }

    /**
     * Get users by department
     */
    @Transactional(readOnly = true)
    public List<User> getUsersByDepartment(String department) {
        return userRepository.findByDepartmentIgnoreCaseAndIsActiveTrue(department);
    }

    /**
     * Activate user
     */
    public void activateUser(Long userId) {
        User user = getUserById(userId);
        user.setIsActive(true);
        user.setModifiedDate(LocalDateTime.now());
        userRepository.save(user);
    }

    /**
     * Deactivate user
     */
    public void deactivateUser(Long userId) {
        User user = getUserById(userId);
        user.setIsActive(false);
        user.setModifiedDate(LocalDateTime.now());
        userRepository.save(user);
    }

    /**
     * Delete user (hard delete)
     */
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User not found with ID: " + userId);
        }
        userRepository.deleteById(userId);
    }

    /**
     * Check if username exists
     */
    @Transactional(readOnly = true)
    public boolean usernameExists(String username) {
        return userRepository.existsByUsernameIgnoreCase(username);
    }

    /**
     * Check if email exists
     */
    @Transactional(readOnly = true)
    public boolean emailExists(String email) {
        return userRepository.existsByEmailIgnoreCase(email);
    }

    /**
     * Update last login timestamp
     */
    public void updateLastLogin(Long userId) {
        User user = getUserById(userId);
        user.setLastLoginDate(LocalDateTime.now());
        userRepository.save(user);
    }
}
