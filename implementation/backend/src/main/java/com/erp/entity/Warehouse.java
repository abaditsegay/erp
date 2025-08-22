package com.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

/**
 * Warehouse entity for Ethiopian inventory management
 * Supports multiple warehouse locations common in Ethiopian businesses
 */
@Entity
@Table(name = "warehouses")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Warehouse extends BaseEntity {

    @Column(name = "warehouse_code", unique = true, nullable = false, length = 20)
    private String warehouseCode;

    @Column(name = "warehouse_name", nullable = false, length = 100)
    private String warehouseName;

    @Column(name = "location", length = 100)
    private String location;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "city", length = 50)
    private String city;

    @Column(name = "region", length = 50) // Ethiopian regions like Addis Ababa, Oromia, Amhara, etc.
    private String region;

    @Column(name = "contact_person", length = 100)
    private String contactPerson;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "email", length = 100)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "warehouse_type", nullable = false)
    private WarehouseType warehouseType;

    @Column(name = "capacity_cubic_meter")
    private Double capacityCubicMeter;

    @Column(name = "is_refrigerated")
    private Boolean isRefrigerated = false;

    @Column(name = "has_security")
    private Boolean hasSecurity = true;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "warehouse", fetch = FetchType.LAZY)
    private List<StockLevel> stockLevels;

    public enum WarehouseType {
        MAIN_WAREHOUSE,      // Central warehouse
        BRANCH_WAREHOUSE,    // Branch location
        RETAIL_STORE,        // Retail outlet
        DISTRIBUTION_CENTER, // Distribution point
        TEMPORARY_STORAGE,   // Temporary storage
        CUSTOMS_WAREHOUSE,   // For import/export goods
        RAW_MATERIAL_STORE, // For manufacturing
        FINISHED_GOODS_STORE // For finished products
    }

    /**
     * Check if warehouse has capacity for additional items
     */
    public boolean hasCapacity(Double requiredSpace) {
        if (capacityCubicMeter == null || requiredSpace == null) {
            return true; // Assume capacity if not specified
        }
        // This would need to calculate current usage vs capacity
        return true; // Simplified for now
    }

    /**
     * Check if warehouse is suitable for item type
     */
    public boolean isSuitableFor(Item item) {
        // Add business logic for item compatibility
        // For example, perishable items need refrigerated warehouses
        return isActive;
    }

    /**
     * Get warehouse display name with location
     */
    public String getDisplayName() {
        return String.format("%s - %s (%s)", warehouseCode, warehouseName, 
                            city != null ? city : location);
    }
}
