package com.erp.service;

import com.erp.entity.*;
import com.erp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Sales Service for Ethiopian Business Operations
 * Handles sales orders, quotations, and Ethiopian business logic
 */
@Service
@RequiredArgsConstructor
@Transactional
public class SalesService {

    private final SalesOrderRepository salesOrderRepository;
    private final QuotationRepository quotationRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    // Sales Order Management
    public SalesOrder createSalesOrder(SalesOrder salesOrder) {
        // Generate order number
        salesOrder.setOrderNumber(generateOrderNumber());
        
        // Apply Ethiopian cultural considerations
        applyCulturalConsiderations(salesOrder);
        
        // Calculate totals including Ethiopian VAT
        salesOrder.calculateTotals();
        
        return salesOrderRepository.save(salesOrder);
    }

    public Optional<SalesOrder> findSalesOrderById(Long id) {
        return salesOrderRepository.findById(id);
    }

    public Page<SalesOrder> findAllSalesOrders(Pageable pageable) {
        return salesOrderRepository.findAll(pageable);
    }

    public Page<SalesOrder> findSalesOrdersByCustomer(Long customerId, Pageable pageable) {
        return salesOrderRepository.findByCustomerId(customerId, pageable);
    }

    public Page<SalesOrder> findSalesOrdersByStatus(SalesOrder.SalesOrderStatus status, Pageable pageable) {
        return salesOrderRepository.findByStatus(status, pageable);
    }

    public SalesOrder updateSalesOrder(SalesOrder salesOrder) {
        salesOrder.calculateTotals();
        return salesOrderRepository.save(salesOrder);
    }

    public SalesOrder approveSalesOrder(Long orderId, String approvedBy) {
        SalesOrder order = salesOrderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Sales order not found"));
        
        order.setStatus(SalesOrder.SalesOrderStatus.APPROVED);
        order.setApprovedBy(approvedBy);
        order.setApprovalDate(LocalDateTime.now());
        
        return salesOrderRepository.save(order);
    }

    // Quotation Management
    public Quotation createQuotation(Quotation quotation) {
        // Generate quotation number
        quotation.setQuotationNumber(generateQuotationNumber());
        
        // Apply cultural considerations
        applyCulturalConsiderationsToQuotation(quotation);
        
        // Calculate totals
        quotation.calculateTotals();
        
        return quotationRepository.save(quotation);
    }

    public Optional<Quotation> findQuotationById(Long id) {
        return quotationRepository.findById(id);
    }

    public Page<Quotation> findAllQuotations(Pageable pageable) {
        return quotationRepository.findAll(pageable);
    }

    public Page<Quotation> findQuotationsByCustomer(Long customerId, Pageable pageable) {
        return quotationRepository.findByCustomerId(customerId, pageable);
    }

    public Page<Quotation> findQuotationsByStatus(Quotation.QuotationStatus status, Pageable pageable) {
        return quotationRepository.findByStatus(status, pageable);
    }

    public Quotation updateQuotation(Quotation quotation) {
        quotation.calculateTotals();
        return quotationRepository.save(quotation);
    }

    public SalesOrder convertQuotationToOrder(Long quotationId, String convertedBy) {
        Quotation quotation = quotationRepository.findById(quotationId)
            .orElseThrow(() -> new RuntimeException("Quotation not found"));

        // Create sales order from quotation
        SalesOrder salesOrder = SalesOrder.builder()
            .customer(quotation.getCustomer())
            .orderDate(LocalDate.now())
            .deliveryRegion(extractRegionFromCustomer(quotation.getCustomer()))
            .status(SalesOrder.SalesOrderStatus.DRAFT)
            .priority(SalesOrder.OrderPriority.NORMAL)
            .subtotal(quotation.getSubtotal())
            .vatAmount(quotation.getVatAmount())
            .vatRate(quotation.getVatRate())
            .totalAmount(quotation.getTotalAmount())
            .discountAmount(quotation.getDiscountAmount())
            .discountPercentage(quotation.getDiscountPercentage())
            .paymentTerms(quotation.getPaymentTerms())
            .languagePreference(quotation.getLanguagePreference())
            .culturalNotes(quotation.getCulturalNotes())
            .salesRepresentative(convertedBy)
            .notes("Converted from Quotation #" + quotation.getQuotationNumber())
            .build();

        salesOrder = createSalesOrder(salesOrder);

        // Update quotation status
        quotation.setStatus(Quotation.QuotationStatus.CONVERTED_TO_ORDER);
        quotation.setConvertedToOrder(true);
        quotation.setConvertedOrderId(salesOrder.getId());
        quotation.setConversionDate(LocalDateTime.now());
        quotationRepository.save(quotation);

        return salesOrder;
    }

