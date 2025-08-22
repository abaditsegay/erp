package com.erp.repository;

import com.erp.entity.GoodsReceivedVoucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface GoodsReceivedVoucherRepository extends JpaRepository<GoodsReceivedVoucher, Long> {
    
    Optional<GoodsReceivedVoucher> findByGrvNumber(String grvNumber);
    
    List<GoodsReceivedVoucher> findByPurchaseOrderId(Long purchaseOrderId);
    
    List<GoodsReceivedVoucher> findByStatus(String status);
    
    List<GoodsReceivedVoucher> findByReceivedDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<GoodsReceivedVoucher> findBySupplierId(Long supplierId);
    
    boolean existsByGrvNumber(String grvNumber);
}
