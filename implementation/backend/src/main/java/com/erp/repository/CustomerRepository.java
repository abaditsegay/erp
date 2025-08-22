package com.erp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.erp.entity.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    Optional<Customer> findByCode(String code);
    
    List<Customer> findByCustomerType(Customer.CustomerType customerType);
    
    List<Customer> findByRegion(String region);
    
    List<Customer> findByActiveTrue();
    
    Page<Customer> findByActiveTrue(Pageable pageable);
    
    @Query("SELECT c FROM Customer c WHERE c.name LIKE %:name% OR c.code LIKE %:name%")
    List<Customer> findByNameOrCodeContaining(@Param("name") String name);
    
    @Query("SELECT c FROM Customer c WHERE UPPER(c.name) LIKE UPPER(CONCAT('%', :name, '%')) OR UPPER(c.code) LIKE UPPER(CONCAT('%', :code, '%'))")
    List<Customer> findByNameContainingIgnoreCaseOrCodeContainingIgnoreCase(@Param("name") String name, @Param("code") String code);
    
    @Query("SELECT c FROM Customer c WHERE c.region = :region AND c.active = true")
    List<Customer> findActiveCustomersByRegion(@Param("region") String region);
    
    @Query("SELECT COUNT(c) FROM Customer c WHERE c.customerType = :customerType")
    Long countByCustomerType(@Param("customerType") Customer.CustomerType customerType);
    
    @Query("SELECT c.region, COUNT(c) FROM Customer c GROUP BY c.region")
    List<Object[]> getCustomerCountByRegion();
}