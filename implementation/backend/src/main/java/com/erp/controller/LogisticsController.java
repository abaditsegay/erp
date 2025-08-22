package com.erp.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.erp.dto.LogisticsDashboardDto;
import com.erp.entity.Shipment;
import com.erp.entity.ShipmentEvent;
import com.erp.service.LogisticsService;

/**
 * REST Controller for logistics operations and reporting
 * Provides comprehensive APIs for Ethiopian logistics management
 */
@RestController
@RequestMapping("/api/logistics")
@CrossOrigin(origins = "*")
public class LogisticsController {
    
    @Autowired
    private LogisticsService logisticsService;
    
    /**
     * Get comprehensive logistics dashboard data
     */
    @GetMapping("/dashboard")
    public ResponseEntity<LogisticsDashboardDto> getDashboard() {
        try {
            LogisticsDashboardDto dashboard = logisticsService.getDashboardData();
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get all shipments with pagination
     */
    @GetMapping("/shipments")
    public ResponseEntity<Page<Shipment>> getAllShipments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Shipment> shipments = logisticsService.getAllShipments(pageable);
            return ResponseEntity.ok(shipments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Search shipments by criteria
     */
    @GetMapping("/shipments/search")
    public ResponseEntity<Page<Shipment>> searchShipments(
            @RequestParam(required = false) String trackingNumber,
            @RequestParam(required = false) Shipment.ShipmentStatus status,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Shipment> shipments = logisticsService.searchShipments(
                trackingNumber, status, destination, startDate, endDate, pageable);
            return ResponseEntity.ok(shipments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get shipment by tracking number
     */
    @GetMapping("/shipments/tracking/{trackingNumber}")
    public ResponseEntity<Shipment> getShipmentByTrackingNumber(@PathVariable String trackingNumber) {
        try {
            Optional<Shipment> shipment = logisticsService.getShipmentByTrackingNumber(trackingNumber);
            return shipment.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Create new shipment
     */
    @PostMapping("/shipments")
    public ResponseEntity<Shipment> createShipment(@RequestBody Shipment shipment) {
        try {
            Shipment createdShipment = logisticsService.createShipment(shipment);
            return ResponseEntity.ok(createdShipment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Update shipment status
     */
    @PutMapping("/shipments/{id}/status")
    public ResponseEntity<Shipment> updateShipmentStatus(
            @PathVariable Long id,
            @RequestParam Shipment.ShipmentStatus status,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String description) {
        try {
            Shipment updatedShipment = logisticsService.updateShipmentStatus(
                id, status, location, description);
            return ResponseEntity.ok(updatedShipment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Add shipment event
     */
    @PostMapping("/shipments/{id}/events")
    public ResponseEntity<ShipmentEvent> addShipmentEvent(
            @PathVariable Long id,
            @RequestParam String eventType,
            @RequestParam(required = false) String location,
            @RequestParam String description) {
        try {
            ShipmentEvent event = logisticsService.addShipmentEvent(
                id, eventType, location, description, LocalDateTime.now());
            return ResponseEntity.ok(event);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get shipment events
     */
    @GetMapping("/shipments/{id}/events")
    public ResponseEntity<List<ShipmentEvent>> getShipmentEvents(@PathVariable Long id) {
        try {
            List<ShipmentEvent> events = logisticsService.getShipmentEvents(id);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get shipments requiring attention
     */
    @GetMapping("/shipments/attention")
    public ResponseEntity<List<Shipment>> getShipmentsRequiringAttention() {
        try {
            List<Shipment> shipments = logisticsService.getShipmentsRequiringAttention();
            return ResponseEntity.ok(shipments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get performance metrics for date range
     */
    @GetMapping("/reports/performance")
    public ResponseEntity<Map<String, Object>> getPerformanceMetrics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            Map<String, Object> metrics = logisticsService.getPerformanceMetrics(startDate, endDate);
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get monthly shipment trends
     */
    @GetMapping("/reports/monthly-trends")
    public ResponseEntity<List<LogisticsDashboardDto.MonthlyShipmentData>> getMonthlyTrends() {
        try {
            LogisticsDashboardDto dashboard = logisticsService.getDashboardData();
            return ResponseEntity.ok(dashboard.getMonthlyTrends());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get shipment status distribution
     */
    @GetMapping("/reports/status-distribution")
    public ResponseEntity<List<LogisticsDashboardDto.ShipmentStatusData>> getStatusDistribution() {
        try {
            LogisticsDashboardDto dashboard = logisticsService.getDashboardData();
            return ResponseEntity.ok(dashboard.getStatusDistribution());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get top destinations
     */
    @GetMapping("/reports/top-destinations")
    public ResponseEntity<List<LogisticsDashboardDto.TopDestinationData>> getTopDestinations() {
        try {
            LogisticsDashboardDto dashboard = logisticsService.getDashboardData();
            return ResponseEntity.ok(dashboard.getTopDestinations());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get warehouse utilization
     */
    @GetMapping("/reports/warehouse-utilization")
    public ResponseEntity<List<LogisticsDashboardDto.WarehouseUtilizationData>> getWarehouseUtilization() {
        try {
            LogisticsDashboardDto dashboard = logisticsService.getDashboardData();
            return ResponseEntity.ok(dashboard.getWarehouseUtilization());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get customs clearance performance
     */
    @GetMapping("/reports/customs-performance")
    public ResponseEntity<List<LogisticsDashboardDto.CustomsClearanceData>> getCustomsPerformance() {
        try {
            LogisticsDashboardDto dashboard = logisticsService.getDashboardData();
            return ResponseEntity.ok(dashboard.getCustomsPerformance());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
