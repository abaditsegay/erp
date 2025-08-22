package com.erp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.erp.entity.Quotation;

@Repository
public interface QuotationRepository extends JpaRepository<Quotation, Long> {

    Page<Quotation> findByCustomerId(Long customerId, Pageable pageable);

    Page<Quotation> findByStatus(Quotation.QuotationStatus status, Pageable pageable);

    Page<Quotation> findByValidUntilBeforeAndStatusNot(java.time.LocalDate date, Quotation.QuotationStatus status, Pageable pageable);
}
