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
 * Goods Received Voucher (GRV) Entity
 * Represents the receipt of goods against Purchase Orders
 * Part of Phase 2 - Core Business Modules
 */
@Entity
@Table(name = "goods_received_vouchers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class GoodsReceivedVoucher extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "grv_number", nullable = false, unique = true, length = 20)
    private String grvNumber;

    @Column(name = "grv_date", nullable = false)
    private LocalDate grvDate;

    @Column(name = "received_date", nullable = false)
    private LocalDate receivedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "po_id", nullable = false)
    private PurchaseOrder purchaseOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "received_by", nullable = false)
    private User receivedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private GRVStatus status = GRVStatus.DRAFT;

    @Column(name = "delivery_note_number", length = 50)
    private String deliveryNoteNumber;

    @Column(name = "invoice_number", length = 50)
    private String invoiceNumber;

    @Column(name = "vehicle_number", length = 20)
    private String vehicleNumber;

    @Column(name = "driver_name", length = 100)
    private String driverName;

    @Column(name = "total_amount", precision = 18, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "inspection_required")
    private Boolean inspectionRequired = false;

    @Column(name = "inspection_completed")
    private Boolean inspectionCompleted = false;

    @Column(name = "inspection_date")
    private LocalDate inspectionDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inspected_by")
    private User inspectedBy;

    @Column(name = "location", length = 50)
    private String location;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "inspection_notes", columnDefinition = "TEXT")
    private String inspectionNotes;

    @OneToMany(mappedBy = "grv", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<GoodsReceivedVoucherLine> grvLines = new ArrayList<>();

    // Enums
    public enum GRVStatus {
        DRAFT,
        SUBMITTED,
        INSPECTION_PENDING,
        INSPECTION_IN_PROGRESS,
        INSPECTION_COMPLETED,
        ACCEPTED,
        PARTIALLY_ACCEPTED,
        REJECTED,
        PROCESSED
    }

    // Business Logic Methods

    /**
     * Check if the GRV can be edited
     */
    public boolean isEditable() {
        return status == GRVStatus.DRAFT || status == GRVStatus.SUBMITTED;
    }

    /**
     * Check if inspection is pending
     */
    public boolean isInspectionPending() {
        return inspectionRequired && !inspectionCompleted;
    }

    /**
     * Check if GRV can be processed
     */
    public boolean canBeProcessed() {
        if (inspectionRequired) {
            return inspectionCompleted && (status == GRVStatus.ACCEPTED || status == GRVStatus.PARTIALLY_ACCEPTED);
        }
        return status == GRVStatus.ACCEPTED || status == GRVStatus.PARTIALLY_ACCEPTED;
    }

    /**
     * Start inspection process
     */
    public void startInspection(User inspector) {
        if (!inspectionRequired) {
            throw new IllegalStateException("Inspection not required for this GRV");
        }
        if (status != GRVStatus.INSPECTION_PENDING) {
            throw new IllegalStateException("GRV must be in INSPECTION_PENDING status to start inspection");
        }
        
        this.status = GRVStatus.INSPECTION_IN_PROGRESS;
        this.inspectedBy = inspector;
        this.inspectionDate = LocalDate.now();
    }

    /**
     * Complete inspection
     */
    public void completeInspection(boolean accepted, String notes) {
        if (status != GRVStatus.INSPECTION_IN_PROGRESS) {
            throw new IllegalStateException("GRV must be in INSPECTION_IN_PROGRESS status to complete inspection");
        }
        
        this.inspectionCompleted = true;
        this.inspectionNotes = notes;
        this.status = GRVStatus.INSPECTION_COMPLETED;
        
        // Auto-determine acceptance based on line items
        updateAcceptanceStatus();
    }

    /**
     * Accept the GRV
     */
    public void accept() {
        if (inspectionRequired && !inspectionCompleted) {
            throw new IllegalStateException("Inspection must be completed before accepting");
        }
        
        this.status = GRVStatus.ACCEPTED;
    }

    /**
     * Partially accept the GRV
     */
    public void partiallyAccept() {
        if (inspectionRequired && !inspectionCompleted) {
            throw new IllegalStateException("Inspection must be completed before accepting");
        }
        
        this.status = GRVStatus.PARTIALLY_ACCEPTED;
    }

    /**
     * Reject the GRV
     */
    public void reject(String reason) {
        this.status = GRVStatus.REJECTED;
        this.remarks = reason;
    }

    /**
     * Process the GRV (update stock, close PO lines)
     */
    public void process() {
        if (!canBeProcessed()) {
            throw new IllegalStateException("GRV cannot be processed in current status");
        }
        
        this.status = GRVStatus.PROCESSED;
    }

    /**
     * Calculate total amount from line items
     */
    public void calculateTotalAmount() {
        this.totalAmount = grvLines.stream()
            .filter(line -> line.getAcceptedQuantity() != null && line.getUnitCost() != null)
            .map(line -> line.getUnitCost().multiply(line.getAcceptedQuantity()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Update acceptance status based on line items
     */
    private void updateAcceptanceStatus() {
        boolean hasAcceptedItems = grvLines.stream()
            .anyMatch(line -> line.getAcceptedQuantity() != null && 
                             line.getAcceptedQuantity().compareTo(BigDecimal.ZERO) > 0);
        
        boolean hasRejectedItems = grvLines.stream()
            .anyMatch(line -> line.getRejectedQuantity() != null && 
                             line.getRejectedQuantity().compareTo(BigDecimal.ZERO) > 0);
        
        if (hasAcceptedItems && hasRejectedItems) {
            this.status = GRVStatus.PARTIALLY_ACCEPTED;
        } else if (hasAcceptedItems) {
            this.status = GRVStatus.ACCEPTED;
        } else {
            this.status = GRVStatus.REJECTED;
        }
    }

    /**
     * Add GRV line
     */
    public void addGrvLine(GoodsReceivedVoucherLine line) {
        line.setGrv(this);
        this.grvLines.add(line);
    }

    /**
     * Remove GRV line
     */
    public void removeGrvLine(GoodsReceivedVoucherLine line) {
        line.setGrv(null);
        this.grvLines.remove(line);
    }

    /**
     * Get total quantity received
     */
    public BigDecimal getTotalQuantityReceived() {
        return grvLines.stream()
            .filter(line -> line.getQuantityReceived() != null)
            .map(GoodsReceivedVoucherLine::getQuantityReceived)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Get total quantity accepted
     */
    public BigDecimal getTotalQuantityAccepted() {
        return grvLines.stream()
            .filter(line -> line.getAcceptedQuantity() != null)
            .map(GoodsReceivedVoucherLine::getAcceptedQuantity)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Get total quantity rejected
     */
    public BigDecimal getTotalQuantityRejected() {
        return grvLines.stream()
            .filter(line -> line.getRejectedQuantity() != null)
            .map(GoodsReceivedVoucherLine::getRejectedQuantity)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Check if all PO lines are fully received
     */
    public boolean isPoFullyReceived() {
        return grvLines.stream()
            .allMatch(line -> line.getPoLine() != null && 
                             line.getPoLine().isFullyReceived());
    }
}
