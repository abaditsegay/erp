package com.erp.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@Table(name = "stock_levels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(exclude = {"item"})
public class StockLevel extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id")
    private Warehouse warehouse;

    @Column(name = "location", nullable = false, length = 50)
    private String location;

    @Column(name = "quantity_on_hand", nullable = false, precision = 19, scale = 4)
    @Builder.Default
    private BigDecimal quantityOnHand = BigDecimal.ZERO;

    @Column(name = "reserved_quantity", nullable = false, precision = 19, scale = 4)
    @Builder.Default
    private BigDecimal reservedQuantity = BigDecimal.ZERO;

    @Column(name = "available_quantity", nullable = false, precision = 19, scale = 4)
    @Builder.Default
    private BigDecimal availableQuantity = BigDecimal.ZERO;

    @Column(name = "reorder_level", precision = 19, scale = 4)
    private BigDecimal reorderLevel;

    @Column(name = "max_level", precision = 19, scale = 4)
    private BigDecimal maxLevel;

    @PrePersist
    @PreUpdate
    public void calculateAvailableQuantity() {
        if (quantityOnHand != null && reservedQuantity != null) {
            this.availableQuantity = quantityOnHand.subtract(reservedQuantity);
        }
    }
}
