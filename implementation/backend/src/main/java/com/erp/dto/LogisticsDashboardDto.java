package com.erp.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for logistics dashboard data
 */
public class LogisticsDashboardDto {
    
    private Long totalShipments;
    private Long deliveredShipments;
    private Long inTransitShipments;
    private Long delayedShipments;
    private Double onTimeDeliveryPercentage;
    private Double averageProcessingTimeDays;
    private BigDecimal totalShipmentValue;
    private String currency;
    private LocalDateTime lastUpdated;
    
    private List<ShipmentStatusData> statusDistribution;
    private List<MonthlyShipmentData> monthlyTrends;
    private List<TopDestinationData> topDestinations;
    private List<WarehouseUtilizationData> warehouseUtilization;
    private List<CustomsClearanceData> customsPerformance;
    
    // Constructors
    public LogisticsDashboardDto() {}
    
    // Getters and Setters
    public Long getTotalShipments() { return totalShipments; }
    public void setTotalShipments(Long totalShipments) { this.totalShipments = totalShipments; }
    
    public Long getDeliveredShipments() { return deliveredShipments; }
    public void setDeliveredShipments(Long deliveredShipments) { this.deliveredShipments = deliveredShipments; }
    
    public Long getInTransitShipments() { return inTransitShipments; }
    public void setInTransitShipments(Long inTransitShipments) { this.inTransitShipments = inTransitShipments; }
    
    public Long getDelayedShipments() { return delayedShipments; }
    public void setDelayedShipments(Long delayedShipments) { this.delayedShipments = delayedShipments; }
    
    public Double getOnTimeDeliveryPercentage() { return onTimeDeliveryPercentage; }
    public void setOnTimeDeliveryPercentage(Double onTimeDeliveryPercentage) { this.onTimeDeliveryPercentage = onTimeDeliveryPercentage; }
    
    public Double getAverageProcessingTimeDays() { return averageProcessingTimeDays; }
    public void setAverageProcessingTimeDays(Double averageProcessingTimeDays) { this.averageProcessingTimeDays = averageProcessingTimeDays; }
    
    public BigDecimal getTotalShipmentValue() { return totalShipmentValue; }
    public void setTotalShipmentValue(BigDecimal totalShipmentValue) { this.totalShipmentValue = totalShipmentValue; }
    
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    
    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
    
    public List<ShipmentStatusData> getStatusDistribution() { return statusDistribution; }
    public void setStatusDistribution(List<ShipmentStatusData> statusDistribution) { this.statusDistribution = statusDistribution; }
    
    public List<MonthlyShipmentData> getMonthlyTrends() { return monthlyTrends; }
    public void setMonthlyTrends(List<MonthlyShipmentData> monthlyTrends) { this.monthlyTrends = monthlyTrends; }
    
    public List<TopDestinationData> getTopDestinations() { return topDestinations; }
    public void setTopDestinations(List<TopDestinationData> topDestinations) { this.topDestinations = topDestinations; }
    
    public List<WarehouseUtilizationData> getWarehouseUtilization() { return warehouseUtilization; }
    public void setWarehouseUtilization(List<WarehouseUtilizationData> warehouseUtilization) { this.warehouseUtilization = warehouseUtilization; }
    
    public List<CustomsClearanceData> getCustomsPerformance() { return customsPerformance; }
    public void setCustomsPerformance(List<CustomsClearanceData> customsPerformance) { this.customsPerformance = customsPerformance; }
    
    // Nested DTOs
    public static class ShipmentStatusData {
        private String status;
        private Long count;
        private Double percentage;
        private String color;
        
        public ShipmentStatusData() {}
        
        public ShipmentStatusData(String status, Long count, Double percentage, String color) {
            this.status = status;
            this.count = count;
            this.percentage = percentage;
            this.color = color;
        }
        
        // Getters and Setters
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        
        public Long getCount() { return count; }
        public void setCount(Long count) { this.count = count; }
        
        public Double getPercentage() { return percentage; }
        public void setPercentage(Double percentage) { this.percentage = percentage; }
        
        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
    }
    
    public static class MonthlyShipmentData {
        private String month;
        private Integer year;
        private Long shipmentCount;
        private BigDecimal totalValue;
        
        public MonthlyShipmentData() {}
        
