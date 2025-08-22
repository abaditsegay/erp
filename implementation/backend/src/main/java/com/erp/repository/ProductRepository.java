package com.erp.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.erp.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    Optional<Product> findByCode(String code);
    
    Optional<Product> findByBarcode(String barcode);
    
    List<Product> findByCategory(String category);
    
    List<Product> findByActiveTrue();
    
    List<Product> findByTaxableTrue();
    
    @Query("SELECT p FROM Product p WHERE p.name LIKE %:name% OR p.nameAmharic LIKE %:name% OR p.code LIKE %:name%")
    List<Product> findByNameOrCodeContaining(@Param("name") String name);
    
    @Query("SELECT p FROM Product p WHERE p.currentStock <= p.minimumStockLevel AND p.active = true")
    List<Product> findLowStockProducts();
    
    @Query("SELECT p FROM Product p WHERE p.currentStock <= p.reorderLevel AND p.active = true")
    List<Product> findProductsNeedingReorder();
    
    @Query("SELECT p FROM Product p WHERE p.unitPrice BETWEEN :minPrice AND :maxPrice AND p.active = true")
    List<Product> findByPriceRange(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice);
    
    @Query("SELECT p.category, COUNT(p) FROM Product p WHERE p.active = true GROUP BY p.category")
    List<Object[]> getProductCountByCategory();
    
    @Query("SELECT p FROM Product p WHERE p.category = :category AND p.active = true ORDER BY p.name")
    List<Product> findActiveByCategoryOrderByName(@Param("category") String category);
    
    @Query("SELECT SUM(p.costPrice * p.currentStock) FROM Product p WHERE p.active = true")
    BigDecimal getTotalInventoryValue();
    
    @Query("SELECT COUNT(p) FROM Product p WHERE p.active = true")
    Long countActiveProducts();
}
