package com.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "purchase_requisitions")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class PurchaseRequisition extends BaseEntity {

    @Column(name = "pr_number", unique = true, nullable = false, length = 20)
    private String prNumber;

    @Column(name = "pr_date", nullable = false)
    private LocalDate prDate;

    @Column(name = "required_date")
    private LocalDate requiredDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_by", nullable = false)
    private User requestedBy;

    @Column(name = "department", length = 50)
    private String department;

    @Column(name = "justification", columnDefinition = "TEXT")
    private String justification;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private PRStatus status = PRStatus.DRAFT;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", length = 10)
    private Priority priority = Priority.MEDIUM;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Column(name = "approved_date")
    private LocalDate approvedDate;

    @Column(name = "approval_comments", columnDefinition = "TEXT")
    private String approvalComments;

    @Column(name = "total_estimated_cost", precision = 18, scale = 2)
    private java.math.BigDecimal totalEstimatedCost;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @OneToMany(mappedBy = "purchaseRequisition", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PurchaseRequisitionLine> prLines;

    public enum PRStatus {
        DRAFT,
        SUBMITTED,
        UNDER_REVIEW,
        APPROVED,
        REJECTED,
        PARTIALLY_ORDERED,
        FULLY_ORDERED,
        CANCELLED
    }

    public enum Priority {
        LOW,
        MEDIUM,
        HIGH,
        URGENT
    }

    // Utility methods
    public boolean isEditable() {
        return status == PRStatus.DRAFT || status == PRStatus.REJECTED;
    }

    public boolean canBeApproved() {
        return status == PRStatus.SUBMITTED || status == PRStatus.UNDER_REVIEW;
    }

    public boolean canCreatePO() {
        return status == PRStatus.APPROVED || status == PRStatus.PARTIALLY_ORDERED;
    }
}
