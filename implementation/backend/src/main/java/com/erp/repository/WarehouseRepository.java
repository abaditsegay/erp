package com.erp.repository;

import com.erp.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Warehouse entity
 */
@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
    
    List<Warehouse> findByIsActiveTrue();
    
    long countByIsActiveTrue();
    
    Optional<Warehouse> findByWarehouseCode(String warehouseCode);
    
    List<Warehouse> findByWarehouseTypeAndIsActiveTrue(Warehouse.WarehouseType warehouseType);
    
    List<Warehouse> findByRegionAndIsActiveTrue(String region);
    
    List<Warehouse> findByCityAndIsActiveTrue(String city);
    
    List<Warehouse> findByIsRefrigeratedTrueAndIsActiveTrue();
    
    List<Warehouse> findByHasSecurityTrueAndIsActiveTrue();
}
