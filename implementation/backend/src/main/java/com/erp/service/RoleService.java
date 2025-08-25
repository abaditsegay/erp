package com.erp.service;

import com.erp.entity.Role;
import com.erp.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service class for Role entity operations
 * Handles business logic for role management
 */
@Service
@Transactional
public class RoleService {

    private final RoleRepository roleRepository;

    @Autowired
    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    /**
     * Create a new role
     */
    public Role createRole(Role role) {
        // Check if role name already exists
        if (roleRepository.existsByRoleNameIgnoreCase(role.getRoleName())) {
            throw new IllegalArgumentException("Role name already exists: " + role.getRoleName());
        }

        // Set creation timestamp
        role.setCreatedDate(LocalDateTime.now());
        role.setIsActive(true);

        return roleRepository.save(role);
    }

    /**
     * Update an existing role
     */
    public Role updateRole(Long roleId, Role roleDetails) {
        Role existingRole = getRoleById(roleId);

        // Check role name uniqueness (excluding current role)
        if (!existingRole.getRoleName().equalsIgnoreCase(roleDetails.getRoleName()) &&
            roleRepository.existsByRoleNameIgnoreCase(roleDetails.getRoleName())) {
            throw new IllegalArgumentException("Role name already exists: " + roleDetails.getRoleName());
        }

        // Update fields
        existingRole.setRoleName(roleDetails.getRoleName());
        existingRole.setDescription(roleDetails.getDescription());
        existingRole.setModifiedDate(LocalDateTime.now());

        return roleRepository.save(existingRole);
    }

    /**
     * Find role by ID
     */
    @Transactional(readOnly = true)
    public Role getRoleById(Long roleId) {
        return roleRepository.findById(roleId)
                .orElseThrow(() -> new IllegalArgumentException("Role not found with ID: " + roleId));
    }

    /**
     * Get all active roles
     */
    @Transactional(readOnly = true)
    public List<Role> getAllActiveRoles() {
        return roleRepository.findByIsActiveTrueOrderByRoleNameAsc();
    }

    /**
     * Delete role (hard delete)
     */
    public void deleteRole(Long roleId) {
        if (!roleRepository.existsById(roleId)) {
            throw new IllegalArgumentException("Role not found with ID: " + roleId);
        }
        roleRepository.deleteById(roleId);
    }

    /**
     * Check if role name exists
     */
    @Transactional(readOnly = true)
    public boolean roleNameExists(String roleName) {
        return roleRepository.existsByRoleNameIgnoreCase(roleName);
    }
}
