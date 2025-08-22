package com.erp.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.erp.entity.Shipment;

/**
 * Repository interface for Shipment entity
 * Provides methods for shipment tracking and logistics reporting
 */
@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    
    /**
     * Find shipment by tracking number
     */
    Optional<Shipment> findByTrackingNumber(String trackingNumber);
    
    /**
     * Find shipments by status
     */
    List<Shipment> findByStatus(Shipment.ShipmentStatus status);
    
    /**
     * Find shipments by destination
     */
    List<Shipment> findByDestination(String destination);
    
    /**
     * Find shipments by origin
     */
    List<Shipment> findByOrigin(String origin);
    
    /**
     * Find shipments by priority
     */
    List<Shipment> findByPriority(Shipment.Priority priority);
    
    /**
     * Find shipments by mode of transport
     */
    List<Shipment> findByMode(Shipment.TransportMode mode);
    
    /**
     * Find shipments requiring customs clearance
     */
    @Query("SELECT s FROM Shipment s WHERE s.requiresCustoms = true AND s.isInternational = true")
    List<Shipment> findShipmentsRequiringCustoms();
    
    /**
     * Find delayed shipments
     */
    @Query("SELECT s FROM Shipment s WHERE s.estimatedDelivery < :currentTime AND s.status NOT IN ('DELIVERED', 'CANCELLED')")
    List<Shipment> findDelayedShipments(@Param("currentTime") LocalDateTime currentTime);
    
    /**
     * Find shipments by date range
     */
    @Query("SELECT s FROM Shipment s WHERE s.createdDate >= :startDate AND s.createdDate <= :endDate")
    List<Shipment> findShipmentsByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    /**
     * Find shipments by carrier
     */
    List<Shipment> findByCarrier(String carrier);
    
    /**
     * Find international shipments
     */
    @Query("SELECT s FROM Shipment s WHERE s.isInternational = true")
    List<Shipment> findInternationalShipments();
    
    /**
     * Get shipments by port of entry
     */
    List<Shipment> findByPortOfEntry(String portOfEntry);
    
    /**
     * Count shipments by status
     */
    @Query("SELECT s.status, COUNT(s) FROM Shipment s GROUP BY s.status")
    List<Object[]> countShipmentsByStatus();
    
    /**
     * Count shipments by destination for top destinations report
     */
    @Query("SELECT s.destination, COUNT(s) FROM Shipment s GROUP BY s.destination ORDER BY COUNT(s) DESC")
    List<Object[]> getTopDestinations();
    
    /**
     * Get monthly shipment statistics
     */
    @Query("SELECT YEAR(s.createdDate), MONTH(s.createdDate), COUNT(s), SUM(s.customsValue) " +
           "FROM Shipment s " +
           "WHERE s.createdDate >= :startDate " +
           "GROUP BY YEAR(s.createdDate), MONTH(s.createdDate) " +
           "ORDER BY YEAR(s.createdDate), MONTH(s.createdDate)")
    List<Object[]> getMonthlyShipmentStats(@Param("startDate") LocalDateTime startDate);
    
    /**
     * Get average delivery time by mode
     */
    @Query("SELECT s.mode, AVG(TIMESTAMPDIFF(HOUR, s.createdDate, s.actualDelivery)) " +
           "FROM Shipment s " +
           "WHERE s.actualDelivery IS NOT NULL " +
           "GROUP BY s.mode")
    List<Object[]> getAverageDeliveryTimeByMode();
    
    /**
     * Get on-time delivery performance
     */
    @Query("SELECT " +
           "COUNT(CASE WHEN s.actualDelivery <= s.estimatedDelivery THEN 1 END) * 100.0 / COUNT(s) " +
           "FROM Shipment s " +
           "WHERE s.actualDelivery IS NOT NULL")
    Double getOnTimeDeliveryPercentage();
    
    /**
     * Get customs clearance statistics by port
     */
    @Query("SELECT s.portOfEntry, " +
           "COUNT(CASE WHEN s.status = 'CUSTOMS_CLEARED' THEN 1 END), " +
           "COUNT(CASE WHEN s.status = 'CUSTOMS_PROCESSING' THEN 1 END), " +
           "AVG(CASE WHEN s.status = 'CUSTOMS_CLEARED' " +
           "    THEN TIMESTAMPDIFF(DAY, s.createdDate, s.actualDelivery) END) " +
           "FROM Shipment s " +
           "WHERE s.portOfEntry IS NOT NULL " +
           "GROUP BY s.portOfEntry")
    List<Object[]> getCustomsClearanceStatsByPort();
    
    /**
     * Find recent shipments with pagination
     */
    Page<Shipment> findByOrderByCreatedDateDesc(Pageable pageable);
    
    /**
     * Search shipments by multiple criteria
     */
    @Query("SELECT s FROM Shipment s WHERE " +
           "(:trackingNumber IS NULL OR s.trackingNumber LIKE %:trackingNumber%) AND " +
           "(:status IS NULL OR s.status = :status) AND " +
           "(:destination IS NULL OR s.destination LIKE %:destination%) AND " +
           "(:startDate IS NULL OR s.createdDate >= :startDate) AND " +
           "(:endDate IS NULL OR s.createdDate <= :endDate)")
    Page<Shipment> searchShipments(
        @Param("trackingNumber") String trackingNumber,
        @Param("status") Shipment.ShipmentStatus status,
        @Param("destination") String destination,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        Pageable pageable
    );
}
