package com.erp.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Quotation entity for Ethiopian business practices
 * Supports quotations with Ethiopian calendar, cultural considerations, and VAT
 */
@Entity
@Table(name = "quotations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(exclude = {"quotationLines"})
public class Quotation extends BaseEntity {

    @Column(name = "quotation_number", nullable = false, unique = true, length = 50)
    private String quotationNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "quotation_date", nullable = false)
    private LocalDate quotationDate;

    @Column(name = "valid_until", nullable = false)
    private LocalDate validUntil;

    @Column(name = "ethiopian_quotation_date", length = 50)
    private String ethiopianQuotationDate; // Ethiopian calendar date

    @Column(name = "ethiopian_valid_until", length = 50)
    private String ethiopianValidUntil; // Ethiopian calendar date

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private QuotationStatus status = QuotationStatus.DRAFT;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    @Builder.Default
    private QuotationPriority priority = QuotationPriority.NORMAL;

    @Column(name = "reference_number", length = 100)
    private String referenceNumber; // Customer's reference

    @Column(name = "inquiry_source", length = 100)
    private String inquirySource; // Phone, Email, Walk-in, etc.

    @Column(name = "subtotal", nullable = false, precision = 19, scale = 4)
    @Builder.Default
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Column(name = "vat_amount", nullable = false, precision = 19, scale = 4)
    @Builder.Default
    private BigDecimal vatAmount = BigDecimal.ZERO;

    @Column(name = "vat_rate", nullable = false, precision = 5, scale = 4)
    @Builder.Default
    private BigDecimal vatRate = BigDecimal.valueOf(0.15); // 15% VAT for Ethiopia

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
    private SalesOrder.PaymentTerms paymentTerms;

    @Column(name = "delivery_terms", columnDefinition = "TEXT")
    private String deliveryTerms;

    @Column(name = "estimated_delivery_days")
    private Integer estimatedDeliveryDays;

    // Ethiopian business considerations
    @Column(name = "language_preference", length = 10)
    @Builder.Default
    private String languagePreference = "en"; // en, am (Amharic)

    @Column(name = "cultural_notes", columnDefinition = "TEXT")
    private String culturalNotes;

    @Column(name = "fasting_season_note", columnDefinition = "TEXT")
    private String fastingSeasonNote; // Special notes for Orthodox fasting periods

    @Column(name = "holiday_consideration", columnDefinition = "TEXT")
    private String holidayConsideration; // Ethiopian holidays consideration

    // Sales and approval information
    @Column(name = "prepared_by", length = 100)
    private String preparedBy;

    @Column(name = "approved_by", length = 100)
    private String approvedBy;

    @Column(name = "approval_date")
    private LocalDateTime approvalDate;

    @Column(name = "customer_contact_person", length = 100)
    private String customerContactPerson;

    @Column(name = "customer_contact_phone", length = 50)
    private String customerContactPhone;

    @Column(name = "customer_contact_email", length = 100)
    private String customerContactEmail;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "terms_and_conditions", columnDefinition = "TEXT")
    private String termsAndConditions;

    @Column(name = "warranty_terms", columnDefinition = "TEXT")
    private String warrantyTerms;

    // Conversion tracking
    @Column(name = "converted_to_order")
    @Builder.Default
    private Boolean convertedToOrder = false;

    @Column(name = "converted_order_id")
    private Long convertedOrderId;

    @Column(name = "conversion_date")
    private LocalDateTime conversionDate;

    @OneToMany(mappedBy = "quotation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<QuotationLine> quotationLines;

    // Calculate totals
    @PrePersist
    @PreUpdate
    public void calculateTotals() {
        if (quotationLines != null && !quotationLines.isEmpty()) {
            subtotal = BigDecimal.ZERO;
            for (QuotationLine line : quotationLines) {
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

        // Total = Subtotal - Discount + VAT
        totalAmount = discountedSubtotal.add(vatAmount);
    }

    public enum QuotationStatus {
        DRAFT,
        PENDING_APPROVAL,
        APPROVED,
        SENT_TO_CUSTOMER,
        CUSTOMER_REVIEWING,
        ACCEPTED,
        REJECTED,
        EXPIRED,
        CANCELLED,
        CONVERTED_TO_ORDER
    }

    public enum QuotationPriority {
        LOW,
        NORMAL,
        HIGH,
        URGENT
    }
}
