package com.erp.repository;

import com.erp.entity.StoreIssueVoucher;
import com.erp.entity.StoreIssueVoucher.SIVStatus;
import com.erp.entity.StoreIssueVoucher.IssueType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StoreIssueVoucherRepository extends JpaRepository<StoreIssueVoucher, Long> {
    
    Optional<StoreIssueVoucher> findBySivNumber(String sivNumber);
    
    @Query("SELECT siv FROM StoreIssueVoucher siv WHERE siv.storeRequisition.id = :storeRequisitionId")
    List<StoreIssueVoucher> findByStoreRequisitionId(@Param("storeRequisitionId") Long storeRequisitionId);
    
    List<StoreIssueVoucher> findByIssueType(IssueType issueType);
    
    List<StoreIssueVoucher> findByStatus(SIVStatus status);
    
    @Query("SELECT siv FROM StoreIssueVoucher siv WHERE siv.issuedBy.id = :issuedById")
    List<StoreIssueVoucher> findByIssuedById(@Param("issuedById") Long issuedById);
    
    List<StoreIssueVoucher> findBySivDateBetween(LocalDate startDate, LocalDate endDate);
    
    boolean existsBySivNumber(String sivNumber);
}
