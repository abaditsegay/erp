package com.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@Table(name = "purchase_requisition_lines")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class PurchaseRequisitionLine extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pr_id", nullable = false)
    private PurchaseRequisition purchaseRequisition;

    @Column(name = "line_number", nullable = false)
    private Integer lineNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "quantity_requested", nullable = false, precision = 19, scale = 4)
    private BigDecimal quantityRequested;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id", nullable = false)
    private UnitOfMeasure unit;

    @Column(name = "estimated_unit_cost", precision = 18, scale = 2)
    private BigDecimal estimatedUnitCost;

    @Column(name = "estimated_total_cost", precision = 18, scale = 2)
    private BigDecimal estimatedTotalCost;

    @Column(name = "quantity_ordered", precision = 19, scale = 4, columnDefinition = "DECIMAL(19,4) DEFAULT 0")
    private BigDecimal quantityOrdered = BigDecimal.ZERO;

    @Column(name = "quantity_pending", precision = 19, scale = 4)
    private BigDecimal quantityPending;

    @Column(name = "preferred_supplier", length = 100)
    private String preferredSupplier;

    @Column(name = "urgency_remarks", columnDefinition = "TEXT")
    private String urgencyRemarks;

    @Column(name = "technical_specifications", columnDefinition = "TEXT")
    private String technicalSpecifications;

    // Calculated properties
    public BigDecimal getQuantityPending() {
        if (quantityRequested == null) return BigDecimal.ZERO;
        if (quantityOrdered == null) return quantityRequested;
        return quantityRequested.subtract(quantityOrdered);
    }

    public void calculateEstimatedTotalCost() {
        if (quantityRequested != null && estimatedUnitCost != null) {
            this.estimatedTotalCost = quantityRequested.multiply(estimatedUnitCost);
        }
    }

    public boolean isFullyOrdered() {
        return quantityRequested != null && quantityOrdered != null 
            && quantityOrdered.compareTo(quantityRequested) >= 0;
    }

    public boolean isPartiallyOrdered() {
        return quantityOrdered != null && quantityOrdered.compareTo(BigDecimal.ZERO) > 0 
            && !isFullyOrdered();
    }
}
