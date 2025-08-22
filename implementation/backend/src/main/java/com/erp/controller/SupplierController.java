package com.erp.controller;

import com.erp.entity.Supplier;
import com.erp.service.SupplierService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST Controller for Supplier operations
 */
@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class SupplierController {

    private final SupplierService supplierService;

    /**
     * Get all suppliers with optional pagination
     */
    @GetMapping
    public ResponseEntity<Page<Supplier>> getAllSuppliers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        log.info("Getting all suppliers - page: {}, size: {}, sortBy: {}, sortDir: {}", 
                page, size, sortBy, sortDir);
        
        Sort sort = sortDir.equalsIgnoreCase("desc") 
            ? Sort.by(sortBy).descending() 
            : Sort.by(sortBy).ascending();
            
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Supplier> suppliers = supplierService.findAll(pageable);
        
        return ResponseEntity.ok(suppliers);
    }

    /**
     * Get only active suppliers
     */
    @GetMapping("/active")
    public ResponseEntity<List<Supplier>> getActiveSuppliers() {
        log.info("Getting all active suppliers");
        List<Supplier> suppliers = supplierService.findActiveSuppliers();
        return ResponseEntity.ok(suppliers);
    }

    /**
     * Get supplier by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getSupplierById(@PathVariable Long id) {
        log.info("Getting supplier by id: {}", id);
        
        Optional<Supplier> supplier = supplierService.findById(id);
        return supplier.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get supplier by code
     */
    @GetMapping("/code/{code}")
    public ResponseEntity<Supplier> getSupplierByCode(@PathVariable String code) {
        log.info("Getting supplier by code: {}", code);
        
        Optional<Supplier> supplier = supplierService.findByCode(code);
        return supplier.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Search suppliers by name
     */
    @GetMapping("/search")
    public ResponseEntity<List<Supplier>> searchSuppliers(@RequestParam String name) {
        log.info("Searching suppliers by name: {}", name);
        
        List<Supplier> suppliers = supplierService.searchByName(name);
        return ResponseEntity.ok(suppliers);
    }

    /**
     * Create a new supplier
     */
    @PostMapping
    public ResponseEntity<?> createSupplier(@RequestBody Supplier supplier) {
        log.info("Creating new supplier with code: {}", supplier.getCode());
        
        try {
            Supplier savedSupplier = supplierService.createSupplier(supplier);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedSupplier);
        } catch (RuntimeException e) {
            log.error("Error creating supplier: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Update an existing supplier
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSupplier(@PathVariable Long id, @RequestBody Supplier supplier) {
        log.info("Updating supplier with id: {}", id);
        
        try {
            Supplier updatedSupplier = supplierService.updateSupplier(id, supplier);
            return ResponseEntity.ok(updatedSupplier);
        } catch (RuntimeException e) {
            log.error("Error updating supplier: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Delete a supplier (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        log.info("Deleting supplier with id: {}", id);
        
        try {
            supplierService.deleteSupplier(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("Error deleting supplier: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Activate a supplier
     */
    @PutMapping("/{id}/activate")
    public ResponseEntity<?> activateSupplier(@PathVariable Long id) {
        log.info("Activating supplier with id: {}", id);
        
        try {
            Supplier supplier = supplierService.activateSupplier(id);
            return ResponseEntity.ok(supplier);
        } catch (RuntimeException e) {
            log.error("Error activating supplier: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Deactivate a supplier
     */
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateSupplier(@PathVariable Long id) {
        log.info("Deactivating supplier with id: {}", id);
        
        try {
            Supplier supplier = supplierService.deactivateSupplier(id);
            return ResponseEntity.ok(supplier);
        } catch (RuntimeException e) {
            log.error("Error deactivating supplier: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Check if supplier code exists
     */
    @GetMapping("/exists/code/{code}")
    public ResponseEntity<Boolean> checkCodeExists(@PathVariable String code) {
        log.info("Checking if supplier code exists: {}", code);
        
        boolean exists = supplierService.existsByCode(code);
        return ResponseEntity.ok(exists);
    }

    /**
     * Check if supplier email exists
     */
    @GetMapping("/exists/email/{email}")
    public ResponseEntity<Boolean> checkEmailExists(@PathVariable String email) {
        log.info("Checking if supplier email exists: {}", email);
        
        boolean exists = supplierService.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }

    /**
     * Get supplier statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<SupplierStats> getSupplierStats() {
        log.info("Getting supplier statistics");
        
        long totalCount = supplierService.getTotalSupplierCount();
        long activeCount = supplierService.getActiveSupplierCount();
        
        SupplierStats stats = new SupplierStats(totalCount, activeCount, totalCount - activeCount);
        return ResponseEntity.ok(stats);
    }

    /**
     * Error response DTO
     */
    public static class ErrorResponse {
        private String message;
        private long timestamp;

        public ErrorResponse(String message) {
            this.message = message;
            this.timestamp = System.currentTimeMillis();
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public long getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(long timestamp) {
            this.timestamp = timestamp;
        }
    }

    /**
     * Supplier statistics DTO
     */
    public static class SupplierStats {
        private long totalCount;
        private long activeCount;
        private long inactiveCount;

        public SupplierStats(long totalCount, long activeCount, long inactiveCount) {
            this.totalCount = totalCount;
            this.activeCount = activeCount;
            this.inactiveCount = inactiveCount;
        }

        public long getTotalCount() {
            return totalCount;
        }

        public void setTotalCount(long totalCount) {
            this.totalCount = totalCount;
        }

        public long getActiveCount() {
            return activeCount;
        }

        public void setActiveCount(long activeCount) {
            this.activeCount = activeCount;
        }

        public long getInactiveCount() {
            return inactiveCount;
        }

        public void setInactiveCount(long inactiveCount) {
            this.inactiveCount = inactiveCount;
        }
    }
}
