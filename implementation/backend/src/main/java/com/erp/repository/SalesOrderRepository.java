package com.erp.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.erp.entity.SalesOrder;

@Repository
public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {

    Page<SalesOrder> findByCustomerId(Long customerId, Pageable pageable);

    Page<SalesOrder> findByStatus(SalesOrder.SalesOrderStatus status, Pageable pageable);

    @Query("SELECT COALESCE(SUM(so.totalAmount), 0) FROM SalesOrder so WHERE so.orderDate BETWEEN :startDate AND :endDate AND so.status != 'CANCELLED'")
    BigDecimal findTotalSalesAmount(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    Long countByStatus(SalesOrder.SalesOrderStatus status);

    @Query("SELECT so.deliveryRegion, COUNT(so), SUM(so.totalAmount) FROM SalesOrder so WHERE so.orderDate BETWEEN :startDate AND :endDate GROUP BY so.deliveryRegion")
    List<Object[]> findSalesByRegion(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT c.name, COUNT(so), SUM(so.totalAmount) FROM SalesOrder so JOIN so.customer c GROUP BY c.id, c.name ORDER BY SUM(so.totalAmount) DESC")
    List<Object[]> findTopCustomers(Pageable pageable);
}
