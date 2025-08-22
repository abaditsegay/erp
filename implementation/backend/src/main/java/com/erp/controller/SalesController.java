package com.erp.controller;

import com.erp.entity.*;
import com.erp.service.SalesService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Sales Controller for Ethiopian Business Operations
 * Handles REST API for sales orders, quotations, and related operations
 */
@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SalesController {

    private final SalesService salesService;

    // Sales Order Endpoints
    @PostMapping("/orders")
    public ResponseEntity<SalesOrder> createSalesOrder(@RequestBody SalesOrder salesOrder) {
        SalesOrder created = salesService.createSalesOrder(salesOrder);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<SalesOrder> getSalesOrder(@PathVariable Long id) {
        return salesService.findSalesOrderById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/orders")
    public ResponseEntity<Page<SalesOrder>> getAllSalesOrders(Pageable pageable) {
        Page<SalesOrder> orders = salesService.findAllSalesOrders(pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/customer/{customerId}")
    public ResponseEntity<Page<SalesOrder>> getSalesOrdersByCustomer(
            @PathVariable Long customerId, Pageable pageable) {
        Page<SalesOrder> orders = salesService.findSalesOrdersByCustomer(customerId, pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/status/{status}")
    public ResponseEntity<Page<SalesOrder>> getSalesOrdersByStatus(
            @PathVariable SalesOrder.SalesOrderStatus status, Pageable pageable) {
        Page<SalesOrder> orders = salesService.findSalesOrdersByStatus(status, pageable);
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/orders/{id}")
    public ResponseEntity<SalesOrder> updateSalesOrder(
            @PathVariable Long id, @RequestBody SalesOrder salesOrder) {
        salesOrder.setId(id);
        SalesOrder updated = salesService.updateSalesOrder(salesOrder);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/orders/{id}/approve")
    public ResponseEntity<SalesOrder> approveSalesOrder(
            @PathVariable Long id, @RequestParam String approvedBy) {
        SalesOrder approved = salesService.approveSalesOrder(id, approvedBy);
        return ResponseEntity.ok(approved);
    }

    // Quotation Endpoints
    @PostMapping("/quotations")
    public ResponseEntity<Quotation> createQuotation(@RequestBody Quotation quotation) {
        Quotation created = salesService.createQuotation(quotation);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/quotations/{id}")
    public ResponseEntity<Quotation> getQuotation(@PathVariable Long id) {
        return salesService.findQuotationById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/quotations")
    public ResponseEntity<Page<Quotation>> getAllQuotations(Pageable pageable) {
        Page<Quotation> quotations = salesService.findAllQuotations(pageable);
        return ResponseEntity.ok(quotations);
    }

    @GetMapping("/quotations/customer/{customerId}")
    public ResponseEntity<Page<Quotation>> getQuotationsByCustomer(
            @PathVariable Long customerId, Pageable pageable) {
        Page<Quotation> quotations = salesService.findQuotationsByCustomer(customerId, pageable);
        return ResponseEntity.ok(quotations);
    }

    @GetMapping("/quotations/status/{status}")
    public ResponseEntity<Page<Quotation>> getQuotationsByStatus(
            @PathVariable Quotation.QuotationStatus status, Pageable pageable) {
        Page<Quotation> quotations = salesService.findQuotationsByStatus(status, pageable);
        return ResponseEntity.ok(quotations);
    }

    @PutMapping("/quotations/{id}")
    public ResponseEntity<Quotation> updateQuotation(
            @PathVariable Long id, @RequestBody Quotation quotation) {
        quotation.setId(id);
        Quotation updated = salesService.updateQuotation(quotation);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/quotations/{id}/convert-to-order")
    public ResponseEntity<SalesOrder> convertQuotationToOrder(
            @PathVariable Long id, @RequestParam String convertedBy) {
        SalesOrder order = salesService.convertQuotationToOrder(id, convertedBy);
        return ResponseEntity.ok(order);
    }

    // Customer Search Endpoints
    @GetMapping("/customers")
    public ResponseEntity<Page<Customer>> getActiveCustomers(Pageable pageable) {
        Page<Customer> customers = salesService.findActiveCustomers(pageable);
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/customers/search")
    public ResponseEntity<List<Customer>> searchCustomers(@RequestParam String q) {
        List<Customer> customers = salesService.searchCustomers(q);
        return ResponseEntity.ok(customers);
    }

    // Sales Analytics Endpoints
    @GetMapping("/analytics/total-sales")
    public ResponseEntity<BigDecimal> getTotalSales(
            @RequestParam LocalDate startDate, 
            @RequestParam LocalDate endDate) {
        BigDecimal total = salesService.getTotalSalesAmount(startDate, endDate);
        return ResponseEntity.ok(total);
    }

    @GetMapping("/analytics/orders-by-status/{status}")
    public ResponseEntity<Long> getOrderCountByStatus(
            @PathVariable SalesOrder.SalesOrderStatus status) {
        Long count = salesService.getOrderCountByStatus(status);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/analytics/sales-by-region")
    public ResponseEntity<List<Object[]>> getSalesByRegion(
            @RequestParam LocalDate startDate, 
            @RequestParam LocalDate endDate) {
        List<Object[]> sales = salesService.getSalesByRegion(startDate, endDate);
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/analytics/top-customers")
    public ResponseEntity<List<Object[]>> getTopCustomers(@RequestParam(defaultValue = "10") int limit) {
        List<Object[]> customers = salesService.getTopCustomers(limit);
        return ResponseEntity.ok(customers);
    }

    // Ethiopian Tax Calculations
    @GetMapping("/tax/vat")
    public ResponseEntity<BigDecimal> calculateVAT(@RequestParam BigDecimal amount) {
        BigDecimal vat = salesService.calculateVATAmount(amount);
        return ResponseEntity.ok(vat);
    }

    @GetMapping("/tax/withholding")
    public ResponseEntity<BigDecimal> calculateWithholdingTax(
            @RequestParam BigDecimal amount, 
            @RequestParam String customerType) {
        BigDecimal tax = salesService.calculateWithholdingTax(amount, customerType);
        return ResponseEntity.ok(tax);
    }
}
