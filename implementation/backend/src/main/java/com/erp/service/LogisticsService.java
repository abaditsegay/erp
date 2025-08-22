package com.erp.service;

import com.erp.dto.LogisticsDashboardDto;
import com.erp.entity.Shipment;
import com.erp.entity.ShipmentEvent;
import com.erp.entity.Warehouse;
import com.erp.repository.ShipmentRepository;
import com.erp.repository.ShipmentEventRepository;
import com.erp.repository.WarehouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for logistics operations and reporting
 * Provides comprehensive analytics for Ethiopian logistics management
 */
@Service
@Transactional
public class LogisticsService {
    
    @Autowired
    private ShipmentRepository shipmentRepository;
    
    @Autowired
    private ShipmentEventRepository shipmentEventRepository;
    
    @Autowired
    private WarehouseRepository warehouseRepository;
    
    /**
     * Get comprehensive logistics dashboard data
     */
    public LogisticsDashboardDto getDashboardData() {
        LogisticsDashboardDto dashboard = new LogisticsDashboardDto();
        
        // Basic metrics
        dashboard.setTotalShipments(getTotalShipmentsCount());
        dashboard.setDeliveredShipments(getDeliveredShipmentsCount());
        dashboard.setInTransitShipments(getInTransitShipmentsCount());
        dashboard.setDelayedShipments(getDelayedShipmentsCount());
        dashboard.setOnTimeDeliveryPercentage(getOnTimeDeliveryPercentage());
        dashboard.setAverageProcessingTimeDays(getAverageProcessingTimeDays());
        dashboard.setTotalShipmentValue(getTotalShipmentValue());
        dashboard.setCurrency("ETB");
        dashboard.setLastUpdated(LocalDateTime.now());
        
        // Detailed analytics
        dashboard.setStatusDistribution(getShipmentStatusDistribution());
        dashboard.setMonthlyTrends(getMonthlyShipmentTrends());
        dashboard.setTopDestinations(getTopDestinations());
        dashboard.setWarehouseUtilization(getWarehouseUtilization());
        dashboard.setCustomsPerformance(getCustomsClearancePerformance());
        
        return dashboard;
    }
    
    /**
     * Get all shipments with pagination
     */
    public Page<Shipment> getAllShipments(Pageable pageable) {
        return shipmentRepository.findByOrderByCreatedDateDesc(pageable);
    }
    
    /**
     * Search shipments by criteria
     */
    public Page<Shipment> searchShipments(String trackingNumber, Shipment.ShipmentStatus status, 
                                        String destination, LocalDateTime startDate, 
                                        LocalDateTime endDate, Pageable pageable) {
        return shipmentRepository.searchShipments(trackingNumber, status, destination, startDate, endDate, pageable);
    }
    
    /**
     * Get shipment by tracking number
     */
    public Optional<Shipment> getShipmentByTrackingNumber(String trackingNumber) {
        return shipmentRepository.findByTrackingNumber(trackingNumber);
    }
    
    /**
     * Create new shipment
     */
    public Shipment createShipment(Shipment shipment) {
        shipment.setCreatedDate(LocalDateTime.now());
        if (shipment.getTrackingNumber() == null) {
            shipment.setTrackingNumber(generateTrackingNumber());
        }
        Shipment savedShipment = shipmentRepository.save(shipment);
        
        // Create initial event
        addShipmentEvent(savedShipment.getId(), "CREATED", shipment.getOrigin(), 
                        "Shipment created and documentation prepared", LocalDateTime.now());
        
        return savedShipment;
    }
    
    /**
     * Update shipment status
     */
    public Shipment updateShipmentStatus(Long shipmentId, Shipment.ShipmentStatus newStatus, String location, String description) {
        Optional<Shipment> shipmentOpt = shipmentRepository.findById(shipmentId);
        if (shipmentOpt.isPresent()) {
            Shipment shipment = shipmentOpt.get();
            Shipment.ShipmentStatus oldStatus = shipment.getStatus();
            shipment.setStatus(newStatus);
            
            // Update delivery date if delivered
            if (newStatus == Shipment.ShipmentStatus.DELIVERED && shipment.getActualDelivery() == null) {
                shipment.setActualDelivery(LocalDateTime.now());
            }
            
            Shipment updatedShipment = shipmentRepository.save(shipment);
            
            // Add event for status change
            addShipmentEvent(shipmentId, newStatus.name(), location, description, LocalDateTime.now());
            
            return updatedShipment;
        }
        throw new RuntimeException("Shipment not found with ID: " + shipmentId);
    }
    
    /**
     * Add shipment event
     */
    public ShipmentEvent addShipmentEvent(Long shipmentId, String eventType, String location, String description, LocalDateTime timestamp) {
        Optional<Shipment> shipmentOpt = shipmentRepository.findById(shipmentId);
        if (shipmentOpt.isPresent()) {
            ShipmentEvent event = new ShipmentEvent();
            event.setShipment(shipmentOpt.get());
            event.setEventType(eventType);
            event.setLocation(location);
            event.setDescription(description);
            event.setEventTimestamp(timestamp);
            event.setIsMilestone(isMilestoneEvent(eventType));
            
            return shipmentEventRepository.save(event);
        }
        throw new RuntimeException("Shipment not found with ID: " + shipmentId);
    }
    
