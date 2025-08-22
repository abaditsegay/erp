package com.erp.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
 * Sales Order Line entity for Ethiopian business
 * Represents individual items in a sales order with VAT and pricing
 */
@Entity
@Table(name = "sales_order_lines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(exclude = {"salesOrder", "product"})
public class SalesOrderLine extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sales_order_id", nullable = false)
    private SalesOrder salesOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "product_code", length = 50)
    private String productCode;

    @Column(name = "product_name", nullable = false, length = 200)
    private String productName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "quantity", nullable = false, precision = 19, scale = 4)
    @Builder.Default
    private BigDecimal quantity = BigDecimal.ONE;

    @Column(name = "unit_price", nullable = false, precision = 19, scale = 4)
    @Builder.Default
    private BigDecimal unitPrice = BigDecimal.ZERO;

    @Column(name = "discount_percentage", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal discountPercentage = BigDecimal.ZERO;

    @Column(name = "discount_amount", precision = 19, scale = 4)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "line_total", nullable = false, precision = 19, scale = 4)
    @Builder.Default
    private BigDecimal lineTotal = BigDecimal.ZERO;

    @Column(name = "vat_rate", nullable = false, precision = 5, scale = 4)
    @Builder.Default
    private BigDecimal vatRate = BigDecimal.valueOf(0.15); // 15% VAT for Ethiopia

    @Column(name = "vat_amount", precision = 19, scale = 4)
    @Builder.Default
    private BigDecimal vatAmount = BigDecimal.ZERO;

    @Column(name = "line_total_with_vat", precision = 19, scale = 4)
    @Builder.Default
    private BigDecimal lineTotalWithVat = BigDecimal.ZERO;

    @Column(name = "unit_of_measure", length = 20)
    @Builder.Default
    private String unitOfMeasure = "PC"; // Pieces, KG, M, etc.

    @Column(name = "delivered_quantity", precision = 19, scale = 4)
    @Builder.Default
    private BigDecimal deliveredQuantity = BigDecimal.ZERO;

    @Column(name = "remaining_quantity", precision = 19, scale = 4)
    @Builder.Default
    private BigDecimal remainingQuantity = BigDecimal.ZERO;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @PrePersist
    @PreUpdate
    public void calculateAmounts() {
        // Calculate discount amount
        if (discountPercentage != null && discountPercentage.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal subtotal = quantity.multiply(unitPrice);
            discountAmount = subtotal.multiply(discountPercentage).divide(BigDecimal.valueOf(100));
        }

        // Calculate line total (quantity * unit price - discount)
        lineTotal = quantity.multiply(unitPrice).subtract(discountAmount != null ? discountAmount : BigDecimal.ZERO);

        // Calculate VAT
        vatAmount = lineTotal.multiply(vatRate);

        // Calculate line total with VAT
        lineTotalWithVat = lineTotal.add(vatAmount);

        // Calculate remaining quantity
        remainingQuantity = quantity.subtract(deliveredQuantity != null ? deliveredQuantity : BigDecimal.ZERO);
    }

    // Custom getter methods for Ethiopian business calculations
    public BigDecimal getLineTotal() {
        if (lineTotal == null) {
            calculateAmounts();
        }
        return lineTotal;
    }

    public BigDecimal getLineTotalWithVat() {
        if (lineTotalWithVat == null) {
            calculateAmounts();
        }
        return lineTotalWithVat;
    }

    public BigDecimal getVatAmount() {
        if (vatAmount == null) {
            calculateAmounts();
        }
        return vatAmount;
    }
}
