package com.erp.repository;

import com.erp.entity.PurchaseRequisitionLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseRequisitionLineRepository extends JpaRepository<PurchaseRequisitionLine, Long> {
    
    List<PurchaseRequisitionLine> findByPurchaseRequisitionId(Long purchaseRequisitionId);
    
    List<PurchaseRequisitionLine> findByItemId(Long itemId);
    
    List<PurchaseRequisitionLine> findByPurchaseRequisitionIdAndItemId(Long purchaseRequisitionId, Long itemId);
}
