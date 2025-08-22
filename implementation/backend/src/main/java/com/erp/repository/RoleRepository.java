package com.erp.repository;

import com.erp.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Role entity operations
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    /**
     * Find role by name (case-insensitive)
     */
    Optional<Role> findByRoleNameIgnoreCase(String roleName);

    /**
     * Check if role name exists (case-insensitive)
     */
    boolean existsByRoleNameIgnoreCase(String roleName);

    /**
     * Find all active roles
     */
    List<Role> findByIsActiveTrueOrderByRoleNameAsc();

    /**
     * Find roles by name containing search term
     */
    List<Role> findByRoleNameContainingIgnoreCaseAndIsActiveTrue(String searchTerm);
}
