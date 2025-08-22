package com.erp.repository;

import com.erp.entity.StoreRequisition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StoreRequisitionRepository extends JpaRepository<StoreRequisition, Long> {
    
    Optional<StoreRequisition> findBySrNumber(String srNumber);
    
    List<StoreRequisition> findByStatus(StoreRequisition.SRStatus status);
    
    @Query("SELECT sr FROM StoreRequisition sr WHERE sr.requestedBy.id = :requestorId")
    List<StoreRequisition> findByRequestorId(@Param("requestorId") Long requestorId);
    
    List<StoreRequisition> findByRequestingDepartment(String department);
    
    List<StoreRequisition> findBySrDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT sr FROM StoreRequisition sr WHERE sr.status = :status AND sr.requestedBy.id = :requestorId")
    List<StoreRequisition> findByStatusAndRequestorId(@Param("status") StoreRequisition.SRStatus status, @Param("requestorId") Long requestorId);
    
    boolean existsBySrNumber(String srNumber);
    
    List<StoreRequisition> findByPriority(StoreRequisition.Priority priority);
    
    @Query("SELECT sr FROM StoreRequisition sr WHERE sr.approvedBy.id = :approverId")
    List<StoreRequisition> findByApproverId(@Param("approverId") Long approverId);
}