    /**
     * Get shipment events
     */
    public List<ShipmentEvent> getShipmentEvents(Long shipmentId) {
        return shipmentEventRepository.findByShipmentIdOrderByEventTimestampDesc(shipmentId);
    }
    
    // Private helper methods for dashboard calculations
    
    private Long getTotalShipmentsCount() {
        return shipmentRepository.count();
    }
    
    private Long getDeliveredShipmentsCount() {
        return (long) shipmentRepository.findByStatus(Shipment.ShipmentStatus.DELIVERED).size();
    }
    
    private Long getInTransitShipmentsCount() {
        return (long) shipmentRepository.findByStatus(Shipment.ShipmentStatus.IN_TRANSIT).size();
    }
    
    private Long getDelayedShipmentsCount() {
        return (long) shipmentRepository.findDelayedShipments(LocalDateTime.now()).size();
    }
    
    private Double getOnTimeDeliveryPercentage() {
        Double percentage = shipmentRepository.getOnTimeDeliveryPercentage();
        return percentage != null ? percentage : 0.0;
    }
    
    private Double getAverageProcessingTimeDays() {
        List<Object[]> avgTimes = shipmentRepository.getAverageDeliveryTimeByMode();
        if (avgTimes.isEmpty()) return 0.0;
        
        double totalHours = avgTimes.stream()
                .mapToDouble(arr -> arr[1] != null ? ((Number) arr[1]).doubleValue() : 0.0)
                .average().orElse(0.0);
        
        return totalHours / 24.0; // Convert hours to days
    }
    
