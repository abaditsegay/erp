package com.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for inventory dashboard statistics
 * Tailored for Ethiopian business metrics
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryDashboardDto {
    
    // Overall Metrics
    private Long totalItems;
    private Long activeItems;
    private Long inactiveItems;
    private BigDecimal totalInventoryValue;
    private BigDecimal totalInventoryValueETB; // Ethiopian Birr value
    
    // Stock Status Metrics
    private Long itemsInStock;
    private Long itemsOutOfStock;
    private Long itemsLowStock;
    private Long itemsOverStock;
    private Long itemsRequiringReorder;
    
    // Movement Metrics (Last 30 days)
    private Long totalMovements;
    private Long stockIns;
    private Long stockOuts;
    private Long adjustments;
    private Long transfers;
    
    // Warehouse Distribution
    private Long totalWarehouses;
    private Long activeWarehouses;
    private WarehouseStatsDto[] warehouseStats;
    
    // Ethiopian Specific Metrics
    private Long importedItems;      // Items from imports
    private Long localItems;         // Locally sourced items
    private Long itemsInCustoms;     // Items held in customs
    private BigDecimal customsDuties; // Outstanding customs duties
    
    // Category Breakdown
    private CategoryStatsDto[] categoryStats;
    
    // Recent Activities
    private RecentActivityDto[] recentActivities;
    
    private LocalDateTime lastUpdated;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WarehouseStatsDto {
        private Long warehouseId;
        private String warehouseName;
        private String location;
        private Long itemCount;
        private BigDecimal totalValue;
        private Double utilizationPercentage;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryStatsDto {
        private Long categoryId;
        private String categoryName;
        private Long itemCount;
        private BigDecimal totalValue;
        private Long lowStockCount;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentActivityDto {
        private String activityType;
        private String itemName;
        private String warehouseName;
        private BigDecimal quantity;
        private LocalDateTime timestamp;
        private String description;
    }
}
