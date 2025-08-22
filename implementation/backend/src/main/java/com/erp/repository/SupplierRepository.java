package com.erp.repository;

import com.erp.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    
    Optional<Supplier> findByCode(String code);
    
    Optional<Supplier> findByEmail(String email);
    
    List<Supplier> findByNameContainingIgnoreCase(String name);
    
    List<Supplier> findByActiveTrue();
    
    List<Supplier> findByActiveTrueOrderByName();
    
    boolean existsByCode(String code);
    
    boolean existsByEmail(String email);
}
