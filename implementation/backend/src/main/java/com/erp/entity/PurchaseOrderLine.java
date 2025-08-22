package com.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@Table(name = "purchase_order_lines")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class PurchaseOrderLine extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "po_id", nullable = false)
    private PurchaseOrder purchaseOrder;

    @Column(name = "line_number", nullable = false)
    private Integer lineNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "quantity_ordered", nullable = false, precision = 19, scale = 4)
    private BigDecimal quantityOrdered;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id", nullable = false)
    private UnitOfMeasure unit;

    @Column(name = "unit_cost", nullable = false, precision = 18, scale = 2)
    private BigDecimal unitCost;

    @Column(name = "total_cost", precision = 18, scale = 2)
    private BigDecimal totalCost;

    @Column(name = "quantity_received", precision = 19, scale = 4, columnDefinition = "DECIMAL(19,4) DEFAULT 0")
    private BigDecimal quantityReceived = BigDecimal.ZERO;

    @Column(name = "quantity_pending", precision = 19, scale = 4)
    private BigDecimal quantityPending;

    @Column(name = "delivery_date")
    private java.time.LocalDate deliveryDate;

    @Column(name = "discount_percentage", precision = 5, scale = 2)
    private BigDecimal discountPercentage;

    @Column(name = "discount_amount", precision = 18, scale = 2)
    private BigDecimal discountAmount;

    @Column(name = "tax_percentage", precision = 5, scale = 2)
    private BigDecimal taxPercentage;

    @Column(name = "tax_amount", precision = 18, scale = 2)
    private BigDecimal taxAmount;

    @Column(name = "net_amount", precision = 18, scale = 2)
    private BigDecimal netAmount;

    @Column(name = "specifications", columnDefinition = "TEXT")
    private String specifications;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pr_line_id")
    private PurchaseRequisitionLine prLine;

    // Calculated methods
    public void calculateTotalCost() {
        if (quantityOrdered != null && unitCost != null) {
            this.totalCost = quantityOrdered.multiply(unitCost);
        }
    }

    public void calculateAmounts() {
        calculateTotalCost();
        
        if (totalCost == null) return;

        // Apply discount
        BigDecimal discountAmt = BigDecimal.ZERO;
        if (discountPercentage != null) {
            discountAmt = totalCost.multiply(discountPercentage).divide(new BigDecimal("100"));
        }
        this.discountAmount = discountAmt;

        // Calculate amount after discount
        BigDecimal amountAfterDiscount = totalCost.subtract(discountAmt);

        // Apply tax
        BigDecimal taxAmt = BigDecimal.ZERO;
        if (taxPercentage != null) {
            taxAmt = amountAfterDiscount.multiply(taxPercentage).divide(new BigDecimal("100"));
        }
        this.taxAmount = taxAmt;

        // Calculate net amount
        this.netAmount = amountAfterDiscount.add(taxAmt);
    }

    public BigDecimal getQuantityPending() {
        if (quantityOrdered == null) return BigDecimal.ZERO;
        if (quantityReceived == null) return quantityOrdered;
        return quantityOrdered.subtract(quantityReceived);
    }

    public boolean isFullyReceived() {
        return quantityOrdered != null && quantityReceived != null 
            && quantityReceived.compareTo(quantityOrdered) >= 0;
    }

    public boolean isPartiallyReceived() {
        return quantityReceived != null && quantityReceived.compareTo(BigDecimal.ZERO) > 0 
            && !isFullyReceived();
    }

    /**
     * Update received quantity (used by GRV processing)
     */
    public void updateReceivedQuantity(BigDecimal receivedQty) {
        if (receivedQty == null || receivedQty.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Received quantity must be non-negative");
        }
        
        if (quantityReceived == null) {
            quantityReceived = BigDecimal.ZERO;
        }
        
        this.quantityReceived = quantityReceived.add(receivedQty);
        
        // Ensure received quantity doesn't exceed ordered quantity
        if (quantityReceived.compareTo(quantityOrdered) > 0) {
            quantityReceived = quantityOrdered;
        }
        
        calculateAmounts();
    }
}
