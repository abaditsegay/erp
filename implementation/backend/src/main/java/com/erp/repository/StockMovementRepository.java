package com.erp.repository;

import com.erp.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    
    List<StockMovement> findByItemIdOrderByMovementDateDesc(Long itemId);
    
    List<StockMovement> findByMovementDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<StockMovement> findByMovementTypeOrderByMovementDateDesc(String movementType);
    
    List<StockMovement> findByItemIdAndMovementDateBetween(Long itemId, LocalDateTime startDate, LocalDateTime endDate);
}
