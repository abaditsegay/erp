package com.erp.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

/**
 * Customer entity enhanced for Ethiopian business practices
 * Includes Ethiopian administrative divisions, tax information, and cultural considerations
 */
@Entity
@Table(name = "customers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString
public class Customer extends BaseEntity {

    @Column(name = "code", nullable = false, unique = true, length = 20)
    private String code;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "name_amharic", length = 100)
    private String nameAmharic; // Customer name in Amharic

    @Column(name = "contact_person", length = 100)
    private String contactPerson;

    @Column(name = "contact_person_amharic", length = 100)
    private String contactPersonAmharic; // Contact person name in Amharic

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "mobile", length = 20)
    private String mobile;

    @Column(name = "fax", length = 20)
    private String fax;

    @Column(name = "address", length = 500)
    private String address;

    @Column(name = "address_amharic", length = 500)
    private String addressAmharic; // Address in Amharic

    // Ethiopian Administrative Divisions
    @Column(name = "region", length = 100)
    private String region; // Addis Ababa, Oromia, Amhara, etc.

    @Column(name = "zone", length = 100)
    private String zone; // Administrative zone

    @Column(name = "woreda", length = 100)
    private String woreda; // Woreda/District

    @Column(name = "kebele", length = 100)
    private String kebele; // Kebele (smallest administrative unit)

    @Column(name = "house_number", length = 50)
    private String houseNumber;

    @Column(name = "po_box", length = 50)
    private String poBox; // P.O. Box

    // Business and Tax Information
    @Column(name = "tin_number", length = 50)
    private String tinNumber; // Tax Identification Number

    @Column(name = "vat_number", length = 50)
    private String vatNumber; // VAT Registration Number

    @Column(name = "business_license_number", length = 50)
    private String businessLicenseNumber;

    @Column(name = "business_license_date")
    private LocalDate businessLicenseDate;

    @Column(name = "trade_name", length = 100)
    private String tradeName; // Trading name if different

    @Enumerated(EnumType.STRING)
    @Column(name = "customer_type")
    @Builder.Default
    private CustomerType customerType = CustomerType.INDIVIDUAL;

    @Enumerated(EnumType.STRING)
    @Column(name = "business_type")
    private BusinessType businessType;

    // Tax and Financial Information
    @Column(name = "vat_registered")
    @Builder.Default
    private Boolean vatRegistered = false;

    @Column(name = "withholding_tax_applicable")
    @Builder.Default
    private Boolean withholdingTaxApplicable = false;

    @Column(name = "withholding_tax_rate", precision = 5, scale = 4)
    @Builder.Default
    private BigDecimal withholdingTaxRate = BigDecimal.ZERO;

    @Column(name = "credit_limit", precision = 19, scale = 4)
    @Builder.Default
    private BigDecimal creditLimit = BigDecimal.ZERO;

    @Column(name = "credit_days")
    @Builder.Default
    private Integer creditDays = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_terms")
    @Builder.Default
    private PaymentTerms paymentTerms = PaymentTerms.CASH;

    // Cultural and Language Preferences
    @Column(name = "language_preference", length = 10)
    @Builder.Default
    private String languagePreference = "en"; // en, am (Amharic)

    @Column(name = "cultural_notes", columnDefinition = "TEXT")
    private String culturalNotes; // Cultural considerations for business

    @Column(name = "religious_considerations", columnDefinition = "TEXT")
    private String religiousConsiderations; // Orthodox fasting periods, etc.

    @Column(name = "preferred_meeting_days", length = 100)
    private String preferredMeetingDays; // Days of week for meetings

    @Column(name = "preferred_delivery_time", length = 100)
    private String preferredDeliveryTime; // Time preferences for delivery

    // Banking Information
    @Column(name = "bank_name", length = 100)
    private String bankName;

    @Column(name = "bank_account_number", length = 50)
    private String bankAccountNumber;

    @Column(name = "bank_branch", length = 100)
    private String bankBranch;

    // Status and Management
    @Column(name = "active", nullable = false)
    @Builder.Default
    private Boolean active = true;

    @Column(name = "approved")
    @Builder.Default
    private Boolean approved = false;

    @Column(name = "approval_date")
    private LocalDate approvalDate;

    @Column(name = "approved_by", length = 100)
    private String approvedBy;

    @Column(name = "customer_since")
    private LocalDate customerSince;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    public enum CustomerType {
        INDIVIDUAL,
        BUSINESS,
        GOVERNMENT,
        NGO,
        INTERNATIONAL_ORGANIZATION
    }

    public enum BusinessType {
        SOLE_PROPRIETORSHIP,
        PARTNERSHIP,
        PRIVATE_LIMITED_COMPANY,
        SHARE_COMPANY,
        PUBLIC_ENTERPRISE,
        COOPERATIVE,
        ASSOCIATION,
        FOREIGN_COMPANY
    }

    public enum PaymentTerms {
        CASH,
        NET_15,
        NET_30,
        NET_45,
        NET_60,
        ADVANCE_PAYMENT,
        LETTER_OF_CREDIT
    }
}
