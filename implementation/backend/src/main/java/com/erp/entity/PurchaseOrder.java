package com.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "purchase_orders")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class PurchaseOrder extends BaseEntity {

    @Column(name = "po_number", unique = true, nullable = false, length = 20)
    private String poNumber;

    @Column(name = "po_date", nullable = false)
    private LocalDate poDate;

    @Column(name = "delivery_date")
    private LocalDate deliveryDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private POStatus status = POStatus.DRAFT;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", length = 10)
    private Priority priority = Priority.MEDIUM;

    @Column(name = "reference_number", length = 50)
    private String referenceNumber;

    @Column(name = "payment_terms", length = 100)
    private String paymentTerms;

    @Column(name = "delivery_address", columnDefinition = "TEXT")
    private String deliveryAddress;

    @Column(name = "total_amount", precision = 18, scale = 2)
    private BigDecimal totalAmount;

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

    @Column(name = "terms_and_conditions", columnDefinition = "TEXT")
    private String termsAndConditions;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Column(name = "approved_date")
    private LocalDate approvedDate;

    @OneToMany(mappedBy = "purchaseOrder", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PurchaseOrderLine> poLines;

    public enum POStatus {
        DRAFT,
        SUBMITTED,
        APPROVED,
        SENT_TO_SUPPLIER,
        ACKNOWLEDGED,
        PARTIALLY_RECEIVED,
        FULLY_RECEIVED,
        CLOSED,
        CANCELLED
    }

    public enum Priority {
        LOW,
        MEDIUM,
        HIGH,
        URGENT
    }

    // Business logic methods
    public boolean isEditable() {
        return status == POStatus.DRAFT;
    }

    public boolean canBeApproved() {
        return status == POStatus.SUBMITTED;
    }

    public boolean canBeSentToSupplier() {
        return status == POStatus.APPROVED;
    }

    public boolean canReceiveGoods() {
        return status == POStatus.SENT_TO_SUPPLIER || 
               status == POStatus.ACKNOWLEDGED || 
               status == POStatus.PARTIALLY_RECEIVED;
    }

    public void calculateTotals() {
        if (poLines == null || poLines.isEmpty()) {
            this.totalAmount = BigDecimal.ZERO;
            this.netAmount = BigDecimal.ZERO;
            return;
        }

        // Calculate total amount from lines
        this.totalAmount = poLines.stream()
            .map(line -> line.getTotalCost() != null ? line.getTotalCost() : BigDecimal.ZERO)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Apply discount
        BigDecimal discountAmt = BigDecimal.ZERO;
        if (discountPercentage != null && totalAmount != null) {
            discountAmt = totalAmount.multiply(discountPercentage).divide(new BigDecimal("100"));
        }
        this.discountAmount = discountAmt;

        // Calculate amount after discount
        BigDecimal amountAfterDiscount = totalAmount.subtract(discountAmt);

        // Apply tax
        BigDecimal taxAmt = BigDecimal.ZERO;
        if (taxPercentage != null && amountAfterDiscount != null) {
            taxAmt = amountAfterDiscount.multiply(taxPercentage).divide(new BigDecimal("100"));
        }
        this.taxAmount = taxAmt;

        // Calculate net amount
        this.netAmount = amountAfterDiscount.add(taxAmt);
    }
}
