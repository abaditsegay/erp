package com.erp.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "products")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class Product extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String code;
    
    @Column(nullable = false)
    private String name;
    
    @Column(name = "name_amharic")
    private String nameAmharic;
    
    private String description;
    
    @Column(name = "description_amharic")
    private String descriptionAmharic;
    
    private String category;
    
    @Column(name = "unit_of_measure")
    private String unitOfMeasure;
    
    @Column(name = "unit_price", precision = 15, scale = 2)
    private BigDecimal unitPrice;
    
    @Column(name = "cost_price", precision = 15, scale = 2)
    private BigDecimal costPrice;
    
    @Column(name = "minimum_stock_level")
    private Integer minimumStockLevel;
    
    @Column(name = "current_stock")
    private Integer currentStock;
    
    @Column(name = "reorder_level")
    private Integer reorderLevel;
    
    @Column(name = "is_active")
    private Boolean active = true;
    
    @Column(name = "is_taxable")
    private Boolean taxable = true;
    
    @Column(name = "tax_rate", precision = 5, scale = 2)
    private BigDecimal taxRate;
    
    @Column(name = "weight_kg", precision = 10, scale = 3)
    private BigDecimal weight;
    
    @Column(name = "volume_m3", precision = 10, scale = 6)
    private BigDecimal volume;
    
    @Column(name = "barcode")
    private String barcode;
    
    @Column(name = "manufacturer")
    private String manufacturer;
    
    @Column(name = "brand")
    private String brand;
    
    @Column(name = "model")
    private String model;
    
    @Column(name = "warranty_months")
    private Integer warrantyMonths;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "specifications", columnDefinition = "TEXT")
    private String specifications;
    
    @Column(name = "country_of_origin")
    private String countryOfOrigin;
    
    @Column(name = "hs_code")
    private String hsCode;
    
    @Column(name = "lead_time_days")
    private Integer leadTimeDays;
    
    @Column(name = "shelf_life_months")
    private Integer shelfLifeMonths;
    
    @Column(name = "storage_requirements")
    private String storageRequirements;
    
    @Column(name = "created_date")
    private LocalDateTime createdDate;
    
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;
    
    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
        lastUpdated = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }
    
    // Custom methods for Ethiopian business logic
    public String getDisplayName() {
        return nameAmharic != null && !nameAmharic.trim().isEmpty() 
            ? nameAmharic + " (" + name + ")" 
            : name;
    }
    
    public BigDecimal getSellingPriceWithTax() {
        if (taxable && taxRate != null) {
            return unitPrice.add(unitPrice.multiply(taxRate.divide(new BigDecimal("100"))));
        }
        return unitPrice;
    }
    
    public Boolean isLowStock() {
        return currentStock != null && minimumStockLevel != null 
            && currentStock <= minimumStockLevel;
    }
    
    public Boolean needsReorder() {
        return currentStock != null && reorderLevel != null 
            && currentStock <= reorderLevel;
    }
    
    public BigDecimal getTotalValue() {
        if (currentStock != null && costPrice != null) {
            return costPrice.multiply(new BigDecimal(currentStock));
        }
        return BigDecimal.ZERO;
    }
}