        public MonthlyShipmentData(String month, Integer year, Long shipmentCount, BigDecimal totalValue) {
            this.month = month;
            this.year = year;
            this.shipmentCount = shipmentCount;
            this.totalValue = totalValue;
        }
        
        // Getters and Setters
        public String getMonth() { return month; }
        public void setMonth(String month) { this.month = month; }
        
        public Integer getYear() { return year; }
        public void setYear(Integer year) { this.year = year; }
        
        public Long getShipmentCount() { return shipmentCount; }
        public void setShipmentCount(Long shipmentCount) { this.shipmentCount = shipmentCount; }
        
        public BigDecimal getTotalValue() { return totalValue; }
        public void setTotalValue(BigDecimal totalValue) { this.totalValue = totalValue; }
    }
    
    public static class TopDestinationData {
        private String destination;
        private Long shipmentCount;
        private Double percentage;
        private String trend;
        
        public TopDestinationData() {}
        
        public TopDestinationData(String destination, Long shipmentCount, Double percentage, String trend) {
            this.destination = destination;
            this.shipmentCount = shipmentCount;
            this.percentage = percentage;
            this.trend = trend;
        }
        
        // Getters and Setters
        public String getDestination() { return destination; }
        public void setDestination(String destination) { this.destination = destination; }
        
        public Long getShipmentCount() { return shipmentCount; }
        public void setShipmentCount(Long shipmentCount) { this.shipmentCount = shipmentCount; }
        
        public Double getPercentage() { return percentage; }
        public void setPercentage(Double percentage) { this.percentage = percentage; }
        
        public String getTrend() { return trend; }
        public void setTrend(String trend) { this.trend = trend; }
    }
    
    public static class WarehouseUtilizationData {
        private String warehouseCode;
        private String warehouseName;
        private Double utilizationPercentage;
        private BigDecimal totalCapacity;
        private BigDecimal usedCapacity;
        private BigDecimal availableCapacity;
        private String status;
        
        public WarehouseUtilizationData() {}
        
        // Getters and Setters
        public String getWarehouseCode() { return warehouseCode; }
        public void setWarehouseCode(String warehouseCode) { this.warehouseCode = warehouseCode; }
        
        public String getWarehouseName() { return warehouseName; }
        public void setWarehouseName(String warehouseName) { this.warehouseName = warehouseName; }
        
        public Double getUtilizationPercentage() { return utilizationPercentage; }
        public void setUtilizationPercentage(Double utilizationPercentage) { this.utilizationPercentage = utilizationPercentage; }
        
        public BigDecimal getTotalCapacity() { return totalCapacity; }
        public void setTotalCapacity(BigDecimal totalCapacity) { this.totalCapacity = totalCapacity; }
        
        public BigDecimal getUsedCapacity() { return usedCapacity; }
        public void setUsedCapacity(BigDecimal usedCapacity) { this.usedCapacity = usedCapacity; }
        
        public BigDecimal getAvailableCapacity() { return availableCapacity; }
        public void setAvailableCapacity(BigDecimal availableCapacity) { this.availableCapacity = availableCapacity; }
        
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
    
    public static class CustomsClearanceData {
        private String portOfEntry;
        private Long clearedCount;
        private Long pendingCount;
        private Double averageProcessingDays;
        private String performance;
        
        public CustomsClearanceData() {}
        
        public CustomsClearanceData(String portOfEntry, Long clearedCount, Long pendingCount, Double averageProcessingDays, String performance) {
            this.portOfEntry = portOfEntry;
            this.clearedCount = clearedCount;
            this.pendingCount = pendingCount;
            this.averageProcessingDays = averageProcessingDays;
            this.performance = performance;
        }
        
        // Getters and Setters
        public String getPortOfEntry() { return portOfEntry; }
        public void setPortOfEntry(String portOfEntry) { this.portOfEntry = portOfEntry; }
        
        public Long getClearedCount() { return clearedCount; }
        public void setClearedCount(Long clearedCount) { this.clearedCount = clearedCount; }
        
        public Long getPendingCount() { return pendingCount; }
        public void setPendingCount(Long pendingCount) { this.pendingCount = pendingCount; }
        
        public Double getAverageProcessingDays() { return averageProcessingDays; }
        public void setAverageProcessingDays(Double averageProcessingDays) { this.averageProcessingDays = averageProcessingDays; }
        
        public String getPerformance() { return performance; }
        public void setPerformance(String performance) { this.performance = performance; }
    }
}
