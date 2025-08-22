package com.erp.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

/**
 * Shipment entity for Ethiopian logistics management
 * Supports comprehensive tracking and customs integration
 */
@Entity
@Table(name = "shipments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(exclude = {"events", "documents"})
public class Shipment extends BaseEntity {
    
    @Column(name = "tracking_number", unique = true, nullable = false)
    private String trackingNumber;
    
    @Column(name = "description", nullable = false)
    private String description;
    
    @Column(name = "origin", nullable = false)
    private String origin;
    
    @Column(name = "destination", nullable = false)
    private String destination;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ShipmentStatus status;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "mode", nullable = false)
    private TransportMode mode;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private Priority priority;
    
    @Column(name = "carrier")
    private String carrier;
    
    @Column(name = "weight_kg")
    private BigDecimal weightKg;
    
    @Column(name = "volume_cbm")
    private BigDecimal volumeCbm;
    
    @Column(name = "customs_value")
    private BigDecimal customsValue;
    
    @Column(name = "currency", length = 3)
    private String currency;
    
    @Column(name = "duty_amount")
    private BigDecimal dutyAmount;
    
    @Column(name = "vat_amount")
    private BigDecimal vatAmount;
    
    @Column(name = "total_taxes")
    private BigDecimal totalTaxes;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "created_date")
    private LocalDateTime createdDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "pickup_date")
    private LocalDateTime pickupDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "estimated_delivery")
    private LocalDateTime estimatedDelivery;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "actual_delivery")
    private LocalDateTime actualDelivery;
    
    @Column(name = "customs_declaration_number")
    private String customsDeclarationNumber;
    
    @Column(name = "port_of_entry")
    private String portOfEntry;
    
    @Column(name = "customs_agent")
    private String customsAgent;
    
    @Column(name = "tin_number")
    private String tinNumber;
    
    @Column(name = "importer_name")
    private String importerName;
    
    @Column(name = "is_international")
    @Builder.Default
    private Boolean isInternational = false;
    
    @Column(name = "requires_customs")
    @Builder.Default
    private Boolean requiresCustoms = false;
    
    @Column(name = "is_temperature_controlled")
    @Builder.Default
    private Boolean isTemperatureControlled = false;
    
    @Column(name = "special_instructions", columnDefinition = "TEXT")
    private String specialInstructions;
    
    @OneToMany(mappedBy = "shipment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ShipmentEvent> events;
    
    @OneToMany(mappedBy = "shipment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ShipmentDocument> documents;
    
    public enum ShipmentStatus {
        CREATED("Created"),
        PICKED_UP("Picked Up"),
        IN_TRANSIT("In Transit"),
        CUSTOMS_PROCESSING("Customs Processing"),
        CUSTOMS_CLEARED("Customs Cleared"),
        OUT_FOR_DELIVERY("Out for Delivery"),
        DELIVERED("Delivered"),
        DELAYED("Delayed"),
        CANCELLED("Cancelled"),
        RETURNED("Returned");
        
        private final String displayName;
        
        ShipmentStatus(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public enum TransportMode {
        AIR("Air"),
        SEA("Sea"),
        LAND("Land"),
        RAIL("Rail"),
        MULTIMODAL("Multimodal");
        
        private final String displayName;
        
        TransportMode(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public enum Priority {
        LOW("Low"),
        NORMAL("Normal"),
        HIGH("High"),
        URGENT("Urgent"),
        CRITICAL("Critical");
        
        private final String displayName;
        
        Priority(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    /**
     * Calculate delivery time in hours
     */
    public Long getDeliveryTimeHours() {
        if (createdDate != null && actualDelivery != null) {
            return java.time.Duration.between(createdDate, actualDelivery).toHours();
        }
        return null;
    }
    
    /**
     * Check if shipment is delayed
     */
    public boolean isDelayed() {
        if (estimatedDelivery != null && status != ShipmentStatus.DELIVERED) {
            return LocalDateTime.now().isAfter(estimatedDelivery);
        }
        if (estimatedDelivery != null && actualDelivery != null) {
            return actualDelivery.isAfter(estimatedDelivery);
        }
        return false;
    }
    
    /**
     * Get completion percentage based on status
     */
    public int getCompletionPercentage() {
        return switch (status) {
            case CREATED -> 10;
            case PICKED_UP -> 20;
            case IN_TRANSIT -> 50;
            case CUSTOMS_PROCESSING -> 70;
            case CUSTOMS_CLEARED -> 80;
            case OUT_FOR_DELIVERY -> 90;
            case DELIVERED -> 100;
            case DELAYED -> 50;
            case CANCELLED, RETURNED -> 0;
        };
    }
    
    /**
     * Get total value including taxes
     */
    public BigDecimal getTotalValue() {
        BigDecimal total = customsValue != null ? customsValue : BigDecimal.ZERO;
        if (dutyAmount != null) total = total.add(dutyAmount);
        if (vatAmount != null) total = total.add(vatAmount);
        if (totalTaxes != null) total = total.add(totalTaxes);
        return total;
    }
    
    /**
     * Check if customs clearance is required
     */
    public boolean needsCustomsClearance() {
        return isInternational && requiresCustoms;
    }
    
    /**
     * Get Ethiopian formatted display
     */
    public String getEthiopianDisplayStatus() {
        return switch (status) {
            case CREATED -> "ተፈጥሯል";
            case PICKED_UP -> "ተወስዷል";
            case IN_TRANSIT -> "በመንገድ ላይ";
            case CUSTOMS_PROCESSING -> "በጉምሩክ ሂደት";
            case CUSTOMS_CLEARED -> "ጉምሩክ ተጠርቷል";
            case OUT_FOR_DELIVERY -> "ለማድረስ ወጥቷል";
            case DELIVERED -> "ተደርሷል";
            case DELAYED -> "ዘግይቷል";
            case CANCELLED -> "ተሰርዟል";
            case RETURNED -> "ተመልሷል";
        };
    }
}
