package com.erp.repository;

import com.erp.entity.UnitOfMeasure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UnitOfMeasureRepository extends JpaRepository<UnitOfMeasure, Long> {
    
    Optional<UnitOfMeasure> findByCode(String code);
    
    Optional<UnitOfMeasure> findByName(String name);
    
    List<UnitOfMeasure> findByNameContainingIgnoreCase(String name);
    
    List<UnitOfMeasure> findByActiveTrue();
    
    List<UnitOfMeasure> findByActiveTrueOrderByName();
    
    boolean existsByCode(String code);
    
    boolean existsByName(String name);
}
