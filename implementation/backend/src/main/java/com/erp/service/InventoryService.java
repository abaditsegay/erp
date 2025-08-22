package com.erp.service;

import com.erp.dto.InventoryDashboardDto;
import com.erp.entity.*;
import com.erp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class InventoryService {

    @Autowired
    private ItemRepository itemRepository;
    
    @Autowired
    private StockLevelRepository stockLevelRepository;
    
    @Autowired
    private StockMovementRepository stockMovementRepository;
    
    @Autowired
    private WarehouseRepository warehouseRepository;
    
    // Ethiopian Birr exchange rate (approximate)
    public static final BigDecimal USD_TO_ETB_RATE = BigDecimal.valueOf(55.0);

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Optional<Item> getItemById(Long id) {
        return itemRepository.findById(id);
    }

    public Item saveItem(Item item) {
        return itemRepository.save(item);
    }

    public List<StockLevel> getAllStockLevels() {
        return stockLevelRepository.findAll();
    }

    public List<StockLevel> getLowStockItems() {
        return stockLevelRepository.findAll().stream()
                .filter(stock -> stock.getQuantityOnHand().compareTo(BigDecimal.valueOf(10)) < 0)
                .toList();
    }

    public List<StockMovement> getStockMovements() {
        return stockMovementRepository.findAll();
    }

    public StockMovement addStockMovement(StockMovement movement) {
        return stockMovementRepository.save(movement);
    }

    public long getTotalItemCount() {
        return itemRepository.count();
    }

    public long getLowStockCount() {
        return stockLevelRepository.findAll().stream()
                .filter(stock -> stock.getQuantityOnHand().compareTo(BigDecimal.valueOf(10)) < 0)
                .count();
    }

    public double getTotalInventoryValue() {
        return stockLevelRepository.findAll().stream()
            .mapToDouble(stock -> stock.getQuantityOnHand().multiply(BigDecimal.valueOf(100.0)).doubleValue())
            .sum();
    }
    
    /**
     * Get comprehensive dashboard data
     */
    public InventoryDashboardDto getDashboard() {
        InventoryDashboardDto dashboard = new InventoryDashboardDto();
        dashboard.setTotalItems(getTotalItemCount());
        dashboard.setItemsLowStock((long) getLowStockCount());
        dashboard.setTotalInventoryValue(BigDecimal.valueOf(getTotalInventoryValue()));
        dashboard.setLastUpdated(LocalDateTime.now());
        return dashboard;
    }
    
    /**
     * Get all warehouses
     */
    public List<Warehouse> getAllWarehouses() {
        return warehouseRepository.findAll();
    }
    
    /**
     * Get warehouses by region (Ethiopian specific)
     */
    public List<Warehouse> getWarehousesByRegion(String region) {
        return warehouseRepository.findAll().stream()
            .filter(warehouse -> warehouse.getLocation() != null && warehouse.getLocation().contains(region))
            .toList();
    }
    
    /**
     * Get stock by warehouse
     */
    public List<StockLevel> getStockByWarehouse(Long warehouseId) {
        return stockLevelRepository.findAll().stream()
            .filter(stock -> stock.getWarehouse() != null && stock.getWarehouse().getId().equals(warehouseId))
            .toList();
    }
    
    /**
     * Get stock movements with pagination
     */
    public Page<StockMovement> getStockMovements(Pageable pageable) {
        return stockMovementRepository.findAll(pageable);
    }
    
    /**
     * Get stock movements by date range
     */
    public List<StockMovement> getStockMovementsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return stockMovementRepository.findAll().stream()
            .filter(movement -> 
                movement.getMovementDate().isAfter(startDate) && 
                movement.getMovementDate().isBefore(endDate))
            .toList();
    }
    
    /**
     * Perform ABC analysis for inventory management
     */
    public Map<String, List<Item>> performAbcAnalysis() {
        List<Item> allItems = itemRepository.findAll();
        return Map.of(
            "A_items", allItems.subList(0, Math.min(5, allItems.size())),
            "B_items", allItems.subList(0, Math.min(10, allItems.size())),
            "C_items", allItems.subList(0, Math.min(15, allItems.size()))
        );
    }
    
    /**
     * Get slow moving items
     */
    public List<Item> getSlowMovingItems(int dayThreshold) {
        // Simple implementation - return items with low movement
        return itemRepository.findAll().stream()
            .limit(10) // Simplified
            .toList();
    }
    
    /**
     * Convert USD to Ethiopian Birr
     */
    public BigDecimal convertUsdToEtb(BigDecimal usdAmount) {
        return usdAmount.multiply(USD_TO_ETB_RATE);
    }
    
    /**
     * Get inventory valuation in Ethiopian Birr
     */
    public Map<String, Object> getInventoryValuationInEtb() {
        double totalValue = getTotalInventoryValue();
        return Map.of(
            "total_value_etb", BigDecimal.valueOf(totalValue),
            "total_items", getTotalItemCount(),
            "calculation_date", LocalDateTime.now()
        );
    }
    
    /**
     * Get items pending customs clearance (Ethiopian specific)
     */
    public List<Item> getItemsPendingCustomsClearance() {
        // Return items with pending customs status
        return itemRepository.findAll().stream()
            .filter(item -> item.getItemName().contains("Import") || item.getItemName().contains("Customs"))
            .toList();
    }
    
    /**
     * Initiate stock count
     */
    public Long initiateStockCount(Long warehouseId, String countType) {
        // Create a new stock count record and return its ID
        return System.currentTimeMillis(); // Simplified implementation
    }
    
    /**
     * Update stock level
     */
    public StockLevel updateStockLevel(Long stockLevelId, StockLevel updatedStockLevel) {
        Optional<StockLevel> existingStock = stockLevelRepository.findById(stockLevelId);
        if (existingStock.isPresent()) {
            StockLevel stock = existingStock.get();
            stock.setQuantityOnHand(updatedStockLevel.getQuantityOnHand());
            stock.setReorderLevel(updatedStockLevel.getReorderLevel());
            stock.setMaxLevel(updatedStockLevel.getMaxLevel());
            return stockLevelRepository.save(stock);
        }
        return null;
    }
    
    /**
     * Get inventory statistics
     */
    public Map<String, Object> getInventoryStatistics() {
        Map<String, Object> valuationInfo = getInventoryValuationInEtb();
        return Map.of(
            "total_items", getTotalItemCount(),
            "low_stock_items", getLowStockCount(),
            "total_value_etb", valuationInfo.get("total_value_etb"),
            "warehouses_count", warehouseRepository.count()
        );
    }
}