    private BigDecimal getTotalShipmentValue() {
        List<Shipment> shipments = shipmentRepository.findAll();
        return shipments.stream()
                .filter(s -> s.getCustomsValue() != null)
                .map(Shipment::getCustomsValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    private List<LogisticsDashboardDto.ShipmentStatusData> getShipmentStatusDistribution() {
        List<Object[]> statusCounts = shipmentRepository.countShipmentsByStatus();
        long totalShipments = getTotalShipmentsCount();
        
        Map<String, String> statusColors = Map.of(
            "DELIVERED", "#4caf50",
            "IN_TRANSIT", "#2196f3",
            "DELAYED", "#ff9800",
            "CANCELLED", "#f44336",
            "CUSTOMS_PROCESSING", "#9c27b0",
            "CREATED", "#607d8b"
        );
        
        return statusCounts.stream()
                .map(arr -> {
                    String status = ((Shipment.ShipmentStatus) arr[0]).name();
                    Long count = (Long) arr[1];
                    Double percentage = totalShipments > 0 ? (count * 100.0) / totalShipments : 0.0;
                    String color = statusColors.getOrDefault(status, "#757575");
                    
                    return new LogisticsDashboardDto.ShipmentStatusData(status, count, percentage, color);
                })
                .collect(Collectors.toList());
    }
    
    private List<LogisticsDashboardDto.MonthlyShipmentData> getMonthlyShipmentTrends() {
        LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6);
        List<Object[]> monthlyStats = shipmentRepository.getMonthlyShipmentStats(sixMonthsAgo);
        
        return monthlyStats.stream()
                .map(arr -> {
                    Integer year = (Integer) arr[0];
                    Integer month = (Integer) arr[1];
                    Long count = (Long) arr[2];
                    BigDecimal value = (BigDecimal) arr[3];
                    
                    String monthName = Month.of(month).name().substring(0, 3);
                    return new LogisticsDashboardDto.MonthlyShipmentData(monthName, year, count, value);
                })
                .collect(Collectors.toList());
    }
    
    private List<LogisticsDashboardDto.TopDestinationData> getTopDestinations() {
        List<Object[]> destinations = shipmentRepository.getTopDestinations();
        long totalShipments = getTotalShipmentsCount();
        
        return destinations.stream()
                .limit(10) // Top 10 destinations
                .map(arr -> {
                    String destination = (String) arr[0];
                    Long count = (Long) arr[1];
                    Double percentage = totalShipments > 0 ? (count * 100.0) / totalShipments : 0.0;
                    String trend = count > 50 ? "Growing" : "Stable"; // Simple trend calculation
                    
                    return new LogisticsDashboardDto.TopDestinationData(destination, count, percentage, trend);
                })
                .collect(Collectors.toList());
    }
    
    private List<LogisticsDashboardDto.WarehouseUtilizationData> getWarehouseUtilization() {
        List<Warehouse> warehouses = warehouseRepository.findAll();
        
        return warehouses.stream()
                .map(warehouse -> {
                    LogisticsDashboardDto.WarehouseUtilizationData data = new LogisticsDashboardDto.WarehouseUtilizationData();
                    data.setWarehouseCode(warehouse.getWarehouseCode());
                    data.setWarehouseName(warehouse.getWarehouseName());
                    
                    BigDecimal totalCapacity = warehouse.getCapacityCubicMeter() != null ? 
                        BigDecimal.valueOf(warehouse.getCapacityCubicMeter()) : BigDecimal.ZERO;
                    data.setTotalCapacity(totalCapacity);
                    
                    // Calculate utilization (simplified - in real implementation, this would come from stock levels)
                    BigDecimal usedCapacity = totalCapacity.multiply(BigDecimal.valueOf(0.75)); // 75% utilization example
                    data.setUsedCapacity(usedCapacity);
                    data.setAvailableCapacity(totalCapacity.subtract(usedCapacity));
                    
                    Double utilization = totalCapacity.compareTo(BigDecimal.ZERO) > 0 ? 
                        usedCapacity.divide(totalCapacity, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).doubleValue() : 0.0;
                    data.setUtilizationPercentage(utilization);
                    
                    String status = utilization > 85 ? "Near Capacity" : utilization > 70 ? "Good" : "Available";
                    data.setStatus(status);
                    
                    return data;
                })
                .collect(Collectors.toList());
    }
    
    private List<LogisticsDashboardDto.CustomsClearanceData> getCustomsClearancePerformance() {
        List<Object[]> customsStats = shipmentRepository.getCustomsClearanceStatsByPort();
        
        return customsStats.stream()
                .map(arr -> {
                    String port = (String) arr[0];
                    Long cleared = (Long) arr[1];
                    Long pending = (Long) arr[2];
                    Double avgDays = arr[3] != null ? ((Number) arr[3]).doubleValue() : 0.0;
                    
                    String performance = avgDays < 2.5 ? "Excellent" : avgDays < 3.5 ? "Good" : "Needs Improvement";
                    
                    return new LogisticsDashboardDto.CustomsClearanceData(port, cleared, pending, avgDays, performance);
                })
                .collect(Collectors.toList());
    }
    
    private String generateTrackingNumber() {
        String prefix = "ETH";
        String year = String.valueOf(LocalDateTime.now().getYear());
        String random = String.format("%06d", new Random().nextInt(999999));
        return prefix + "-" + year + "-" + random;
    }
    
    private boolean isMilestoneEvent(String eventType) {
        Set<String> milestones = Set.of("CREATED", "PICKED_UP", "IN_TRANSIT", "CUSTOMS_CLEARED", "DELIVERED");
        return milestones.contains(eventType);
    }
    
    /**
     * Get shipments requiring attention (delayed, customs issues)
     */
    public List<Shipment> getShipmentsRequiringAttention() {
        List<Shipment> delayed = shipmentRepository.findDelayedShipments(LocalDateTime.now());
        List<Shipment> customsIssues = shipmentRepository.findShipmentsRequiringCustoms().stream()
                .filter(s -> s.getStatus() == Shipment.ShipmentStatus.CUSTOMS_PROCESSING)
                .collect(Collectors.toList());
        
        Set<Shipment> combined = new HashSet<>(delayed);
        combined.addAll(customsIssues);
        
        return new ArrayList<>(combined);
    }
    
    /**
     * Get performance metrics for date range
     */
    public Map<String, Object> getPerformanceMetrics(LocalDateTime startDate, LocalDateTime endDate) {
        List<Shipment> shipments = shipmentRepository.findShipmentsByDateRange(startDate, endDate);
        
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalShipments", shipments.size());
        metrics.put("deliveredCount", shipments.stream().mapToLong(s -> s.getStatus() == Shipment.ShipmentStatus.DELIVERED ? 1 : 0).sum());
        metrics.put("averageDeliveryTime", calculateAverageDeliveryTime(shipments));
        metrics.put("onTimeDeliveryRate", calculateOnTimeDeliveryRate(shipments));
        metrics.put("totalValue", shipments.stream().filter(s -> s.getCustomsValue() != null).map(Shipment::getCustomsValue).reduce(BigDecimal.ZERO, BigDecimal::add));
        
        return metrics;
    }
    
    private Double calculateAverageDeliveryTime(List<Shipment> shipments) {
        return shipments.stream()
                .filter(s -> s.getDeliveryTimeHours() != null)
                .mapToLong(Shipment::getDeliveryTimeHours)
                .average()
                .orElse(0.0) / 24.0; // Convert to days
    }
    
    private Double calculateOnTimeDeliveryRate(List<Shipment> shipments) {
        long totalDelivered = shipments.stream().mapToLong(s -> s.getActualDelivery() != null ? 1 : 0).sum();
        if (totalDelivered == 0) return 0.0;
        
        long onTime = shipments.stream()
                .filter(s -> s.getActualDelivery() != null && s.getEstimatedDelivery() != null)
                .mapToLong(s -> s.getActualDelivery().isBefore(s.getEstimatedDelivery()) || s.getActualDelivery().equals(s.getEstimatedDelivery()) ? 1 : 0)
                .sum();
        
        return (onTime * 100.0) / totalDelivered;
    }
}
