package com.erp.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_movements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(exclude = {"item"})
public class StockMovement extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @Enumerated(EnumType.STRING)
    @Column(name = "movement_type", nullable = false, length = 20)
    private MovementType movementType;

    @Column(name = "quantity", nullable = false, precision = 19, scale = 4)
    private BigDecimal quantity;

    @Column(name = "unit_cost", precision = 19, scale = 4)
    private BigDecimal unitCost;

    @Column(name = "total_cost", precision = 19, scale = 4)
    private BigDecimal totalCost;

    @Column(name = "location", nullable = false, length = 50)
    private String location;

    @Column(name = "reference_number", length = 100)
    private String referenceNumber;

    @Column(name = "reference_type", length = 50)
    private String referenceType;

    @Column(name = "notes", length = 500)
    private String notes;

    @Column(name = "movement_date", nullable = false)
    @Builder.Default
    private LocalDateTime movementDate = LocalDateTime.now();

    public enum MovementType {
        IN,          // Stock receipt
        OUT,         // Stock issue
        TRANSFER,    // Between locations
        ADJUSTMENT,  // Inventory adjustment
        RETURN,      // Return to supplier
        DAMAGED,     // Damaged goods
        LOST         // Lost/stolen items
    }

    @PrePersist
    public void calculateTotalCost() {
        if (quantity != null && unitCost != null) {
            this.totalCost = quantity.multiply(unitCost);
        }
    }
}
