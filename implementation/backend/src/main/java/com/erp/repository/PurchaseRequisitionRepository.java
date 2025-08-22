package com.erp.repository;

import com.erp.entity.PurchaseRequisition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseRequisitionRepository extends JpaRepository<PurchaseRequisition, Long> {
    
    Optional<PurchaseRequisition> findByPrNumber(String prNumber);
    
    List<PurchaseRequisition> findByStatus(PurchaseRequisition.PRStatus status);
    
    @Query("SELECT pr FROM PurchaseRequisition pr WHERE pr.requestedBy.id = :requestorId")
    List<PurchaseRequisition> findByRequestorId(@Param("requestorId") Long requestorId);
    
    @Query("SELECT pr FROM PurchaseRequisition pr WHERE pr.approvedBy.id = :approverId")
    List<PurchaseRequisition> findByApproverId(@Param("approverId") Long approverId);
    
    List<PurchaseRequisition> findByPrDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<PurchaseRequisition> findByDepartment(String department);
    
    @Query("SELECT pr FROM PurchaseRequisition pr WHERE pr.status = :status AND pr.requestedBy.id = :requestorId")
    List<PurchaseRequisition> findByStatusAndRequestorId(@Param("status") PurchaseRequisition.PRStatus status, @Param("requestorId") Long requestorId);
    
    boolean existsByPrNumber(String prNumber);
    
    @Query("SELECT COUNT(pr) FROM PurchaseRequisition pr WHERE pr.status = :status")
    long countByStatus(@Param("status") PurchaseRequisition.PRStatus status);
}
