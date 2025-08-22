package com.erp.service;

import com.erp.entity.Supplier;
import com.erp.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service class for managing Supplier entities
 * Provides business logic for supplier operations
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SupplierService {

    private final SupplierRepository supplierRepository;

    /**
     * Find all suppliers
     */
    @Transactional(readOnly = true)
    public List<Supplier> findAll() {
        log.debug("Finding all suppliers");
        return supplierRepository.findAll();
    }

    /**
     * Find all suppliers with pagination
     */
    @Transactional(readOnly = true)
    public Page<Supplier> findAll(Pageable pageable) {
        log.debug("Finding all suppliers with pagination");
        return supplierRepository.findAll(pageable);
    }

    /**
     * Find supplier by ID
     */
    @Transactional(readOnly = true)
    public Optional<Supplier> findById(Long id) {
        log.debug("Finding supplier by id: {}", id);
        return supplierRepository.findById(id);
    }

    /**
     * Find supplier by code
     */
    @Transactional(readOnly = true)
    public Optional<Supplier> findByCode(String code) {
        log.debug("Finding supplier by code: {}", code);
        return supplierRepository.findByCode(code);
    }

    /**
     * Find supplier by email
     */
    @Transactional(readOnly = true)
    public Optional<Supplier> findByEmail(String email) {
        log.debug("Finding supplier by email: {}", email);
        return supplierRepository.findByEmail(email);
    }

    /**
     * Find active suppliers only
     */
    @Transactional(readOnly = true)
    public List<Supplier> findActiveSuppliers() {
        log.debug("Finding all active suppliers");
        return supplierRepository.findByActiveTrue();
    }

    /**
     * Find active suppliers ordered by name
     */
    @Transactional(readOnly = true)
    public List<Supplier> findActiveSuppliersOrderedByName() {
        log.debug("Finding all active suppliers ordered by name");
        return supplierRepository.findByActiveTrueOrderByName();
    }

    /**
     * Search suppliers by name (case-insensitive)
     */
    @Transactional(readOnly = true)
    public List<Supplier> searchByName(String name) {
        log.debug("Searching suppliers by name: {}", name);
        if (name == null || name.trim().isEmpty()) {
            return findActiveSuppliers();
        }
        return supplierRepository.findByNameContainingIgnoreCase(name.trim());
    }

    /**
     * Create a new supplier
     */
    public Supplier createSupplier(Supplier supplier) {
        log.info("Creating new supplier with code: {}", supplier.getCode());
        
        // Validate supplier data
        validateSupplierForCreate(supplier);
        
        // Set default values
        if (supplier.getActive() == null) {
            supplier.setActive(true);
        }
        
        Supplier savedSupplier = supplierRepository.save(supplier);
        log.info("Successfully created supplier with id: {} and code: {}", 
                savedSupplier.getId(), savedSupplier.getCode());
        
        return savedSupplier;
    }

    /**
     * Update an existing supplier
     */
    public Supplier updateSupplier(Long id, Supplier supplierDetails) {
        log.info("Updating supplier with id: {}", id);
        
        Supplier existingSupplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
        
        // Validate supplier data for update
        validateSupplierForUpdate(supplierDetails, existingSupplier);
        
        // Update fields
        updateSupplierFields(existingSupplier, supplierDetails);
        
        Supplier updatedSupplier = supplierRepository.save(existingSupplier);
        log.info("Successfully updated supplier with id: {} and code: {}", 
                updatedSupplier.getId(), updatedSupplier.getCode());
        
        return updatedSupplier;
    }

    /**
     * Delete a supplier (soft delete by setting active = false)
     */
    public void deleteSupplier(Long id) {
        log.info("Soft deleting supplier with id: {}", id);
        
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
        
        supplier.setActive(false);
        supplierRepository.save(supplier);
        
        log.info("Successfully soft deleted supplier with id: {} and code: {}", 
                supplier.getId(), supplier.getCode());
    }

    /**
     * Hard delete a supplier (permanently remove from database)
     */
    public void hardDeleteSupplier(Long id) {
        log.warn("Hard deleting supplier with id: {}", id);
        
        if (!supplierRepository.existsById(id)) {
            throw new RuntimeException("Supplier not found with id: " + id);
        }
        
        // TODO: Check for dependencies before hard delete
        // e.g., check if supplier has any purchase orders, etc.
        
        supplierRepository.deleteById(id);
        log.warn("Successfully hard deleted supplier with id: {}", id);
    }

    /**
     * Activate a supplier
     */
    public Supplier activateSupplier(Long id) {
        log.info("Activating supplier with id: {}", id);
        
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
        
        supplier.setActive(true);
        Supplier activatedSupplier = supplierRepository.save(supplier);
        
        log.info("Successfully activated supplier with id: {} and code: {}", 
                activatedSupplier.getId(), activatedSupplier.getCode());
        
        return activatedSupplier;
    }

    /**
     * Deactivate a supplier
     */
    public Supplier deactivateSupplier(Long id) {
        log.info("Deactivating supplier with id: {}", id);
        
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
        
        supplier.setActive(false);
        Supplier deactivatedSupplier = supplierRepository.save(supplier);
        
        log.info("Successfully deactivated supplier with id: {} and code: {}", 
                deactivatedSupplier.getId(), deactivatedSupplier.getCode());
        
        return deactivatedSupplier;
    }

    /**
     * Check if supplier code exists
     */
    @Transactional(readOnly = true)
    public boolean existsByCode(String code) {
        return supplierRepository.existsByCode(code);
    }

    /**
     * Check if supplier email exists
     */
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return supplierRepository.existsByEmail(email);
    }

    /**
     * Get supplier count
     */
    @Transactional(readOnly = true)
    public long getTotalSupplierCount() {
        return supplierRepository.count();
    }

    /**
     * Get active supplier count
     */
    @Transactional(readOnly = true)
    public long getActiveSupplierCount() {
        return supplierRepository.findByActiveTrue().size();
    }

    // Private helper methods

    /**
     * Validate supplier data for creation
     */
    private void validateSupplierForCreate(Supplier supplier) {
        if (supplier == null) {
            throw new IllegalArgumentException("Supplier cannot be null");
        }
        
        // Validate required fields
        validateRequiredFields(supplier);
        
        // Check for duplicate code
        if (supplierRepository.existsByCode(supplier.getCode())) {
            throw new RuntimeException("Supplier code already exists: " + supplier.getCode());
        }
        
        // Check for duplicate email
        if (supplier.getEmail() != null && !supplier.getEmail().trim().isEmpty()) {
            if (supplierRepository.existsByEmail(supplier.getEmail())) {
                throw new RuntimeException("Supplier email already exists: " + supplier.getEmail());
            }
        }
    }

    /**
     * Validate supplier data for update
     */
    private void validateSupplierForUpdate(Supplier supplierDetails, Supplier existingSupplier) {
        if (supplierDetails == null) {
            throw new IllegalArgumentException("Supplier details cannot be null");
        }
        
        // Validate required fields
        validateRequiredFields(supplierDetails);
        
        // Check for duplicate code (excluding current supplier)
        Optional<Supplier> existingByCode = supplierRepository.findByCode(supplierDetails.getCode());
        if (existingByCode.isPresent() && !existingByCode.get().getId().equals(existingSupplier.getId())) {
            throw new RuntimeException("Supplier code already exists: " + supplierDetails.getCode());
        }
        
        // Check for duplicate email (excluding current supplier)
        if (supplierDetails.getEmail() != null && !supplierDetails.getEmail().trim().isEmpty()) {
            Optional<Supplier> existingByEmail = supplierRepository.findByEmail(supplierDetails.getEmail());
            if (existingByEmail.isPresent() && !existingByEmail.get().getId().equals(existingSupplier.getId())) {
                throw new RuntimeException("Supplier email already exists: " + supplierDetails.getEmail());
            }
        }
    }

    /**
     * Validate required fields
     */
    private void validateRequiredFields(Supplier supplier) {
        if (supplier.getCode() == null || supplier.getCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Supplier code is required");
        }
        
        if (supplier.getName() == null || supplier.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Supplier name is required");
        }
        
        // Validate code format (alphanumeric, no spaces)
        if (!supplier.getCode().matches("^[a-zA-Z0-9_-]+$")) {
            throw new IllegalArgumentException("Supplier code must contain only alphanumeric characters, hyphens, and underscores");
        }
        
        // Validate email format if provided
        if (supplier.getEmail() != null && !supplier.getEmail().trim().isEmpty()) {
            if (!isValidEmail(supplier.getEmail())) {
                throw new IllegalArgumentException("Invalid email format");
            }
        }
    }

    /**
     * Update supplier fields
     */
    private void updateSupplierFields(Supplier existingSupplier, Supplier supplierDetails) {
        existingSupplier.setCode(supplierDetails.getCode());
        existingSupplier.setName(supplierDetails.getName());
        existingSupplier.setContactPerson(supplierDetails.getContactPerson());
        existingSupplier.setEmail(supplierDetails.getEmail());
        existingSupplier.setPhone(supplierDetails.getPhone());
        existingSupplier.setAddress(supplierDetails.getAddress());
        
        if (supplierDetails.getActive() != null) {
            existingSupplier.setActive(supplierDetails.getActive());
        }
    }

    /**
     * Simple email validation
     */
    private boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }
}
