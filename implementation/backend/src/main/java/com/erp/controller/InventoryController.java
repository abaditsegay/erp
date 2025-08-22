package com.erp.controller;

import com.erp.dto.InventoryDashboardDto;
import com.erp.entity.Item;
import com.erp.entity.StockLevel;
import com.erp.entity.StockMovement;
import com.erp.entity.Warehouse;
import com.erp.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Ethiopian-focused Inventory Management Controller
 * Handles inventory operations with Ethiopian business practices
 */
@Slf4j
@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InventoryController {

    private final InventoryService inventoryService;

    /**
     * Get comprehensive inventory dashboard for Ethiopian operations
     */
    @GetMapping("/dashboard")
    public ResponseEntity<InventoryDashboardDto> getDashboard() {
        log.info("Fetching Ethiopian inventory dashboard");
        InventoryDashboardDto dashboard = inventoryService.getDashboard();
        return ResponseEntity.ok(dashboard);
    }

    /**
     * Get all warehouses with Ethiopian regional support
     */
    @GetMapping("/warehouses")
    public ResponseEntity<List<Warehouse>> getAllWarehouses() {
        log.info("Fetching all warehouses");
        List<Warehouse> warehouses = inventoryService.getAllWarehouses();
        return ResponseEntity.ok(warehouses);
    }

    /**
     * Get warehouse by region (Ethiopian regions)
     */
    @GetMapping("/warehouses/region/{region}")
    public ResponseEntity<List<Warehouse>> getWarehousesByRegion(@PathVariable String region) {
        log.info("Fetching warehouses in region: {}", region);
        List<Warehouse> warehouses = inventoryService.getWarehousesByRegion(region);
        return ResponseEntity.ok(warehouses);
    }

    /**
     * Get stock levels for a specific warehouse
     */
    @GetMapping("/warehouses/{warehouseId}/stock")
    public ResponseEntity<List<StockLevel>> getWarehouseStock(@PathVariable Long warehouseId) {
        log.info("Fetching stock for warehouse: {}", warehouseId);
        List<StockLevel> stockLevels = inventoryService.getStockByWarehouse(warehouseId);
        return ResponseEntity.ok(stockLevels);
    }

    /**
     * Get all stock movements with pagination
     */
    @GetMapping("/movements")
    public ResponseEntity<Page<StockMovement>> getStockMovements(Pageable pageable) {
        log.info("Fetching stock movements with pagination: {}", pageable);
        Page<StockMovement> movements = inventoryService.getStockMovements(pageable);
        return ResponseEntity.ok(movements);
    }

    /**
     * Get stock movements for date range
     */
    @GetMapping("/movements/date-range")
    public ResponseEntity<List<StockMovement>> getStockMovementsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        log.info("Fetching stock movements from {} to {}", startDate, endDate);
        
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        List<StockMovement> movements = inventoryService.getStockMovementsByDateRange(startDateTime, endDateTime);
        return ResponseEntity.ok(movements);
    }

    /**
     * Get low stock items requiring attention
     */
    @GetMapping("/low-stock")
    public ResponseEntity<List<StockLevel>> getLowStockItems() {
        log.info("Fetching low stock items");
        List<StockLevel> lowStockItems = inventoryService.getLowStockItems();
        return ResponseEntity.ok(lowStockItems);
    }

    /**
     * Get ABC analysis for inventory optimization
     */
    @GetMapping("/abc-analysis")
    public ResponseEntity<Map<String, List<Item>>> getAbcAnalysis() {
        log.info("Performing ABC analysis");
        Map<String, List<Item>> abcAnalysis = inventoryService.performAbcAnalysis();
        return ResponseEntity.ok(abcAnalysis);
    }

    /**
     * Get slow-moving items for Ethiopian market
     */
    @GetMapping("/slow-moving")
    public ResponseEntity<List<Item>> getSlowMovingItems(@RequestParam(defaultValue = "90") int days) {
        log.info("Fetching slow-moving items for {} days", days);
        List<Item> slowMovingItems = inventoryService.getSlowMovingItems(days);
        return ResponseEntity.ok(slowMovingItems);
    }

    /**
     * Convert USD amounts to Ethiopian Birr
     */
    @GetMapping("/currency/usd-to-etb")
    public ResponseEntity<Map<String, Object>> convertUsdToEtb(@RequestParam BigDecimal usdAmount) {
        log.info("Converting USD {} to ETB", usdAmount);
        BigDecimal etbAmount = inventoryService.convertUsdToEtb(usdAmount);
        
        Map<String, Object> result = Map.of(
            "usdAmount", usdAmount,
            "etbAmount", etbAmount,
            "exchangeRate", InventoryService.USD_TO_ETB_RATE,
            "timestamp", LocalDateTime.now()
        );
        
        return ResponseEntity.ok(result);
    }

    /**
     * Get inventory valuation in ETB
     */
    @GetMapping("/valuation/etb")
    public ResponseEntity<Map<String, Object>> getInventoryValuationInEtb() {
        log.info("Calculating inventory valuation in ETB");
        Map<String, Object> valuation = inventoryService.getInventoryValuationInEtb();
        return ResponseEntity.ok(valuation);
    }

    /**
     * Get customs clearance items
     */
    @GetMapping("/customs/pending")
    public ResponseEntity<List<Item>> getPendingCustomsItems() {
        log.info("Fetching items pending customs clearance");
        List<Item> pendingItems = inventoryService.getItemsPendingCustomsClearance();
        return ResponseEntity.ok(pendingItems);
    }

    /**
     * Initiate stock count for a warehouse
     */
    @PostMapping("/stock-count/initiate")
    public ResponseEntity<Map<String, Object>> initiateStockCount(
            @RequestParam Long warehouseId,
            @RequestParam String countType) {
        log.info("Initiating {} stock count for warehouse: {}", countType, warehouseId);
        
        try {
            inventoryService.initiateStockCount(warehouseId, countType);
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Stock count initiated successfully",
                "warehouseId", warehouseId,
                "countType", countType,
                "timestamp", LocalDateTime.now()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error initiating stock count: {}", e.getMessage());
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to initiate stock count: " + e.getMessage(),
                "timestamp", LocalDateTime.now()
            );
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Update stock level
     */
    @PutMapping("/stock/{stockId}")
    public ResponseEntity<StockLevel> updateStockLevel(
            @PathVariable Long stockId,
            @RequestBody StockLevel stockLevel) {
        log.info("Updating stock level: {}", stockId);
        StockLevel updatedStock = inventoryService.updateStockLevel(stockId, stockLevel);
        return ResponseEntity.ok(updatedStock);
    }

    /**
     * Add stock movement
     */
    @PostMapping("/movements")
    public ResponseEntity<StockMovement> addStockMovement(@RequestBody StockMovement stockMovement) {
        log.info("Adding stock movement for item: {}", stockMovement.getItem().getId());
        StockMovement savedMovement = inventoryService.addStockMovement(stockMovement);
        return ResponseEntity.ok(savedMovement);
    }

    /**
     * Get inventory statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getInventoryStatistics() {
        log.info("Fetching inventory statistics");
        Map<String, Object> statistics = inventoryService.getInventoryStatistics();
        return ResponseEntity.ok(statistics);
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = Map.of(
            "status", "UP",
            "service", "Ethiopian Inventory Management",
            "timestamp", LocalDateTime.now(),
            "version", "1.0.0"
        );
        return ResponseEntity.ok(health);
    }
}
