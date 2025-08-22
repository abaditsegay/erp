package com.erp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.erp.entity.ShipmentDocument;

/**
 * Repository interface for ShipmentDocument entity
 */
@Repository
public interface ShipmentDocumentRepository extends JpaRepository<ShipmentDocument, Long> {
    
    /**
     * Find documents by shipment ID
     */
    List<ShipmentDocument> findByShipmentId(Long shipmentId);
    
    /**
     * Find documents by type
     */
    List<ShipmentDocument> findByDocumentType(String documentType);
    
    /**
     * Find required documents
     */
    List<ShipmentDocument> findByIsRequiredTrue();
    
    /**
     * Find verified documents
     */
    List<ShipmentDocument> findByIsVerifiedTrue();
    
    /**
     * Find unverified required documents
     */
    @Query("SELECT d FROM ShipmentDocument d WHERE d.isRequired = true AND d.isVerified = false")
    List<ShipmentDocument> findUnverifiedRequiredDocuments();
    
    /**
     * Find documents by customs reference
     */
    List<ShipmentDocument> findByCustomsReference(String customsReference);
}
