package com.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.List;

/**
 * Item entity for inventory items
 */
@Entity
@Table(name = "items")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Item extends BaseEntity {

    @Column(name = "item_code", unique = true, nullable = false, length = 50)
    private String itemCode;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id")
    private UnitOfMeasure unit;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_type", nullable = false)
    private ItemType itemType;

    @Column(name = "standard_cost", precision = 18, scale = 2)
    private BigDecimal standardCost;

    @Column(name = "selling_price", precision = 18, scale = 2)
    private BigDecimal sellingPrice;

    @Column(name = "reorder_level")
    private Integer reorderLevel = 0;

    @Column(name = "max_stock_level")
    private Integer maxStockLevel;

    @Column(name = "min_stock_level")
    private Integer minStockLevel = 0;

    @Column(name = "lead_time_days")
    private Integer leadTimeDays = 0;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @OneToMany(mappedBy = "item", fetch = FetchType.LAZY)
    private List<StockLevel> stockLevels;

    @OneToMany(mappedBy = "item", fetch = FetchType.LAZY)
    private List<StockMovement> stockMovements;

    public enum ItemType {
        PRODUCT, SERVICE, RAW_MATERIAL
    }

}
