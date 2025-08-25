package com.erp.controller;

import com.erp.entity.Supplier;
import com.erp.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

/**
 * Purchase Controller for Ethiopian Business Operations
 * Handles REST API for purchase orders, requisitions, suppliers, and GRV operations
 */
@RestController
@RequestMapping("/api/purchase")
@CrossOrigin(origins = "*")
public class PurchaseController {

    private static final Logger log = LoggerFactory.getLogger(PurchaseController.class);
    
    @Autowired
    private SupplierService supplierService;

    // Purchase Orders
    @GetMapping("/orders")
    public ResponseEntity<Map<String, Object>> getPurchaseOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer supplierId) {
        
        log.info("Getting purchase orders - page: {}, limit: {}, search: {}, status: {}, supplierId: {}", 
                page, limit, search, status, supplierId);
        
        // Mock data for now - replace with actual service later
        List<Map<String, Object>> orders = new ArrayList<>();
        
        // Ethiopian business-focused mock data
        orders.add(createMockPurchaseOrder(1L, "PO-2025-001", "ሰላም ግንባታ ድርጅት", "PENDING", 150000.0, "2025-01-15"));
        orders.add(createMockPurchaseOrder(2L, "PO-2025-002", "አዲስ አበባ ንግድ ማህበር", "APPROVED", 275000.0, "2025-01-18"));
        orders.add(createMockPurchaseOrder(3L, "PO-2025-003", "ሃበሻ መሳሪያ አቅራቢ", "DELIVERED", 89500.0, "2025-01-20"));
        orders.add(createMockPurchaseOrder(4L, "PO-2025-004", "ኢትዮ ቴክ ሶሉሽንስ", "PENDING", 320000.0, "2025-01-22"));
        orders.add(createMockPurchaseOrder(5L, "PO-2025-005", "የኢትዮጵያ መንግስት ጽ/ቤት", "APPROVED", 450000.0, "2025-01-25"));
        
        Map<String, Object> response = new HashMap<>();
        response.put("orders", orders);
        response.put("total", orders.size());
        response.put("page", page);
        response.put("limit", limit);
        
        return ResponseEntity.ok(response);
    }

    // Purchase Requisitions
    @GetMapping("/requisitions")
    public ResponseEntity<Map<String, Object>> getPurchaseRequisitions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String department) {
        
        log.info("Getting purchase requisitions - page: {}, limit: {}, search: {}, status: {}, department: {}", 
                page, limit, search, status, department);
        
        // Mock data for now
        List<Map<String, Object>> requisitions = new ArrayList<>();
        
        requisitions.add(createMockRequisition(1L, "REQ-2025-001", "የቢሮ እቃዎች ግዢ", "IT Department", "PENDING", 45000.0, "አሊ አህመድ"));
        requisitions.add(createMockRequisition(2L, "REQ-2025-002", "የግንባታ ቁሳቁሶች", "Construction", "APPROVED", 120000.0, "ፍቅሩ ተስፋዬ"));
        requisitions.add(createMockRequisition(3L, "REQ-2025-003", "የመኪና ምን ዘይት", "Fleet Management", "SUBMITTED", 25000.0, "ዳንኤል ገብሬ"));
        requisitions.add(createMockRequisition(4L, "REQ-2025-004", "የኮምፒውተር ሃርድዌር", "IT Department", "PENDING", 85000.0, "ሳራ መንግስቱ"));
        requisitions.add(createMockRequisition(5L, "REQ-2025-005", "የጽህፈት ቤት እቃዎች", "Administration", "APPROVED", 15000.0, "በሉ ወርቁ"));
        
        Map<String, Object> response = new HashMap<>();
        response.put("requisitions", requisitions);
        response.put("total", requisitions.size());
        response.put("page", page);
        response.put("limit", limit);
        
        return ResponseEntity.ok(response);
    }

    // Suppliers (delegated to existing supplier service)
    @GetMapping("/suppliers")
    public ResponseEntity<Map<String, Object>> getSuppliers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search) {
        
        log.info("Getting suppliers via purchase API - page: {}, limit: {}, search: {}", page, limit, search);
        
        try {
            Sort sort = Sort.by("name").ascending();
            Pageable pageable = PageRequest.of(page, limit, sort);
            Page<Supplier> suppliersPage = supplierService.findAll(pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("suppliers", suppliersPage.getContent());
            response.put("total", suppliersPage.getTotalElements());
            response.put("page", page);
            response.put("limit", limit);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting suppliers: {}", e.getMessage());
            
            // Fallback to mock data if service fails
            List<Map<String, Object>> suppliers = new ArrayList<>();
            suppliers.add(createMockSupplier(1L, "SUP-001", "ሰላም ግንባታ ድርጅት", "construction@selam.et", "ACTIVE"));
            suppliers.add(createMockSupplier(2L, "SUP-002", "አዲስ አበባ ንግድ ማህበር", "info@addistrade.et", "ACTIVE"));
            suppliers.add(createMockSupplier(3L, "SUP-003", "ሃበሻ መሳሪያ አቅራቢ", "sales@habeshatools.et", "ACTIVE"));
            suppliers.add(createMockSupplier(4L, "SUP-004", "ኢትዮ ቴክ ሶሉሽንስ", "contact@ethiotech.et", "ACTIVE"));
            suppliers.add(createMockSupplier(5L, "SUP-005", "የኢትዮጵያ መንግስት ጽ/ቤት", "procurement@gov.et", "ACTIVE"));
            
            Map<String, Object> response = new HashMap<>();
            response.put("suppliers", suppliers);
            response.put("total", suppliers.size());
            response.put("page", page);
            response.put("limit", limit);
            
            return ResponseEntity.ok(response);
        }
    }

    // Goods Received Vouchers (GRV)
    @GetMapping("/grv")
    public ResponseEntity<Map<String, Object>> getGoodsReceivedVouchers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        
        log.info("Getting GRVs - page: {}, limit: {}, search: {}, status: {}", page, limit, search, status);
        
        // Mock data for now
        List<Map<String, Object>> grvs = new ArrayList<>();
        
        grvs.add(createMockGRV(1L, "GRV-2025-001", "PO-2025-001", "ሰላም ግንባታ ድርጅት", "RECEIVED", 150000.0));
        grvs.add(createMockGRV(2L, "GRV-2025-002", "PO-2025-002", "አዲስ አበባ ንግድ ማህበር", "PENDING", 275000.0));
        grvs.add(createMockGRV(3L, "GRV-2025-003", "PO-2025-003", "ሃበሻ መሳሪያ አቅራቢ", "RECEIVED", 89500.0));
        grvs.add(createMockGRV(4L, "GRV-2025-004", "PO-2025-004", "ኢትዮ ቴክ ሶሉሽንስ", "PARTIAL", 320000.0));
        
        Map<String, Object> response = new HashMap<>();
        response.put("grvs", grvs);
        response.put("total", grvs.size());
        response.put("page", page);
        response.put("limit", limit);
        
        return ResponseEntity.ok(response);
    }

    // Dashboard Data
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        log.info("Getting purchase dashboard data");
        
        Map<String, Object> dashboard = new HashMap<>();
        
        // Statistics
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalOrders", 45);
        stats.put("pendingOrders", 12);
        stats.put("approvedOrders", 28);
        stats.put("deliveredOrders", 5);
        stats.put("totalValue", 2450000.0);
        stats.put("averageOrderValue", 54444.44);
        
        // Recent Activity
        List<Map<String, Object>> recentActivity = new ArrayList<>();
        recentActivity.add(createActivity("Purchase Order PO-2025-005 approved", "2 hours ago"));
        recentActivity.add(createActivity("Requisition REQ-2025-004 submitted", "4 hours ago"));
        recentActivity.add(createActivity("GRV-2025-003 goods received", "6 hours ago"));
        recentActivity.add(createActivity("Supplier ሃበሻ መሳሪያ አቅራቢ updated", "1 day ago"));
        
        // Pending Approvals
        List<Map<String, Object>> pendingApprovals = new ArrayList<>();
        pendingApprovals.add(createPendingApproval("REQ-2025-001", "የቢሮ እቃዎች ግዢ", 45000.0));
        pendingApprovals.add(createPendingApproval("REQ-2025-004", "የኮምፒውተር ሃርድዌር", 85000.0));
        pendingApprovals.add(createPendingApproval("PO-2025-001", "ሰላም ግንባታ ድርጅት", 150000.0));
        
        dashboard.put("statistics", stats);
        dashboard.put("recentActivity", recentActivity);
        dashboard.put("pendingApprovals", pendingApprovals);
        
        return ResponseEntity.ok(dashboard);
    }

    // Helper methods for creating mock data
    private Map<String, Object> createMockPurchaseOrder(Long id, String orderNumber, String supplier, String status, Double amount, String date) {
        Map<String, Object> order = new HashMap<>();
        order.put("id", id);
        order.put("orderNumber", orderNumber);
        order.put("supplier", supplier);
        order.put("status", status);
        order.put("totalAmount", amount);
        order.put("orderDate", date);
        order.put("deliveryDate", date);
        order.put("items", 3);
        return order;
    }

    private Map<String, Object> createMockRequisition(Long id, String reqNumber, String description, String department, String status, Double amount, String requester) {
        Map<String, Object> req = new HashMap<>();
        req.put("id", id);
        req.put("requisitionNumber", reqNumber);
        req.put("description", description);
        req.put("department", department);
        req.put("status", status);
        req.put("totalAmount", amount);
        req.put("requestedBy", requester);
        req.put("requestDate", "2025-01-20");
        req.put("priority", "MEDIUM");
        return req;
    }

    private Map<String, Object> createMockSupplier(Long id, String code, String name, String email, String status) {
        Map<String, Object> supplier = new HashMap<>();
        supplier.put("id", id);
        supplier.put("code", code);
        supplier.put("name", name);
        supplier.put("email", email);
        supplier.put("status", status);
        supplier.put("phone", "+251-11-123-4567");
        supplier.put("region", "Addis Ababa");
        return supplier;
    }

    private Map<String, Object> createMockGRV(Long id, String grvNumber, String poNumber, String supplier, String status, Double amount) {
        Map<String, Object> grv = new HashMap<>();
        grv.put("id", id);
        grv.put("grvNumber", grvNumber);
        grv.put("purchaseOrderNumber", poNumber);
        grv.put("supplier", supplier);
        grv.put("status", status);
        grv.put("totalAmount", amount);
        grv.put("receivedDate", "2025-01-22");
        grv.put("receivedBy", "አለም ፍቅሩ");
        return grv;
    }

    private Map<String, Object> createActivity(String description, String time) {
        Map<String, Object> activity = new HashMap<>();
        activity.put("description", description);
        activity.put("time", time);
        return activity;
    }

    private Map<String, Object> createPendingApproval(String number, String description, Double amount) {
        Map<String, Object> approval = new HashMap<>();
        approval.put("number", number);
        approval.put("description", description);
        approval.put("amount", amount);
        return approval;
    }
}
