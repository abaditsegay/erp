package com.erp.service;

import com.erp.entity.PurchaseRequisition;
import com.erp.entity.PurchaseRequisitionLine;
import com.erp.repository.PurchaseRequisitionRepository;
import com.erp.repository.PurchaseRequisitionLineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class PurchaseRequisitionService {

    private final PurchaseRequisitionRepository purchaseRequisitionRepository;
    private final PurchaseRequisitionLineRepository purchaseRequisitionLineRepository;

    public List<PurchaseRequisition> findAll() {
        return purchaseRequisitionRepository.findAll();
    }

    public Optional<PurchaseRequisition> findById(Long id) {
        return purchaseRequisitionRepository.findById(id);
    }

    public Optional<PurchaseRequisition> findByRequisitionNumber(String requisitionNumber) {
        return purchaseRequisitionRepository.findByPrNumber(requisitionNumber);
    }

    public List<PurchaseRequisition> findByStatus(String status) {
        try {
            PurchaseRequisition.PRStatus prStatus = PurchaseRequisition.PRStatus.valueOf(status.toUpperCase());
            return purchaseRequisitionRepository.findByStatus(prStatus);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }
    }

    public List<PurchaseRequisition> findByRequestor(Long requestorId) {
        return purchaseRequisitionRepository.findByRequestorId(requestorId);
    }

    public List<PurchaseRequisition> findByDateRange(LocalDate startDate, LocalDate endDate) {
        return purchaseRequisitionRepository.findByPrDateBetween(startDate, endDate);
    }

    public PurchaseRequisition save(PurchaseRequisition purchaseRequisition) {
        validatePurchaseRequisition(purchaseRequisition);
        
        // Generate requisition number if not provided
        if (purchaseRequisition.getPrNumber() == null || purchaseRequisition.getPrNumber().isEmpty()) {
            purchaseRequisition.setPrNumber(generateRequisitionNumber());
        }
        
        return purchaseRequisitionRepository.save(purchaseRequisition);
    }

    public PurchaseRequisition update(Long id, PurchaseRequisition purchaseRequisition) {
        Optional<PurchaseRequisition> existing = purchaseRequisitionRepository.findById(id);
        if (existing.isEmpty()) {
            throw new RuntimeException("Purchase Requisition not found with id: " + id);
        }
        
        purchaseRequisition.setId(id);
        validatePurchaseRequisition(purchaseRequisition);
        return purchaseRequisitionRepository.save(purchaseRequisition);
    }

    public PurchaseRequisition submitForApproval(Long id) {
        Optional<PurchaseRequisition> requisition = purchaseRequisitionRepository.findById(id);
        if (requisition.isEmpty()) {
            throw new RuntimeException("Purchase Requisition not found with id: " + id);
        }
        
        PurchaseRequisition pr = requisition.get();
        if (PurchaseRequisition.PRStatus.DRAFT != pr.getStatus()) {
            throw new RuntimeException("Only draft requisitions can be submitted for approval");
        }
        
        pr.setStatus(PurchaseRequisition.PRStatus.SUBMITTED);
        return purchaseRequisitionRepository.save(pr);
    }

    public PurchaseRequisition approve(Long id, Long approverId) {
        Optional<PurchaseRequisition> requisition = purchaseRequisitionRepository.findById(id);
        if (requisition.isEmpty()) {
            throw new RuntimeException("Purchase Requisition not found with id: " + id);
        }
        
        PurchaseRequisition pr = requisition.get();
        if (PurchaseRequisition.PRStatus.SUBMITTED != pr.getStatus()) {
            throw new RuntimeException("Only submitted requisitions can be approved");
        }
        
        pr.setStatus(PurchaseRequisition.PRStatus.APPROVED);
        pr.setApprovedDate(LocalDate.now());
        // Note: You'll need to load the User entity for approvedBy
        // pr.setApprovedBy(userService.findById(approverId));
        
        return purchaseRequisitionRepository.save(pr);
    }

    public PurchaseRequisition reject(Long id, String rejectionReason) {
        Optional<PurchaseRequisition> requisition = purchaseRequisitionRepository.findById(id);
        if (requisition.isEmpty()) {
            throw new RuntimeException("Purchase Requisition not found with id: " + id);
        }
        
        PurchaseRequisition pr = requisition.get();
        if (PurchaseRequisition.PRStatus.SUBMITTED != pr.getStatus()) {
            throw new RuntimeException("Only submitted requisitions can be rejected");
        }
        
        pr.setStatus(PurchaseRequisition.PRStatus.REJECTED);
        pr.setApprovalComments(rejectionReason);
        return purchaseRequisitionRepository.save(pr);
    }

    public void deleteById(Long id) {
        Optional<PurchaseRequisition> requisition = purchaseRequisitionRepository.findById(id);
        if (requisition.isEmpty()) {
            throw new RuntimeException("Purchase Requisition not found with id: " + id);
        }
        
        if (PurchaseRequisition.PRStatus.DRAFT != requisition.get().getStatus()) {
            throw new RuntimeException("Only draft requisitions can be deleted");
        }
        
        purchaseRequisitionRepository.deleteById(id);
    }

    public List<PurchaseRequisitionLine> findLinesByRequisition(Long requisitionId) {
        return purchaseRequisitionLineRepository.findByPurchaseRequisitionId(requisitionId);
    }

    private void validatePurchaseRequisition(PurchaseRequisition requisition) {
        if (requisition.getRequestedBy() == null) {
            throw new RuntimeException("Requestor is required");
        }
        
        if (requisition.getPrDate() == null) {
            throw new RuntimeException("Requisition date is required");
        }
        
        if (requisition.getJustification() == null || requisition.getJustification().trim().isEmpty()) {
            throw new RuntimeException("Justification is required");
        }
    }

    private String generateRequisitionNumber() {
        String prefix = "PR";
        String dateStr = LocalDate.now().toString().replace("-", "");
        long count = purchaseRequisitionRepository.count() + 1;
        return String.format("%s%s%04d", prefix, dateStr, count);
    }
}
