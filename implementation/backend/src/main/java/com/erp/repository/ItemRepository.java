package com.erp.repository;

import com.erp.entity.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Item entity operations
 */
@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    /**
     * Find item by code (case-insensitive)
     */
    Optional<Item> findByItemCodeIgnoreCase(String itemCode);

    /**
     * Check if item code exists (case-insensitive)
     */
    boolean existsByItemCodeIgnoreCase(String itemCode);

    /**
     * Find all active items
     */
    List<Item> findByIsActiveTrueOrderByItemNameAsc();

    /**
     * Find active items by page
     */
    Page<Item> findByIsActiveTrue(Pageable pageable);

    /**
     * Count active items
     */
    long countByIsActiveTrue();

    /**
     * Find items by category ID
     */
    List<Item> findByCategoryIdAndIsActiveTrue(Long categoryId);

    /**
     * Find items by category ID with pagination
     */
    Page<Item> findByCategoryIdAndIsActiveTrue(Long categoryId, Pageable pageable);

    /**
     * Find items by type
     */
    List<Item> findByItemTypeAndIsActiveTrue(Item.ItemType itemType);

    /**
     * Search items by name or code
     */
    List<Item> findByItemNameContainingIgnoreCaseOrItemCodeContainingIgnoreCaseAndIsActiveTrue(
        String nameSearch, String codeSearch);

    /**
     * Find items with low stock (below reorder level)
     */
    List<Item> findByIsActiveTrueAndMinStockLevelIsNotNull();

    /**
     * Find items requiring reorder based on stock levels
     */
    @Query("SELECT DISTINCT i FROM Item i " +
           "JOIN StockLevel sl ON sl.item.id = i.id " +
           "WHERE i.isActive = true " +
           "AND sl.availableQuantity <= i.reorderLevel")
    List<Item> findItemsRequiringReorder();

    /**
     * Find items by standard cost range
     */
    List<Item> findByIsActiveTrueOrderByStandardCostDesc();

    /**
     * Find slow moving items (no stock movements in specified period)
     */
    @Query("SELECT i FROM Item i WHERE i.isActive = true " +
           "AND i.id NOT IN (" +
           "  SELECT DISTINCT sm.item.id FROM StockMovement sm " +
           "  WHERE sm.movementDate >= :cutoffDate" +
           ")")
    List<Item> findSlowMovingItems(@Param("cutoffDate") LocalDateTime cutoffDate);
}
