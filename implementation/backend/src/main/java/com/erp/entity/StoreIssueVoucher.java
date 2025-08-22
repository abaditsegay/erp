package com.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Store Issue Voucher (SIV) Entity
 * Represents the actual issuance of inventory items from stores
 * Part of Phase 2 - Core Business Modules
 */
@Entity
@Table(name = "store_issue_vouchers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class StoreIssueVoucher extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "siv_number", nullable = false, unique = true, length = 20)
    private String sivNumber;

    @Column(name = "siv_date", nullable = false)
    private LocalDate sivDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sr_id")
    private StoreRequisition storeRequisition;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issued_by", nullable = false)
    private User issuedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "received_by", nullable = false)
    private User receivedBy;

    @Column(name = "receiving_department", length = 50)
    private String receivingDepartment;

    @Column(name = "cost_center", length = 20)
    private String costCenter;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private SIVStatus status = SIVStatus.DRAFT;

    @Enumerated(EnumType.STRING)
    @Column(name = "issue_type", nullable = false, length = 20)
    private IssueType issueType = IssueType.NORMAL;

    @Column(name = "purpose", columnDefinition = "TEXT")
    private String purpose;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "received_date")
    private LocalDate receivedDate;

    @Column(name = "total_cost", precision = 18, scale = 2)
    private BigDecimal totalCost;

    @OneToMany(mappedBy = "storeIssueVoucher", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<StoreIssueVoucherLine> sivLines = new ArrayList<>();

    // Enums
    public enum SIVStatus {
        DRAFT,
        ISSUED,
        RECEIVED,
        RETURNED,
        CANCELLED
    }

    public enum IssueType {
        NORMAL,
        EMERGENCY,
        RETURNABLE,
        TRANSFER,
        SCRAP,
        SAMPLE
    }

    // Business Logic Methods

    /**
     * Check if the SIV can be edited
     */
    public boolean isEditable() {
        return status == SIVStatus.DRAFT;
    }

    /**
     * Check if the SIV can be issued
     */
    public boolean canBeIssued() {
        return status == SIVStatus.DRAFT && !sivLines.isEmpty();
    }

    /**
     * Check if the SIV can be received
     */
    public boolean canBeReceived() {
        return status == SIVStatus.ISSUED;
    }

    /**
     * Check if the SIV can be cancelled
     */
    public boolean canBeCancelled() {
        return status == SIVStatus.DRAFT || status == SIVStatus.ISSUED;
    }

    /**
     * Issue the store issue voucher
     */
    public void issue() {
        if (!canBeIssued()) {
            throw new IllegalStateException("Store issue voucher cannot be issued in current status");
        }
        
        validateForIssue();
        this.status = SIVStatus.ISSUED;
        
        // Update stock levels
        updateStockLevels();
        
        // Update store requisition if linked
        if (storeRequisition != null) {
            updateStoreRequisitionStatus();
        }
    }

    /**
     * Mark as received
     */
    public void markAsReceived(User receiver, LocalDate receiptDate) {
        if (!canBeReceived()) {
            throw new IllegalStateException("Store issue voucher cannot be marked as received in current status");
        }
        
        this.status = SIVStatus.RECEIVED;
        this.receivedBy = receiver;
        this.receivedDate = receiptDate;
    }

    /**
     * Cancel the store issue voucher
     */
    public void cancel(String reason) {
        if (!canBeCancelled()) {
            throw new IllegalStateException("Store issue voucher cannot be cancelled in current status");
        }
        
        this.status = SIVStatus.CANCELLED;
        this.remarks = reason;
        
        // Reverse stock movements if already issued
        if (status == SIVStatus.ISSUED) {
            reverseStockMovements();
        }
    }

    /**
     * Return the store issue voucher
     */
    public void returnItems(String reason) {
        if (status != SIVStatus.RECEIVED) {
            throw new IllegalStateException("Only received store issue vouchers can be returned");
        }
        
        this.status = SIVStatus.RETURNED;
        this.remarks = reason;
        
        // Create return stock movements
        createReturnStockMovements();
    }

    /**
     * Calculate total cost from line items
     */
    public void calculateTotalCost() {
        this.totalCost = sivLines.stream()
            .filter(line -> line.getUnitCost() != null && line.getQuantityIssued() != null)
            .map(line -> line.getUnitCost().multiply(line.getQuantityIssued()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Add SIV line
     */
    public void addSivLine(StoreIssueVoucherLine line) {
        line.setStoreIssueVoucher(this);
        line.setLineNumber(sivLines.size() + 1);
        this.sivLines.add(line);
        calculateTotalCost();
    }

    /**
     * Remove SIV line
     */
    public void removeSivLine(StoreIssueVoucherLine line) {
        line.setStoreIssueVoucher(null);
        this.sivLines.remove(line);
        
        // Renumber remaining lines
        for (int i = 0; i < sivLines.size(); i++) {
            sivLines.get(i).setLineNumber(i + 1);
        }
        
        calculateTotalCost();
    }

    /**
     * Get total quantity issued
     */
    public BigDecimal getTotalQuantityIssued() {
        return sivLines.stream()
            .filter(line -> line.getQuantityIssued() != null)
            .map(StoreIssueVoucherLine::getQuantityIssued)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Check if all items are returnable
     */
    public boolean areAllItemsReturnable() {
        return issueType == IssueType.RETURNABLE;
    }

    /**
     * Get items by category for analysis
     */
    public List<StoreIssueVoucherLine> getLinesByCategory(String categoryCode) {
        return sivLines.stream()
            .filter(line -> line.getItem() != null && 
                           line.getItem().getCategory() != null && 
                           categoryCode.equals(line.getItem().getCategory().getCategoryCode()))
            .toList();
    }

    /**
     * Check if emergency issue
     */
    public boolean isEmergencyIssue() {
        return issueType == IssueType.EMERGENCY;
    }

    /**
     * Check if transfer issue
     */
    public boolean isTransferIssue() {
        return issueType == IssueType.TRANSFER;
    }

    /**
     * Validate for issue
     */
    private void validateForIssue() {
        if (sivLines.isEmpty()) {
            throw new IllegalStateException("Store issue voucher must have at least one line item");
        }
        
        if (receivingDepartment == null || receivingDepartment.trim().isEmpty()) {
            throw new IllegalStateException("Receiving department is required");
        }
        
        // Validate all line items have sufficient stock
        for (StoreIssueVoucherLine line : sivLines) {
            if (!line.hasSufficientStock()) {
                throw new IllegalStateException("Insufficient stock for item: " + line.getItem().getItemName());
            }
        }
    }

    /**
     * Update stock levels for all line items
     */
    private void updateStockLevels() {
        for (StoreIssueVoucherLine line : sivLines) {
            line.updateStockLevel();
        }
    }

    /**
     * Update store requisition status if linked
     */
    private void updateStoreRequisitionStatus() {
        // Mark corresponding SR lines as issued
        for (StoreIssueVoucherLine sivLine : sivLines) {
            if (sivLine.getSrLine() != null) {
                sivLine.getSrLine().issuePartialQuantity(sivLine.getQuantityIssued());
            }
        }
        
        // Check if SR is fully fulfilled
        storeRequisition.completeIssuing();
    }

    /**
     * Reverse stock movements for cancellation
     */
    private void reverseStockMovements() {
        for (StoreIssueVoucherLine line : sivLines) {
            line.reverseStockMovement();
        }
    }

    /**
     * Create return stock movements
     */
    private void createReturnStockMovements() {
        for (StoreIssueVoucherLine line : sivLines) {
            line.createReturnStockMovement();
        }
    }

    /**
     * Get cost breakdown by category
     */
    public BigDecimal getCostByCategory(String categoryCode) {
        return sivLines.stream()
            .filter(line -> line.getItem() != null && 
                           line.getItem().getCategory() != null && 
                           categoryCode.equals(line.getItem().getCategory().getCategoryCode()))
            .filter(line -> line.getUnitCost() != null && line.getQuantityIssued() != null)
            .map(line -> line.getUnitCost().multiply(line.getQuantityIssued()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Check if SIV is linked to store requisition
     */
    public boolean isLinkedToStoreRequisition() {
        return storeRequisition != null;
    }

    /**
     * Get fulfillment rate against store requisition
     */
    public BigDecimal getFulfillmentRate() {
        if (storeRequisition == null) {
            return BigDecimal.valueOf(100); // 100% if not linked to SR
        }
        
        BigDecimal totalRequested = storeRequisition.getTotalQuantityRequested();
        BigDecimal totalIssued = getTotalQuantityIssued();
        
        if (totalRequested.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        
        return totalIssued.divide(totalRequested, 4, java.math.RoundingMode.HALF_UP)
            .multiply(new BigDecimal("100"))
            .setScale(2, java.math.RoundingMode.HALF_UP);
    }
}
