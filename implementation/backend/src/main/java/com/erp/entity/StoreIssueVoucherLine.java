package com.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Store Issue Voucher Line Entity
 * Represents individual line items in a store issue voucher
 * Part of Phase 2 - Core Business Modules
 */
@Entity
@Table(name = "store_issue_voucher_lines")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class StoreIssueVoucherLine extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "siv_id", nullable = false)
    private StoreIssueVoucher storeIssueVoucher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sr_line_id")
    private StoreRequisitionLine srLine;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id", nullable = false)
    private UnitOfMeasure unit;

    @Column(name = "line_number", nullable = false)
    private Integer lineNumber;

    @Column(name = "quantity_issued", nullable = false, precision = 19, scale = 4)
    private BigDecimal quantityIssued;

    @Column(name = "unit_cost", nullable = false, precision = 18, scale = 2)
    private BigDecimal unitCost;

    @Column(name = "total_cost", precision = 18, scale = 2)
    private BigDecimal totalCost;

    @Column(name = "batch_number", length = 50)
    private String batchNumber;

    @Column(name = "serial_number", length = 50)
    private String serialNumber;

    @Column(name = "from_location", length = 50)
    private String fromLocation;

    @Column(name = "to_location", length = 50)
    private String toLocation;

    @Column(name = "expiry_date")
    private java.time.LocalDate expiryDate;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "available_stock_before", precision = 19, scale = 4)
    private BigDecimal availableStockBefore;

    @Column(name = "available_stock_after", precision = 19, scale = 4)
    private BigDecimal availableStockAfter;

    // Business Logic Methods

    /**
     * Calculate total cost
     */
    public void calculateTotalCost() {
        if (quantityIssued != null && unitCost != null) {
            this.totalCost = quantityIssued.multiply(unitCost)
                .setScale(2, RoundingMode.HALF_UP);
        }
    }

    /**
     * Check if sufficient stock is available
     */
    public boolean hasSufficientStock() {
        return availableStockBefore != null && 
               availableStockBefore.compareTo(quantityIssued) >= 0;
    }

    /**
     * Update stock level after issue
     */
    public void updateStockLevel() {
        if (availableStockBefore != null && quantityIssued != null) {
            this.availableStockAfter = availableStockBefore.subtract(quantityIssued);
            
            // Create stock movement record
            createStockMovement();
        }
    }

    /**
     * Reverse stock movement for cancellation
     */
    public void reverseStockMovement() {
        if (availableStockAfter != null && quantityIssued != null) {
            // Restore stock level
            this.availableStockAfter = availableStockAfter.add(quantityIssued);
            
            // Create reverse stock movement record
            createReverseStockMovement();
        }
    }

    /**
     * Create return stock movement
     */
    public void createReturnStockMovement() {
        if (quantityIssued != null) {
            // Add back to stock
            this.availableStockAfter = (availableStockAfter != null ? 
                availableStockAfter : BigDecimal.ZERO).add(quantityIssued);
            
            // Create return stock movement record
            createReturnMovementRecord();
        }
    }

    /**
     * Validate line for issuing
     */
    public boolean isValidForIssuing() {
        return quantityIssued != null && 
               quantityIssued.compareTo(BigDecimal.ZERO) > 0 &&
               unitCost != null &&
               unitCost.compareTo(BigDecimal.ZERO) > 0 &&
               item != null &&
               hasSufficientStock();
    }

    /**
     * Check if item has expiry tracking
     */
    public boolean hasExpiryTracking() {
        return expiryDate != null;
    }

    /**
     * Check if item is expired
     */
    public boolean isExpired() {
        return expiryDate != null && 
               expiryDate.isBefore(java.time.LocalDate.now());
    }

    /**
     * Check if item is near expiry (within 30 days)
     */
    public boolean isNearExpiry() {
        return expiryDate != null && 
               expiryDate.isBefore(java.time.LocalDate.now().plusDays(30)) &&
               !isExpired();
    }

    /**
     * Check if batch/serial tracking is required
     */
    public boolean requiresTraceability() {
        return (batchNumber != null && !batchNumber.trim().isEmpty()) ||
               (serialNumber != null && !serialNumber.trim().isEmpty());
    }

    /**
     * Get cost per unit
     */
    public BigDecimal getCostPerUnit() {
        return unitCost;
    }

    /**
     * Get stock impact
     */
    public BigDecimal getStockImpact() {
        return quantityIssued;
    }

    /**
     * Update from store requisition line
     */
    public void updateFromSrLine(StoreRequisitionLine srLine) {
        this.srLine = srLine;
        this.item = srLine.getItem();
        this.unit = srLine.getUnit();
        
        // Use estimated cost if unit cost not set
        if (unitCost == null && srLine.getEstimatedUnitCost() != null) {
            this.unitCost = srLine.getEstimatedUnitCost();
        }
        
        calculateTotalCost();
    }

    /**
     * Validate batch/serial numbers
     */
    public boolean isTraceabilityValid() {
        // Implement validation logic based on item requirements
        if (item != null && item.getItemType() == Item.ItemType.RAW_MATERIAL) {
            return batchNumber != null && !batchNumber.trim().isEmpty();
        }
        return true; // Default to valid
    }

    /**
     * Get stock movement type
     */
    public String getMovementType() {
        if (storeIssueVoucher != null) {
            switch (storeIssueVoucher.getIssueType()) {
                case TRANSFER:
                    return "TRANSFER";
                case SCRAP:
                    return "SCRAP";
                case SAMPLE:
                    return "SAMPLE";
                default:
                    return "OUT";
            }
        }
        return "OUT";
    }

    /**
     * Calculate value impact
     */
    public BigDecimal getValueImpact() {
        return totalCost != null ? totalCost : calculateValueImpact();
    }

    /**
     * Calculate value impact if total cost not set
     */
    private BigDecimal calculateValueImpact() {
        if (quantityIssued != null && unitCost != null) {
            return quantityIssued.multiply(unitCost).setScale(2, RoundingMode.HALF_UP);
        }
        return BigDecimal.ZERO;
    }

    /**
     * Set stock levels
     */
    public void setStockLevels(BigDecimal beforeStock) {
        this.availableStockBefore = beforeStock;
        if (quantityIssued != null) {
            this.availableStockAfter = beforeStock.subtract(quantityIssued);
        }
    }

    /**
     * Get remaining stock after issue
     */
    public BigDecimal getRemainingStock() {
        return availableStockAfter != null ? availableStockAfter : BigDecimal.ZERO;
    }

    /**
     * Check if this creates a stock shortage
     */
    public boolean createsStockShortage(BigDecimal reorderLevel) {
        return availableStockAfter != null && 
               reorderLevel != null && 
               availableStockAfter.compareTo(reorderLevel) < 0;
    }

    // Private helper methods for stock movements

    /**
     * Create stock movement record
     */
    private void createStockMovement() {
        // This would typically interact with StockMovement entity
        // Implementation depends on how stock movements are tracked
        // For now, this is a placeholder for the business logic
    }

    /**
     * Create reverse stock movement record
     */
    private void createReverseStockMovement() {
        // Create a stock movement with type 'IN' to reverse the original 'OUT'
        // Implementation placeholder
    }

    /**
     * Create return movement record
     */
    private void createReturnMovementRecord() {
        // Create a stock movement with type 'RETURN'
        // Implementation placeholder
    }

    /**
     * Link to store requisition line and update quantities
     */
    public void linkToSrLine(StoreRequisitionLine srLine, BigDecimal issuedQty) {
        this.srLine = srLine;
        this.quantityIssued = issuedQty;
        
        // Copy item and unit from SR line
        this.item = srLine.getItem();
        this.unit = srLine.getUnit();
        
        // Use estimated cost from SR line if not set
        if (unitCost == null) {
            this.unitCost = srLine.getEstimatedUnitCost();
        }
        
        calculateTotalCost();
    }
}
