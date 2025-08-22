package com.erp.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.erp.entity.ShipmentEvent;

/**
 * Repository interface for ShipmentEvent entity
 */
@Repository
public interface ShipmentEventRepository extends JpaRepository<ShipmentEvent, Long> {
    
    /**
     * Find events by shipment ID
     */
    List<ShipmentEvent> findByShipmentIdOrderByEventTimestampDesc(Long shipmentId);
    
    /**
     * Find events by shipment and event type
     */
    List<ShipmentEvent> findByShipmentIdAndEventType(Long shipmentId, String eventType);
    
    /**
     * Find milestone events
     */
    List<ShipmentEvent> findByIsMilestoneTrueOrderByEventTimestampDesc();
    
    /**
     * Find events by date range
     */
    @Query("SELECT e FROM ShipmentEvent e WHERE e.eventTimestamp >= :startDate AND e.eventTimestamp <= :endDate ORDER BY e.eventTimestamp DESC")
    List<ShipmentEvent> findEventsByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
