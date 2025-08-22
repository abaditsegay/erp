package com.erp.repository;

import com.erp.entity.StockLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface StockLevelRepository extends JpaRepository<StockLevel, Long> {
    
    @Query("SELECT sl FROM StockLevel sl WHERE sl.item.id = :itemId")
    Optional<StockLevel> findByItemId(@Param("itemId") Long itemId);
    
    @Query("SELECT sl FROM StockLevel sl WHERE sl.item.id = :itemId AND sl.location = :location")
    Optional<StockLevel> findByItemIdAndLocation(@Param("itemId") Long itemId, @Param("location") String location);
    
    List<StockLevel> findByQuantityOnHandLessThan(BigDecimal quantity);
    
    List<StockLevel> findByAvailableQuantityLessThan(BigDecimal quantity);
    
    @Query("SELECT sl FROM StockLevel sl WHERE sl.item.id IN :itemIds")
    List<StockLevel> findByItemIdIn(@Param("itemIds") List<Long> itemIds);
    
    List<StockLevel> findByQuantityOnHandBetween(BigDecimal minQuantity, BigDecimal maxQuantity);
    
    List<StockLevel> findByAvailableQuantityBetween(BigDecimal minQuantity, BigDecimal maxQuantity);
    
    @Query("SELECT sl FROM StockLevel sl WHERE sl.availableQuantity <= sl.reorderLevel")
    List<StockLevel> findItemsBelowReorderLevel();
    
    List<StockLevel> findByLocation(String location);
    
    // Additional methods for Ethiopian inventory management
    long countByAvailableQuantityLessThanEqual(BigDecimal quantity);
    
    long countByAvailableQuantityGreaterThan(BigDecimal quantity);
    
    /**
     * Find stock levels by warehouse
     */
    @Query("SELECT sl FROM StockLevel sl WHERE sl.warehouse.id = :warehouseId")
    List<StockLevel> findByWarehouseId(@Param("warehouseId") Long warehouseId);
    
    /**
     * Find low stock items across all locations
     */
    @Query("SELECT sl FROM StockLevel sl " +
           "WHERE sl.availableQuantity <= sl.reorderLevel " +
           "AND sl.reorderLevel IS NOT NULL")
    List<StockLevel> findLowStockItems();
}
