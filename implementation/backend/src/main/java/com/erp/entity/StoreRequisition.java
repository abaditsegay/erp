package com.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Store Requisition Entity
 * Represents internal requests for inventory items from stores
 * Part of Phase 2 - Core Business Modules
 */
@Entity
@Table(name = "store_requisitions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class StoreRequisition extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sr_number", nullable = false, unique = true, length = 20)
    private String srNumber;

    @Column(name = "sr_date", nullable = false)
    private LocalDate srDate;

    @Column(name = "required_date", nullable = false)
    private LocalDate requiredDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_by", nullable = false)
    private User requestedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Column(name = "approved_date")
    private LocalDate approvedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issued_by")
    private User issuedBy;

    @Column(name = "issued_date")
    private LocalDate issuedDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private SRStatus status = SRStatus.DRAFT;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", length = 10)
    private Priority priority = Priority.MEDIUM;

    @Column(name = "requesting_department", length = 50)
    private String requestingDepartment;

    @Column(name = "cost_center", length = 20)
    private String costCenter;

    @Column(name = "purpose", columnDefinition = "TEXT")
    private String purpose;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "approval_comments", columnDefinition = "TEXT")
    private String approvalComments;

    @Column(name = "total_estimated_cost", precision = 18, scale = 2)
    private BigDecimal totalEstimatedCost;

    @OneToMany(mappedBy = "storeRequisition", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<StoreRequisitionLine> srLines = new ArrayList<>();

    // Enums
    public enum SRStatus {
        DRAFT,
        SUBMITTED,
        UNDER_REVIEW,
        APPROVED,
        REJECTED,
        PARTIALLY_ISSUED,
        FULLY_ISSUED,
        CANCELLED,
        CLOSED
    }

    public enum Priority {
        LOW,
        MEDIUM,
        HIGH,
        URGENT
    }

    // Business Logic Methods

    /**
     * Check if the store requisition can be edited
     */
    public boolean isEditable() {
        return status == SRStatus.DRAFT || status == SRStatus.SUBMITTED;
    }

    /**
     * Check if the store requisition can be approved
     */
    public boolean canBeApproved() {
        return status == SRStatus.SUBMITTED || status == SRStatus.UNDER_REVIEW;
    }

    /**
     * Check if the store requisition can be issued
     */
    public boolean canBeIssued() {
        return status == SRStatus.APPROVED;
    }

    /**
     * Check if the store requisition can be cancelled
     */
    public boolean canBeCancelled() {
        return status == SRStatus.DRAFT || 
               status == SRStatus.SUBMITTED || 
               status == SRStatus.UNDER_REVIEW ||
               status == SRStatus.APPROVED;
    }

    /**
     * Submit the store requisition for approval
     */
    public void submit() {
        if (status != SRStatus.DRAFT) {
            throw new IllegalStateException("Only draft store requisitions can be submitted");
        }
        
        validateForSubmission();
        this.status = SRStatus.SUBMITTED;
    }

    /**
     * Approve the store requisition
     */
    public void approve(User approver, String comments) {
        if (!canBeApproved()) {
            throw new IllegalStateException("Store requisition cannot be approved in current status");
        }
        
        this.status = SRStatus.APPROVED;
        this.approvedBy = approver;
        this.approvedDate = LocalDate.now();
        this.approvalComments = comments;
    }

    /**
     * Reject the store requisition
     */
    public void reject(User approver, String reason) {
        if (!canBeApproved()) {
            throw new IllegalStateException("Store requisition cannot be rejected in current status");
        }
        
        this.status = SRStatus.REJECTED;
        this.approvedBy = approver;
        this.approvedDate = LocalDate.now();
        this.approvalComments = reason;
    }

    /**
     * Start issuing process
     */
    public void startIssuing(User issuer) {
        if (!canBeIssued()) {
            throw new IllegalStateException("Store requisition cannot be issued in current status");
        }
        
        this.issuedBy = issuer;
        this.issuedDate = LocalDate.now();
        this.status = SRStatus.PARTIALLY_ISSUED;
    }

    /**
     * Complete issuing process
     */
    public void completeIssuing() {
        if (status != SRStatus.PARTIALLY_ISSUED) {
            throw new IllegalStateException("Store requisition must be in PARTIALLY_ISSUED status");
        }
        
        boolean allLinesIssued = srLines.stream()
            .allMatch(line -> line.isFullyIssued());
        
        if (allLinesIssued) {
            this.status = SRStatus.FULLY_ISSUED;
        }
    }

    /**
     * Cancel the store requisition
     */
    public void cancel(String reason) {
        if (!canBeCancelled()) {
            throw new IllegalStateException("Store requisition cannot be cancelled in current status");
        }
        
        this.status = SRStatus.CANCELLED;
        this.remarks = reason;
    }

    /**
     * Close the store requisition
     */
    public void close() {
        if (status != SRStatus.FULLY_ISSUED && status != SRStatus.PARTIALLY_ISSUED) {
            throw new IllegalStateException("Only issued store requisitions can be closed");
        }
        
        this.status = SRStatus.CLOSED;
    }

    /**
     * Calculate total estimated cost from line items
     */
    public void calculateTotalEstimatedCost() {
        this.totalEstimatedCost = srLines.stream()
            .filter(line -> line.getEstimatedUnitCost() != null && line.getQuantityRequested() != null)
            .map(line -> line.getEstimatedUnitCost().multiply(line.getQuantityRequested()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Add store requisition line
     */
    public void addSrLine(StoreRequisitionLine line) {
        line.setStoreRequisition(this);
        line.setLineNumber(srLines.size() + 1);
        this.srLines.add(line);
        calculateTotalEstimatedCost();
    }

    /**
     * Remove store requisition line
     */
    public void removeSrLine(StoreRequisitionLine line) {
        line.setStoreRequisition(null);
        this.srLines.remove(line);
        
        // Renumber remaining lines
        for (int i = 0; i < srLines.size(); i++) {
            srLines.get(i).setLineNumber(i + 1);
        }
        
        calculateTotalEstimatedCost();
    }

    /**
     * Get total quantity requested
     */
    public BigDecimal getTotalQuantityRequested() {
        return srLines.stream()
            .filter(line -> line.getQuantityRequested() != null)
            .map(StoreRequisitionLine::getQuantityRequested)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Get total quantity issued
     */
    public BigDecimal getTotalQuantityIssued() {
        return srLines.stream()
            .filter(line -> line.getQuantityIssued() != null)
            .map(StoreRequisitionLine::getQuantityIssued)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Get total quantity pending
     */
    public BigDecimal getTotalQuantityPending() {
        return srLines.stream()
            .filter(line -> line.getQuantityPending() != null)
            .map(StoreRequisitionLine::getQuantityPending)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Check if all items are available for issue
     */
    public boolean areAllItemsAvailable() {
        return srLines.stream()
            .allMatch(line -> line.isAvailableForIssue());
    }

    /**
     * Get completion percentage
     */
    public BigDecimal getCompletionPercentage() {
        BigDecimal totalRequested = getTotalQuantityRequested();
        BigDecimal totalIssued = getTotalQuantityIssued();
        
        if (totalRequested.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        
        return totalIssued.divide(totalRequested, 4, java.math.RoundingMode.HALF_UP)
            .multiply(new BigDecimal("100"))
            .setScale(2, java.math.RoundingMode.HALF_UP);
    }

    /**
     * Validate for submission
     */
    private void validateForSubmission() {
        if (srLines.isEmpty()) {
            throw new IllegalStateException("Store requisition must have at least one line item");
        }
        
        if (requestingDepartment == null || requestingDepartment.trim().isEmpty()) {
            throw new IllegalStateException("Requesting department is required");
        }
        
        if (purpose == null || purpose.trim().isEmpty()) {
            throw new IllegalStateException("Purpose is required");
        }
        
        // Validate all line items
        for (StoreRequisitionLine line : srLines) {
            if (line.getQuantityRequested() == null || 
                line.getQuantityRequested().compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalStateException("All line items must have positive requested quantities");
            }
        }
    }

    /**
     * Check if urgent approval is required
     */
    public boolean requiresUrgentApproval() {
        return priority == Priority.URGENT || 
               (requiredDate != null && requiredDate.isBefore(LocalDate.now().plusDays(1)));
    }

    /**
     * Check if the store requisition is overdue
     */
    public boolean isOverdue() {
        return requiredDate != null && 
               requiredDate.isBefore(LocalDate.now()) && 
               status != SRStatus.FULLY_ISSUED && 
               status != SRStatus.CLOSED && 
               status != SRStatus.CANCELLED;
    }
}
