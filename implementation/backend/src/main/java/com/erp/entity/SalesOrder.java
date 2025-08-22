package com.erp.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

/**
 * Sales Order entity tailored for Ethiopian business practices
 * Includes VAT calculations, Ethiopian calendar support, and regional considerations
 */
@Entity
@Table(name = "sales_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(exclude = {"salesOrderLines"})
public class SalesOrder extends BaseEntity {

    @Column(name = "order_number", nullable = false, unique = true, length = 50)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "order_date", nullable = false)
    private LocalDate orderDate;

    @Column(name = "expected_delivery_date")
    private LocalDate expectedDeliveryDate;

    @Column(name = "delivery_address", columnDefinition = "TEXT")
    private String deliveryAddress;

    // Ethiopian specific fields
    @Column(name = "ethiopian_order_date", length = 50)
    private String ethiopianOrderDate; // Ethiopian calendar date

    @Column(name = "delivery_region", length = 100)
    private String deliveryRegion; // Ethiopian region (Addis Ababa, Oromia, etc.)

    @Column(name = "delivery_zone", length = 100)
    private String deliveryZone; // Ethiopian administrative zone

    @Column(name = "delivery_woreda", length = 100)
    private String deliveryWoreda; // Ethiopian woreda

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private SalesOrderStatus status = SalesOrderStatus.DRAFT;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    @Builder.Default
    private OrderPriority priority = OrderPriority.NORMAL;

    @Column(name = "subtotal", nullable = false, precision = 19, scale = 4)
    @Builder.Default
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Column(name = "vat_amount", nullable = false, precision = 19, scale = 4)
    @Builder.Default
    private BigDecimal vatAmount = BigDecimal.ZERO;

    @Column(name = "vat_rate", nullable = false, precision = 5, scale = 4)
    @Builder.Default
    private BigDecimal vatRate = BigDecimal.valueOf(0.15); // 15% VAT for Ethiopia

    @Column(name = "withholding_tax_amount", precision = 19, scale = 4)
    @Builder.Default
    private BigDecimal withholdingTaxAmount = BigDecimal.ZERO;

    @Column(name = "withholding_tax_rate", precision = 5, scale = 4)
    @Builder.Default
    private BigDecimal withholdingTaxRate = BigDecimal.ZERO;

    @Column(name = "total_amount", nullable = false, precision = 19, scale = 4)
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "discount_amount", precision = 19, scale = 4)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "discount_percentage", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal discountPercentage = BigDecimal.ZERO;

    // Payment and delivery terms
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_terms")
    private PaymentTerms paymentTerms;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;

    @Column(name = "credit_limit_check")
    @Builder.Default
    private Boolean creditLimitCheck = false;

    @Column(name = "requires_advance_payment")
    @Builder.Default
    private Boolean requiresAdvancePayment = false;

    @Column(name = "advance_payment_percentage", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal advancePaymentPercentage = BigDecimal.ZERO;

    // Ethiopian business considerations
    @Column(name = "fasting_season_consideration")
    @Builder.Default
    private Boolean fastingSeasonConsideration = false; // Consider Orthodox fasting

    @Column(name = "holiday_impact_assessment")
    @Builder.Default
    private Boolean holidayImpactAssessment = false; // Ethiopian holidays impact

    @Column(name = "cultural_notes", columnDefinition = "TEXT")
    private String culturalNotes; // Cultural considerations for delivery

    @Column(name = "language_preference", length = 10)
    @Builder.Default
    private String languagePreference = "en"; // en, am (Amharic)

    // Sales representative and approval
    @Column(name = "sales_representative", length = 100)
    private String salesRepresentative;

    @Column(name = "approved_by", length = 100)
    private String approvedBy;

    @Column(name = "approval_date")
    private LocalDateTime approvalDate;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "special_instructions", columnDefinition = "TEXT")
    private String specialInstructions;

    @OneToMany(mappedBy = "salesOrder", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<SalesOrderLine> salesOrderLines;

    // Ethiopian VAT and tax calculations
    @PrePersist
    @PreUpdate
    public void calculateTotals() {
        if (salesOrderLines != null && !salesOrderLines.isEmpty()) {
            subtotal = BigDecimal.ZERO;
            for (SalesOrderLine line : salesOrderLines) {
                subtotal = subtotal.add(line.getLineTotal());
            }
        } else {
            subtotal = BigDecimal.ZERO;
        }

        // Apply discount
        if (discountPercentage != null && discountPercentage.compareTo(BigDecimal.ZERO) > 0) {
            discountAmount = subtotal.multiply(discountPercentage).divide(BigDecimal.valueOf(100));
        }

        BigDecimal discountedSubtotal = subtotal.subtract(discountAmount != null ? discountAmount : BigDecimal.ZERO);

        // Calculate VAT (Ethiopian standard rate: 15%)
        vatAmount = discountedSubtotal.multiply(vatRate);

        // Calculate withholding tax if applicable (varies by customer type)
        if (withholdingTaxRate != null && withholdingTaxRate.compareTo(BigDecimal.ZERO) > 0) {
            withholdingTaxAmount = discountedSubtotal.multiply(withholdingTaxRate);
        }

        // Total = Subtotal - Discount + VAT - Withholding Tax
        totalAmount = discountedSubtotal.add(vatAmount).subtract(withholdingTaxAmount != null ? withholdingTaxAmount : BigDecimal.ZERO);
    }

    public enum SalesOrderStatus {
        DRAFT,
        PENDING_APPROVAL,
        APPROVED,
        IN_PRODUCTION,
        READY_FOR_DELIVERY,
        PARTIALLY_DELIVERED,
        DELIVERED,
        INVOICED,
        PAID,
        CANCELLED,
        ON_HOLD
    }

    public enum OrderPriority {
        LOW,
        NORMAL,
        HIGH,
        URGENT,
        CRITICAL
    }

    public enum PaymentTerms {
        CASH_ON_DELIVERY,
        NET_15,
        NET_30,
        NET_45,
        NET_60,
        ADVANCE_PAYMENT,
        LETTER_OF_CREDIT,
        BANK_GUARANTEE
    }

    public enum PaymentMethod {
        CASH,
        BANK_TRANSFER,
        CHEQUE,
        MOBILE_MONEY,
        LETTER_OF_CREDIT,
        CREDIT_CARD
    }
}
