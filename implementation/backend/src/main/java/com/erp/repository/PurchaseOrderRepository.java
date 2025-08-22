package com.erp.repository;

import com.erp.entity.PurchaseOrder;
import com.erp.entity.PurchaseOrder.POStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    
    Optional<PurchaseOrder> findByPoNumber(String poNumber);
    
    List<PurchaseOrder> findByStatus(POStatus status);
    
    @Query("SELECT po FROM PurchaseOrder po WHERE po.supplier.id = :supplierId")
    List<PurchaseOrder> findBySupplierId(@Param("supplierId") Long supplierId);
    
    List<PurchaseOrder> findByPoDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT po FROM PurchaseOrder po WHERE po.status = :status AND po.supplier.id = :supplierId")
    List<PurchaseOrder> findByStatusAndSupplierId(@Param("status") POStatus status, @Param("supplierId") Long supplierId);
    
    @Query("SELECT po FROM PurchaseOrder po JOIN po.poLines pol WHERE pol.prLine.purchaseRequisition.id = :purchaseRequisitionId")
    List<PurchaseOrder> findByPurchaseRequisitionId(@Param("purchaseRequisitionId") Long purchaseRequisitionId);
    
    boolean existsByPoNumber(String poNumber);
}
