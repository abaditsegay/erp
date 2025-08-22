package com.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Goods Received Voucher Line Entity
 * Represents individual line items in a GRV for tracking received quantities
 * Part of Phase 2 - Core Business Modules
 */
@Entity
@Table(name = "goods_received_voucher_lines")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class GoodsReceivedVoucherLine extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grv_id", nullable = false)
    private GoodsReceivedVoucher grv;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "po_line_id", nullable = false)
    private PurchaseOrderLine poLine;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id", nullable = false)
    private UnitOfMeasure unit;

    @Column(name = "line_number", nullable = false)
    private Integer lineNumber;

    @Column(name = "quantity_ordered", nullable = false, precision = 19, scale = 4)
    private BigDecimal quantityOrdered;

    @Column(name = "quantity_received", nullable = false, precision = 19, scale = 4)
    private BigDecimal quantityReceived;

    @Column(name = "accepted_quantity", precision = 19, scale = 4)
    private BigDecimal acceptedQuantity;

    @Column(name = "rejected_quantity", precision = 19, scale = 4)
    private BigDecimal rejectedQuantity;

    @Column(name = "unit_cost", nullable = false, precision = 18, scale = 2)
    private BigDecimal unitCost;

    @Column(name = "total_cost", precision = 18, scale = 2)
    private BigDecimal totalCost;

    @Column(name = "batch_number", length = 50)
    private String batchNumber;

    @Column(name = "serial_number", length = 50)
    private String serialNumber;

    @Column(name = "expiry_date")
    private java.time.LocalDate expiryDate;

    @Column(name = "manufacturing_date")
    private java.time.LocalDate manufacturingDate;

    @Column(name = "location", length = 50)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "condition_status", length = 20)
    private ConditionStatus conditionStatus = ConditionStatus.GOOD;

    @Column(name = "reject_reason", columnDefinition = "TEXT")
    private String rejectReason;

    @Column(name = "quality_notes", columnDefinition = "TEXT")
    private String qualityNotes;

    @Column(name = "variance_percentage", precision = 5, scale = 2)
    private BigDecimal variancePercentage;

    // Enums
    public enum ConditionStatus {
        GOOD,
        DAMAGED,
        EXPIRED,
        DEFECTIVE,
        PARTIAL_DAMAGE,
        INCORRECT_ITEM
    }

    // Business Logic Methods

    /**
     * Calculate total cost based on accepted quantity and unit cost
     */
    public void calculateTotalCost() {
        if (acceptedQuantity != null && unitCost != null) {
            this.totalCost = acceptedQuantity.multiply(unitCost)
                .setScale(2, RoundingMode.HALF_UP);
        } else if (quantityReceived != null && unitCost != null) {
            this.totalCost = quantityReceived.multiply(unitCost)
                .setScale(2, RoundingMode.HALF_UP);
        }
    }

    /**
     * Calculate variance percentage between ordered and received quantities
     */
    public void calculateVariancePercentage() {
        if (quantityOrdered != null && quantityReceived != null && 
            quantityOrdered.compareTo(BigDecimal.ZERO) > 0) {
            
            BigDecimal variance = quantityReceived.subtract(quantityOrdered);
            this.variancePercentage = variance.divide(quantityOrdered, 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"))
                .setScale(2, RoundingMode.HALF_UP);
        }
    }

    /**
     * Accept the received quantity
     */
    public void acceptQuantity(BigDecimal acceptQty, String notes) {
        if (acceptQty == null || acceptQty.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Accept quantity must be non-negative");
        }
        
        if (acceptQty.compareTo(quantityReceived) > 0) {
            throw new IllegalArgumentException("Accept quantity cannot exceed received quantity");
        }
        
        this.acceptedQuantity = acceptQty;
        this.rejectedQuantity = quantityReceived.subtract(acceptQty);
        this.qualityNotes = notes;
        this.conditionStatus = ConditionStatus.GOOD;
        
        calculateTotalCost();
    }

    /**
     * Reject the received quantity
     */
    public void rejectQuantity(BigDecimal rejectQty, String reason, ConditionStatus condition) {
        if (rejectQty == null || rejectQty.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Reject quantity must be non-negative");
        }
        
        if (rejectQty.compareTo(quantityReceived) > 0) {
            throw new IllegalArgumentException("Reject quantity cannot exceed received quantity");
        }
        
        this.rejectedQuantity = rejectQty;
        this.acceptedQuantity = quantityReceived.subtract(rejectQty);
        this.rejectReason = reason;
        this.conditionStatus = condition;
        
        calculateTotalCost();
    }

    /**
     * Partially accept with reasons
     */
    public void partialAccept(BigDecimal acceptQty, BigDecimal rejectQty, 
                             String acceptNotes, String rejectReason) {
        if (acceptQty == null || rejectQty == null) {
            throw new IllegalArgumentException("Both accept and reject quantities must be specified");
        }
        
        if (acceptQty.add(rejectQty).compareTo(quantityReceived) != 0) {
            throw new IllegalArgumentException("Accept + Reject quantities must equal received quantity");
        }
        
        this.acceptedQuantity = acceptQty;
        this.rejectedQuantity = rejectQty;
        this.qualityNotes = acceptNotes;
        this.rejectReason = rejectReason;
        
        calculateTotalCost();
    }

    /**
     * Check if the line is fully accepted
     */
    public boolean isFullyAccepted() {
        return acceptedQuantity != null && 
               acceptedQuantity.compareTo(quantityReceived) == 0;
    }

    /**
     * Check if the line is fully rejected
     */
    public boolean isFullyRejected() {
        return rejectedQuantity != null && 
               rejectedQuantity.compareTo(quantityReceived) == 0;
    }

    /**
     * Check if the line is partially accepted
     */
    public boolean isPartiallyAccepted() {
        return acceptedQuantity != null && rejectedQuantity != null &&
               acceptedQuantity.compareTo(BigDecimal.ZERO) > 0 && 
               rejectedQuantity.compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Check if quantity variance is within acceptable limits
     */
    public boolean isVarianceAcceptable(BigDecimal tolerancePercentage) {
        if (variancePercentage == null) {
            calculateVariancePercentage();
        }
        
        return variancePercentage != null && 
               variancePercentage.abs().compareTo(tolerancePercentage) <= 0;
    }

    /**
     * Get effective quantity for stock update
     */
    public BigDecimal getEffectiveQuantity() {
        return acceptedQuantity != null ? acceptedQuantity : quantityReceived;
    }

    /**
     * Get shortage quantity
     */
    public BigDecimal getShortageQuantity() {
        if (quantityOrdered != null && quantityReceived != null) {
            BigDecimal shortage = quantityOrdered.subtract(quantityReceived);
            return shortage.compareTo(BigDecimal.ZERO) > 0 ? shortage : BigDecimal.ZERO;
        }
        return BigDecimal.ZERO;
    }

    /**
     * Get excess quantity
     */
    public BigDecimal getExcessQuantity() {
        if (quantityOrdered != null && quantityReceived != null) {
            BigDecimal excess = quantityReceived.subtract(quantityOrdered);
            return excess.compareTo(BigDecimal.ZERO) > 0 ? excess : BigDecimal.ZERO;
        }
        return BigDecimal.ZERO;
    }

    /**
     * Update PO line received quantity
     */
    public void updatePoLineReceived() {
        if (poLine != null && acceptedQuantity != null) {
            poLine.updateReceivedQuantity(acceptedQuantity);
        }
    }

    /**
     * Validate batch/serial numbers if required
     */
    public boolean isTraceabilityValid() {
        // Add business logic for batch/serial number validation
        // This could check against supplier requirements or item configuration
        return true; // Placeholder implementation
    }

    /**
     * Check if item requires special handling
     */
    public boolean requiresSpecialHandling() {
        return expiryDate != null || 
               conditionStatus == ConditionStatus.DAMAGED ||
               conditionStatus == ConditionStatus.PARTIAL_DAMAGE;
    }

    /**
     * Get cost per unit for accepted quantity
     */
    public BigDecimal getAcceptedUnitCost() {
        if (acceptedQuantity != null && acceptedQuantity.compareTo(BigDecimal.ZERO) > 0) {
            return totalCost != null ? 
                totalCost.divide(acceptedQuantity, 2, RoundingMode.HALF_UP) : 
                unitCost;
        }
        return unitCost;
    }
}
