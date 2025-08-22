package com.erp.repository;

import com.erp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for User entity operations
 * Provides CRUD operations and custom queries for user management
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by username (case-insensitive)
     */
    Optional<User> findByUsernameIgnoreCase(String username);

    /**
     * Find user by email (case-insensitive)
     */
    Optional<User> findByEmailIgnoreCase(String email);

    /**
     * Check if username exists (case-insensitive)
     */
    boolean existsByUsernameIgnoreCase(String username);

    /**
     * Check if email exists (case-insensitive)
     */
    boolean existsByEmailIgnoreCase(String email);

    /**
     * Find all active users
     */
    List<User> findByIsActiveTrueOrderByFirstNameAsc();

    /**
     * Find users by role ID
     */
    List<User> findByRoleIdAndIsActiveTrue(Long roleId);

    /**
     * Find users by department
     */
    List<User> findByDepartmentIgnoreCaseAndIsActiveTrue(String department);
}