    // Ethiopian Business Logic
    private void applyCulturalConsiderations(SalesOrder order) {
        // Basic cultural considerations - can be enhanced with Ethiopian services later
        if (order.getDeliveryRegion() != null) {
            String deliveryNote = getRegionalDeliveryConsiderations(order.getDeliveryRegion());
            if (deliveryNote != null && order.getSpecialInstructions() != null) {
                order.setSpecialInstructions(order.getSpecialInstructions() + "\n" + deliveryNote);
            } else if (deliveryNote != null) {
                order.setSpecialInstructions(deliveryNote);
            }
        }
    }

    private void applyCulturalConsiderationsToQuotation(Quotation quotation) {
        // Basic implementation - can be enhanced with Ethiopian services later
        if (quotation.getQuotationDate() != null) {
            // Add basic Ethiopian business considerations
            String note = "Please consider Ethiopian business practices and holiday schedules.";
            quotation.setHolidayConsideration(note);
        }
    }

    private String getRegionalDeliveryConsiderations(String region) {
        return switch (region.toLowerCase()) {
            case "addis ababa" -> "Metropolitan delivery - same day possible";
            case "oromia" -> "Regional delivery - consider road conditions";
            case "amhara" -> "Northern region delivery - weather dependent";
            default -> "Regional delivery - confirm accessibility";
        };
    }

    private String extractRegionFromCustomer(Customer customer) {
        return customer.getRegion() != null ? customer.getRegion() : "Addis Ababa";
    }

    // Number Generation
    private String generateOrderNumber() {
        long count = salesOrderRepository.count();
        String year = String.valueOf(LocalDate.now().getYear());
        return "SO-" + year + "-" + String.format("%06d", count + 1);
    }

    private String generateQuotationNumber() {
        long count = quotationRepository.count();
        String year = String.valueOf(LocalDate.now().getYear());
        return "QT-" + year + "-" + String.format("%06d", count + 1);
    }

    // Customer Integration
    public Page<Customer> findActiveCustomers(Pageable pageable) {
        return customerRepository.findByActiveTrue(pageable);
    }

    public List<Customer> searchCustomers(String searchTerm) {
        return customerRepository.findByNameContainingIgnoreCaseOrCodeContainingIgnoreCase(searchTerm, searchTerm);
    }

    // Sales Analytics for Ethiopian Business
    public BigDecimal getTotalSalesAmount(LocalDate startDate, LocalDate endDate) {
        return salesOrderRepository.findTotalSalesAmount(startDate, endDate);
    }

    public Long getOrderCountByStatus(SalesOrder.SalesOrderStatus status) {
        return salesOrderRepository.countByStatus(status);
    }

    public List<Object[]> getSalesByRegion(LocalDate startDate, LocalDate endDate) {
        return salesOrderRepository.findSalesByRegion(startDate, endDate);
    }

    public List<Object[]> getTopCustomers(int limit) {
        return salesOrderRepository.findTopCustomers(PageRequest.of(0, limit));
    }

    // Basic VAT calculation for Ethiopia (15%)
    public BigDecimal calculateVATAmount(BigDecimal amount) {
        return amount.multiply(BigDecimal.valueOf(0.15));
    }

    public BigDecimal calculateWithholdingTax(BigDecimal amount, String customerType) {
        // Basic withholding tax calculation - can be enhanced
        return switch (customerType.toLowerCase()) {
            case "government" -> amount.multiply(BigDecimal.valueOf(0.02)); // 2%
            case "business" -> amount.multiply(BigDecimal.valueOf(0.03)); // 3%
            default -> BigDecimal.ZERO;
        };
    }
}
