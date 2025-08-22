package com.erp.repository;

import com.erp.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Category entity operations
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    /**
     * Find category by code (case-insensitive)
     */
    Optional<Category> findByCategoryCodeIgnoreCase(String categoryCode);

    /**
     * Check if category code exists (case-insensitive)
     */
    boolean existsByCategoryCodeIgnoreCase(String categoryCode);

    /**
     * Find all active categories
     */
    List<Category> findByIsActiveTrueOrderByCategoryNameAsc();

    /**
     * Find categories by parent category
     */
    List<Category> findByParentCategoryIdAndIsActiveTrue(Long parentCategoryId);

    /**
     * Find root categories (no parent)
     */
    List<Category> findByParentCategoryIdIsNullAndIsActiveTrue();

    /**
     * Search categories by name
     */
    List<Category> findByCategoryNameContainingIgnoreCaseAndIsActiveTrue(String searchTerm);
}
