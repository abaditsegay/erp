package com.erp.entity;

import java.math.BigDecimal;
import java.math.RoundingMode;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Store Requisition Line Entity
 * Represents individual line items in a store requisition
 * Part of Phase 2 - Core Business Modules
 */
@Entity
@Table(name = "store_requisition_lines")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class StoreRequisitionLine extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sr_id", nullable = false)
    private StoreRequisition storeRequisition;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id", nullable = false)
    private UnitOfMeasure unit;

    @Column(name = "line_number", nullable = false)
    private Integer lineNumber;

    @Column(name = "quantity_requested", nullable = false, precision = 19, scale = 4)
    private BigDecimal quantityRequested;

    @Column(name = "quantity_issued", precision = 19, scale = 4, columnDefinition = "DECIMAL(19,4) DEFAULT 0")
    private BigDecimal quantityIssued = BigDecimal.ZERO;

    @Column(name = "quantity_pending", precision = 19, scale = 4)
    private BigDecimal quantityPending;

    @Column(name = "estimated_unit_cost", precision = 18, scale = 2)
    private BigDecimal estimatedUnitCost;

    @Column(name = "estimated_total_cost", precision = 18, scale = 2)
    private BigDecimal estimatedTotalCost;

    @Column(name = "purpose", columnDefinition = "TEXT")
    private String purpose;

    @Column(name = "urgency_remarks", columnDefinition = "TEXT")
    private String urgencyRemarks;

    @Column(name = "specifications", columnDefinition = "TEXT")
    private String specifications;

    @Column(name = "location_required", length = 50)
    private String locationRequired;

    @Enumerated(EnumType.STRING)
    @Column(name = "issue_status", length = 20)
    private IssueStatus issueStatus = IssueStatus.PENDING;

    @Column(name = "available_stock", precision = 19, scale = 4)
    private BigDecimal availableStock;

    @Column(name = "allocated_stock", precision = 19, scale = 4)
    private BigDecimal allocatedStock;

    // Enums
    public enum IssueStatus {
        PENDING,
        ALLOCATED,
        PARTIALLY_ISSUED,
        FULLY_ISSUED,
        CANCELLED,
        OUT_OF_STOCK
    }

    // Business Logic Methods

    /**
     * Calculate estimated total cost
     */
    public void calculateEstimatedTotalCost() {
        if (quantityRequested != null && estimatedUnitCost != null) {
            this.estimatedTotalCost = quantityRequested.multiply(estimatedUnitCost)
                .setScale(2, RoundingMode.HALF_UP);
        }
    }

    /**
     * Calculate pending quantity
     */
    public void calculatePendingQuantity() {
        if (quantityRequested != null && quantityIssued != null) {
            this.quantityPending = quantityRequested.subtract(quantityIssued);
            if (quantityPending.compareTo(BigDecimal.ZERO) < 0) {
                quantityPending = BigDecimal.ZERO;
            }
        } else if (quantityRequested != null) {
            this.quantityPending = quantityRequested;
        }
    }

    /**
     * Issue partial quantity
     */
    public void issuePartialQuantity(BigDecimal issuedQty) {
        if (issuedQty == null || issuedQty.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Issued quantity must be positive");
        }
        
        if (quantityIssued == null) {
            quantityIssued = BigDecimal.ZERO;
        }
        
        BigDecimal newTotalIssued = quantityIssued.add(issuedQty);
        if (newTotalIssued.compareTo(quantityRequested) > 0) {
            throw new IllegalArgumentException("Total issued quantity cannot exceed requested quantity");
        }
        
        this.quantityIssued = newTotalIssued;
        calculatePendingQuantity();
        updateIssueStatus();
    }

    /**
     * Issue full quantity
     */
    public void issueFullQuantity() {
        this.quantityIssued = quantityRequested;
        this.quantityPending = BigDecimal.ZERO;
        this.issueStatus = IssueStatus.FULLY_ISSUED;
    }

    /**
     * Cancel the line item
     */
    public void cancel(String reason) {
        this.issueStatus = IssueStatus.CANCELLED;
        this.urgencyRemarks = reason;
    }

    /**
     * Allocate stock for this line
     */
    public void allocateStock(BigDecimal allocatedQty) {
        if (allocatedQty == null || allocatedQty.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Allocated quantity must be positive");
        }
        
        if (allocatedQty.compareTo(quantityPending) > 0) {
            throw new IllegalArgumentException("Allocated quantity cannot exceed pending quantity");
        }
        
        this.allocatedStock = allocatedQty;
        this.issueStatus = IssueStatus.ALLOCATED;
    }

    /**
     * Check if sufficient stock is available
     */
    public boolean isAvailableForIssue() {
        return availableStock != null && 
               availableStock.compareTo(quantityPending) >= 0;
    }

    /**
     * Check if the line is fully issued
     */
    public boolean isFullyIssued() {
        return issueStatus == IssueStatus.FULLY_ISSUED || 
               (quantityIssued != null && quantityIssued.compareTo(quantityRequested) >= 0);
    }

    /**
     * Check if the line is partially issued
     */
    public boolean isPartiallyIssued() {
        return issueStatus == IssueStatus.PARTIALLY_ISSUED || 
               (quantityIssued != null && 
                quantityIssued.compareTo(BigDecimal.ZERO) > 0 && 
                quantityIssued.compareTo(quantityRequested) < 0);
    }

    /**
     * Check if out of stock
     */
    public boolean isOutOfStock() {
        return issueStatus == IssueStatus.OUT_OF_STOCK ||
               (availableStock != null && availableStock.compareTo(quantityRequested) < 0);
    }

    /**
     * Update issue status based on quantities
     */
    private void updateIssueStatus() {
        if (quantityIssued == null || quantityIssued.compareTo(BigDecimal.ZERO) == 0) {
            this.issueStatus = IssueStatus.PENDING;
        } else if (quantityIssued.compareTo(quantityRequested) >= 0) {
            this.issueStatus = IssueStatus.FULLY_ISSUED;
        } else {
            this.issueStatus = IssueStatus.PARTIALLY_ISSUED;
        }
    }

    /**
     * Get shortage quantity
     */
    public BigDecimal getShortageQuantity() {
        if (availableStock != null && quantityRequested != null) {
            BigDecimal shortage = quantityRequested.subtract(availableStock);
            return shortage.compareTo(BigDecimal.ZERO) > 0 ? shortage : BigDecimal.ZERO;
        }
        return BigDecimal.ZERO;
    }

    /**
     * Get fulfillment percentage
     */
    public BigDecimal getFulfillmentPercentage() {
        if (quantityRequested == null || quantityRequested.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal issued = quantityIssued != null ? quantityIssued : BigDecimal.ZERO;
        return issued.divide(quantityRequested, 4, RoundingMode.HALF_UP)
            .multiply(new BigDecimal("100"))
            .setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Check if urgent
     */
    public boolean isUrgent() {
        return urgencyRemarks != null && !urgencyRemarks.trim().isEmpty();
    }

    /**
     * Set available stock and update status
     */
    public void setAvailableStock(BigDecimal stock) {
        this.availableStock = stock;
        
        if (stock != null && quantityRequested != null) {
            if (stock.compareTo(quantityRequested) < 0) {
                this.issueStatus = IssueStatus.OUT_OF_STOCK;
            } else if (issueStatus == IssueStatus.OUT_OF_STOCK) {
                this.issueStatus = IssueStatus.PENDING;
            }
        }
    }

    /**
     * Validate line for issuing
     */
    public boolean isValidForIssuing() {
        return quantityRequested != null && 
               quantityRequested.compareTo(BigDecimal.ZERO) > 0 &&
               item != null &&
               isAvailableForIssue() &&
               issueStatus != IssueStatus.CANCELLED;
    }

    /**
     * Get required allocation quantity
     */
    public BigDecimal getRequiredAllocationQuantity() {
        if (allocatedStock != null && quantityPending != null) {
            BigDecimal required = quantityPending.subtract(allocatedStock);
            return required.compareTo(BigDecimal.ZERO) > 0 ? required : BigDecimal.ZERO;
        }
        return quantityPending != null ? quantityPending : BigDecimal.ZERO;
    }

    /**
     * Release allocated stock
     */
    public void releaseAllocatedStock() {
        this.allocatedStock = null;
        if (issueStatus == IssueStatus.ALLOCATED) {
            this.issueStatus = IssueStatus.PENDING;
        }
    }

    /**
     * Update from stock level information
     */
    public void updateFromStockLevel(BigDecimal currentStock) {
        setAvailableStock(currentStock);
        
        // Auto-allocate if sufficient stock and line is pending
        if (issueStatus == IssueStatus.PENDING && isAvailableForIssue()) {
            allocateStock(quantityPending);
        }
    }

    // Explicit getter and setter methods for compilation
    public BigDecimal getEstimatedUnitCost() {
        return estimatedUnitCost;
    }

    public void setEstimatedUnitCost(BigDecimal estimatedUnitCost) {
        this.estimatedUnitCost = estimatedUnitCost;
    }

    public BigDecimal getQuantityRequested() {
        return quantityRequested;
    }

    public void setQuantityRequested(BigDecimal quantityRequested) {
        this.quantityRequested = quantityRequested;
    }

    public StoreRequisition getStoreRequisition() {
        return storeRequisition;
    }

    public void setStoreRequisition(StoreRequisition storeRequisition) {
        this.storeRequisition = storeRequisition;
    }

    public Integer getLineNumber() {
        return lineNumber;
    }

    public void setLineNumber(Integer lineNumber) {
        this.lineNumber = lineNumber;
    }

    public BigDecimal getQuantityIssued() {
        return quantityIssued;
    }

    public void setQuantityIssued(BigDecimal quantityIssued) {
        this.quantityIssued = quantityIssued;
    }

    public BigDecimal getQuantityPending() {
        return quantityPending;
    }

    public void setQuantityPending(BigDecimal quantityPending) {
        this.quantityPending = quantityPending;
    }
}
