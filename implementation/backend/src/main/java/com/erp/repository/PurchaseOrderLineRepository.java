package com.erp.repository;

import com.erp.entity.PurchaseOrderLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseOrderLineRepository extends JpaRepository<PurchaseOrderLine, Long> {
    
    List<PurchaseOrderLine> findByPurchaseOrderId(Long purchaseOrderId);
    
    List<PurchaseOrderLine> findByItemId(Long itemId);
    
    List<PurchaseOrderLine> findByPurchaseOrderIdAndItemId(Long purchaseOrderId, Long itemId);
}
