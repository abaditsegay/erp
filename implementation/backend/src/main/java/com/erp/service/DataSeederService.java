package com.erp.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.entity.Customer;
import com.erp.entity.Product;
import com.erp.entity.Quotation;
import com.erp.entity.QuotationLine;
import com.erp.entity.SalesOrder;
import com.erp.entity.SalesOrderLine;
import com.erp.entity.Shipment;
import com.erp.entity.ShipmentEvent;
import com.erp.entity.Supplier;
import com.erp.entity.UnitOfMeasure;
import com.erp.entity.Warehouse;
import com.erp.repository.CustomerRepository;
import com.erp.repository.ProductRepository;
import com.erp.repository.QuotationRepository;
import com.erp.repository.SalesOrderRepository;
import com.erp.repository.ShipmentRepository;
import com.erp.repository.ShipmentEventRepository;
import com.erp.repository.SupplierRepository;
import com.erp.repository.UnitOfMeasureRepository;
import com.erp.repository.WarehouseRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * Service to seed the database with comprehensive realistic Ethiopian business data
 */
@Service
@Slf4j
@Transactional
public class DataSeederService {

    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private SupplierRepository supplierRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private WarehouseRepository warehouseRepository;
    
    @Autowired
    private UnitOfMeasureRepository unitOfMeasureRepository;
    
    @Autowired
    private QuotationRepository quotationRepository;
    
    @Autowired
    private SalesOrderRepository salesOrderRepository;
    
    @Autowired
    private ShipmentRepository shipmentRepository;
    
    @Autowired
    private ShipmentEventRepository shipmentEventRepository;

    private final Random random = new Random();

    // Commented out @PostConstruct to prevent automatic seeding
    // @PostConstruct
    @Transactional
    public void seedDatabase() {
        log.info("Starting comprehensive data seeding for Ethiopian ERP system...");
        
        // Check if data already exists
        if (customerRepository.count() > 10) {
            log.info("Database already contains data. Skipping seeding.");
            return;
        }
        
        try {
            seedUnitsOfMeasure();
            seedWarehouses();
            seedCustomers();
            seedSuppliers();
            seedProducts();
            seedQuotations();
            seedSalesOrders();
            seedShipments();
            
            log.info("Database seeding completed successfully!");
        } catch (Exception e) {
            log.error("Error during database seeding: ", e);
            throw e;
        }
    }

    private void seedUnitsOfMeasure() {
        log.info("Seeding units of measure...");
        
        List<UnitOfMeasure> units = Arrays.asList(
            createUnitOfMeasure("PC", "Piece", "Individual piece or item"),
            createUnitOfMeasure("KG", "Kilogram", "Weight measurement in kilograms"),
            createUnitOfMeasure("M", "Meter", "Length measurement in meters"),
            createUnitOfMeasure("L", "Liter", "Volume measurement in liters"),
            createUnitOfMeasure("M2", "Square Meter", "Area measurement"),
            createUnitOfMeasure("M3", "Cubic Meter", "Volume measurement"),
            createUnitOfMeasure("TON", "Metric Ton", "Weight measurement - 1000 kg"),
            createUnitOfMeasure("CTN", "Carton", "Packaging unit - carton"),
            createUnitOfMeasure("PLT", "Pallet", "Packaging unit - pallet"),
            createUnitOfMeasure("SET", "Set", "Complete set of items")
        );
        
        unitOfMeasureRepository.saveAll(units);
        log.info("Seeded {} units of measure", units.size());
    }

    private void seedWarehouses() {
        log.info("Seeding warehouses...");
        
        List<Warehouse> warehouses = Arrays.asList(
            createWarehouse("WH-AA-001", "Addis Ababa Main Warehouse", "Bole", "Addis Ababa", 
                          "Central distribution hub for Addis Ababa region", 5000.0, true, false),
            createWarehouse("WH-AA-002", "Bole International Warehouse", "Bole", "Addis Ababa", 
                          "Import/Export warehouse near airport", 3000.0, true, true),
            createWarehouse("WH-OR-001", "Adama Regional Warehouse", "Adama", "Oromia", 
                          "Regional distribution center for Oromia", 2500.0, false, false),
            createWarehouse("WH-AM-001", "Bahir Dar Warehouse", "Bahir Dar", "Amhara", 
                          "Northern region distribution center", 2000.0, false, false),
            createWarehouse("WH-TG-001", "Mekelle Warehouse", "Mekelle", "Tigray", 
                          "Northern distribution center", 1800.0, false, false),
            createWarehouse("WH-DR-001", "Dire Dawa Warehouse", "Dire Dawa", "Dire Dawa", 
                          "Eastern region distribution center", 1500.0, false, false)
        );
        
        warehouseRepository.saveAll(warehouses);
        log.info("Seeded {} warehouses", warehouses.size());
    }

    private void seedCustomers() {
        log.info("Seeding Ethiopian customers...");
        
        List<Customer> customers = Arrays.asList(
            // Business Customers
            createBusinessCustomer("CUST-001", "Dashen Bank S.C.", "ዳሽን ባንክ", "Ato Girma Asmerom", 
                                 "Addis Ababa", "Kirkos", "08", "finance@dashenbank.com", "BUSINESS"),
            createBusinessCustomer("CUST-002", "Ethiopian Airlines", "የኢትዮጵያ አየር መንገድ", "W/ro Meaza Ashenafi", 
                                 "Addis Ababa", "Bole", "17", "procurement@ethiopianairlines.com", "BUSINESS"),
            createBusinessCustomer("CUST-003", "Awash Bank S.C.", "አዋሽ ባንክ", "Ato Solomon Desta", 
                                 "Addis Ababa", "Arada", "01", "purchasing@awashbank.com", "BUSINESS"),
            createBusinessCustomer("CUST-004", "Dangote Cement Ethiopia", "ዳንጎቴ ሲሚንቶ ኢትዮጵያ", "Mr. Ahmed Hassan", 
                                 "Oromia", "Mugher", "01", "supply@dangote-cement.et", "BUSINESS"),
            createBusinessCustomer("CUST-005", "Habesha Brewery S.C.", "ሀበሻ ቢራ ፋብሪካ", "Ato Bekele Molla", 
                                 "Oromia", "Sebeta", "02", "procurement@habeshabrewery.com", "BUSINESS"),
            
            // Government Customers
            createGovernmentCustomer("GOVT-001", "Ministry of Health", "የጤና ሚኒስቴር", "Dr. Lia Tadesse", 
                                   "Addis Ababa", "Gulele", "03", "procurement@moh.gov.et"),
            createGovernmentCustomer("GOVT-002", "Ethiopian Road Authority", "የኢትዮጵያ መንገድ ባለስልጣን", "Eng. Samson Wondimu", 
                                   "Addis Ababa", "Addis Ketema", "05", "supply@era.gov.et"),
            createGovernmentCustomer("GOVT-003", "Addis Ababa City Administration", "አዲስ አበባ ከተማ አስተዳደር", "Mayor Adanech Abebe", 
                                   "Addis Ababa", "Kirkos", "04", "procurement@addisababa.gov.et"),
            
            // NGO Customers  
            createNGOCustomer("NGO-001", "World Vision Ethiopia", "ወርልድ ቪዥን ኢትዮጵያ", "Mr. John Smith", 
                            "Addis Ababa", "Bole", "12", "procurement@wvi.org"),
            createNGOCustomer("NGO-002", "Save the Children Ethiopia", "ህፃናትን አስጠብቅ ኢትዮጵያ", "Ms. Sarah Johnson", 
                            "Addis Ababa", "Arada", "07", "finance@savechildren.org.et"),
            
            // Individual Customers
            createIndividualCustomer("IND-001", "Ato Alemayehu Bekele", "አቶ አለማየሁ በቀለ", "Addis Ababa", "Yeka", "06"),
            createIndividualCustomer("IND-002", "W/ro Hanan Mohammed", "ወ/ሮ ሐናን መሐመድ", "Addis Ababa", "Nifas Silk", "09"),
            createIndividualCustomer("IND-003", "Dr. Yonas Dereje", "ዶ/ር ዮናስ ደረጀ", "Oromia", "Adama", "02")
        );
        
        customerRepository.saveAll(customers);
        log.info("Seeded {} customers", customers.size());
    }

    private void seedSuppliers() {
        log.info("Seeding suppliers...");
        
        List<Supplier> suppliers = Arrays.asList(
            createSupplier("SUP-001", "Moha Soft Drinks Industry", "ato.moha@mohaethiopia.com", 
                         "Industrial area, Addis Ababa", "+251-11-618-2000"),
            createSupplier("SUP-002", "East African Bottling S.C.", "procurement@coca-cola.et", 
                         "Akaki, Addis Ababa", "+251-11-433-8888"),
            createSupplier("SUP-003", "BGI Ethiopia", "supply@bgiethiopia.com", 
                         "Kilinto, Addis Ababa", "+251-11-629-1000"),
            createSupplier("SUP-004", "Gonder Textile Factory", "sales@gondertextile.com", 
                         "Gonder, Amhara", "+251-58-111-2345"),
            createSupplier("SUP-005", "Dire Dawa Textile Factory", "marketing@ddtextile.et", 
                         "Dire Dawa, Dire Dawa", "+251-25-111-3456"),
            createSupplier("SUP-006", "Ethiopian Cement Corporation", "sales@ethiopiancements.com", 
                         "Dire Dawa, Dire Dawa", "+251-25-111-4567"),
            createSupplier("SUP-007", "Kaliti Metal Products", "info@kalitimetal.com", 
                         "Kaliti, Addis Ababa", "+251-11-418-5555"),
            createSupplier("SUP-008", "MIDROC Technology Group", "procurement@midroc.et", 
                         "Bole, Addis Ababa", "+251-11-662-7000")
        );
        
        supplierRepository.saveAll(suppliers);
        log.info("Seeded {} suppliers", suppliers.size());
    }

    private void seedProducts() {
        log.info("Seeding products...");
        
        UnitOfMeasure pieceUnit = unitOfMeasureRepository.findByCode("PC").orElse(null);
        UnitOfMeasure kgUnit = unitOfMeasureRepository.findByCode("KG").orElse(null);
        UnitOfMeasure literUnit = unitOfMeasureRepository.findByCode("L").orElse(null);
        UnitOfMeasure meterUnit = unitOfMeasureRepository.findByCode("M").orElse(null);
        UnitOfMeasure cartonUnit = unitOfMeasureRepository.findByCode("CTN").orElse(null);
        
        List<Product> products = Arrays.asList(
            // Beverages
            createProduct("PRD-001", "St. George Beer 500ml", "ቅዱስ ጊዮርጊስ ቢራ", "BGI Ethiopia", 
                        "Premium Ethiopian lager beer", "Beverages", new BigDecimal("45.00"), pieceUnit),
            createProduct("PRD-002", "Coca-Cola 350ml", "ኮካ ኮላ", "East African Bottling", 
                        "Classic Coca-Cola soft drink", "Beverages", new BigDecimal("18.00"), pieceUnit),
            createProduct("PRD-003", "Ambo Mineral Water 500ml", "አምቦ ውሃ", "Moha Soft Drinks", 
                        "Natural mineral water from Ambo", "Beverages", new BigDecimal("8.00"), pieceUnit),
            
            // Textiles
            createProduct("PRD-004", "Cotton Fabric - White", "ጥጥ ጨርቅ - ነጭ", "Gonder Textile", 
                        "100% cotton fabric for clothing", "Textiles", new BigDecimal("180.00"), meterUnit),
            createProduct("PRD-005", "Traditional Habesha Kemis", "ባህላዊ ሐበሻ ቀሚስ", "Dire Dawa Textile", 
                        "Traditional Ethiopian women's dress", "Textiles", new BigDecimal("2500.00"), pieceUnit),
            
            // Construction Materials
            createProduct("PRD-006", "Portland Cement 50kg", "ፖርትላንድ ሲሚንቶ", "Ethiopian Cement Corp", 
                        "High quality Portland cement", "Construction", new BigDecimal("580.00"), kgUnit),
            createProduct("PRD-007", "Steel Rebar 12mm", "የብረት መደገፊያ", "Kaliti Metal", 
                        "Construction steel reinforcement bar", "Construction", new BigDecimal("45.00"), meterUnit),
            
            // Electronics
            createProduct("PRD-008", "Samsung Galaxy A54", "ሳምሰንግ ጋላክሲ", "MIDROC Technology", 
                        "Android smartphone with 128GB storage", "Electronics", new BigDecimal("18500.00"), pieceUnit),
            createProduct("PRD-009", "HP Laptop ProBook", "ኤችፒ ላፕቶፕ", "MIDROC Technology", 
                        "Business laptop with Intel Core i5", "Electronics", new BigDecimal("45000.00"), pieceUnit),
            
            // Food Products  
            createProduct("PRD-010", "Berbere Spice Mix 500g", "በርበሬ ቅመም", "Local Spice Co", 
                        "Traditional Ethiopian spice blend", "Food", new BigDecimal("125.00"), kgUnit),
            createProduct("PRD-011", "Teff Flour 1kg", "ጤፍ ዱቄት", "Teff Processing Co", 
                        "High quality teff flour for injera", "Food", new BigDecimal("85.00"), kgUnit),
            createProduct("PRD-012", "Ethiopian Coffee Beans 1kg", "የኢትዮጵያ ቡና", "Coffee Export Union", 
                        "Premium Sidamo coffee beans", "Food", new BigDecimal("450.00"), kgUnit)
        );
        
        productRepository.saveAll(products);
        log.info("Seeded {} products", products.size());
    }

    private void seedQuotations() {
        log.info("Seeding quotations...");
        
        List<Customer> customers = customerRepository.findAll();
        List<Product> products = productRepository.findAll();
        
        if (customers.isEmpty() || products.isEmpty()) {
            log.warn("No customers or products found. Skipping quotation seeding.");
            return;
        }
        
        // Create realistic quotations
        for (int i = 1; i <= 15; i++) {
            Customer customer = customers.get(random.nextInt(customers.size()));
            
            Quotation quotation = Quotation.builder()
                .quotationNumber(String.format("QT-2024-%04d", i))
                .quotationDate(LocalDate.now().minusDays(random.nextInt(90)))
                .validUntil(LocalDate.now().plusDays(random.nextInt(30) + 15))
                .customer(customer)
                .status(getRandomQuotationStatus())
                .priority(getRandomPriority())
                .paymentTerms(getRandomPaymentTerms())
                .vatRate(new BigDecimal("0.15")) // 15% VAT in Ethiopia
                .languagePreference(customer.getLanguagePreference())
                .preparedBy("Sales Team")
                .notes("Generated quotation for " + customer.getName())
                .build();
            
            quotation = quotationRepository.save(quotation);
            
            // Add quotation lines
            int lineCount = random.nextInt(5) + 1; // 1-5 lines
            BigDecimal subtotal = BigDecimal.ZERO;
            
            for (int j = 1; j <= lineCount; j++) {
                Product product = products.get(random.nextInt(products.size()));
                BigDecimal quantity = new BigDecimal(random.nextInt(50) + 1);
                BigDecimal unitPrice = product.getUnitPrice();
                BigDecimal lineTotal = quantity.multiply(unitPrice);
                
                QuotationLine line = QuotationLine.builder()
                    .quotation(quotation)
                    .product(product)
                    .productName(product.getName())
                    .productCode(product.getCode())
                    .quantity(quantity)
                    .unitPrice(unitPrice)
                    .lineTotal(lineTotal)
                    .vatRate(new BigDecimal("0.15"))
                    .vatAmount(lineTotal.multiply(new BigDecimal("0.15")))
                    .lineTotal(lineTotal)
                    .unitOfMeasure("PC")
                    .build();
                
                quotation.getQuotationLines().add(line);
                subtotal = subtotal.add(lineTotal);
            }
            
            // Update totals
            BigDecimal vatAmount = subtotal.multiply(new BigDecimal("0.15"));
            quotation.setSubtotal(subtotal);
            quotation.setVatAmount(vatAmount);
            quotation.setTotalAmount(subtotal.add(vatAmount));
            
            quotationRepository.save(quotation);
        }
        
        log.info("Seeded quotations");
    }

    private void seedSalesOrders() {
        log.info("Seeding sales orders...");
        
        List<Customer> customers = customerRepository.findAll();
        List<Product> products = productRepository.findAll();
        
        if (customers.isEmpty() || products.isEmpty()) {
            log.warn("No customers or products found. Skipping sales order seeding.");
            return;
        }
        
        // Create realistic sales orders
        for (int i = 1; i <= 20; i++) {
            Customer customer = customers.get(random.nextInt(customers.size()));
            
            SalesOrder salesOrder = SalesOrder.builder()
                .orderNumber(String.format("SO-2024-%04d", i))
                .orderDate(LocalDate.now().minusDays(random.nextInt(60)))
                .customer(customer)
                .status(getRandomSalesOrderStatus())
                .priority(getRandomSalesOrderPriority())
                .paymentTerms(getRandomSalesOrderPaymentTerms())
                .paymentMethod(getRandomPaymentMethod())
                .vatRate(new BigDecimal("0.15"))
                .languagePreference(customer.getLanguagePreference())
                .salesRepresentative("Sales Rep " + (random.nextInt(5) + 1))
                .deliveryAddress(customer.getAddress())
                .deliveryRegion(customer.getRegion())
                .deliveryZone(customer.getZone())
                .deliveryWoreda(customer.getWoreda())
                .expectedDeliveryDate(LocalDate.now().plusDays(random.nextInt(30) + 7))
                .notes("Sales order for " + customer.getName())
                .build();
            
            salesOrder = salesOrderRepository.save(salesOrder);
            
            // Add sales order lines
            int lineCount = random.nextInt(4) + 1; // 1-4 lines
            BigDecimal subtotal = BigDecimal.ZERO;
            
            for (int j = 1; j <= lineCount; j++) {
                Product product = products.get(random.nextInt(products.size()));
                BigDecimal quantity = new BigDecimal(random.nextInt(100) + 1);
                BigDecimal unitPrice = product.getUnitPrice();
                BigDecimal lineTotal = quantity.multiply(unitPrice);
                
                BigDecimal deliveredQty = salesOrder.getStatus().toString().contains("DELIVERED") ? 
                                     quantity : new BigDecimal(random.nextInt(quantity.intValue() + 1));
                
                SalesOrderLine line = SalesOrderLine.builder()
                    .salesOrder(salesOrder)
                    .product(product)
                    .productName(product.getName())
                    .productCode(product.getCode())
                    .quantity(quantity)
                    .unitPrice(unitPrice)
                    .lineTotal(lineTotal)
                    .vatRate(new BigDecimal("0.15"))
                    .vatAmount(lineTotal.multiply(new BigDecimal("0.15")))
                    .unitOfMeasure("PC")
                    .deliveredQuantity(deliveredQty)
                    .remainingQuantity(quantity.subtract(deliveredQty))
                    .build();
                
                salesOrder.getSalesOrderLines().add(line);
                subtotal = subtotal.add(lineTotal);
            }
            
            // Update totals
            BigDecimal vatAmount = subtotal.multiply(new BigDecimal("0.15"));
            salesOrder.setSubtotal(subtotal);
            salesOrder.setVatAmount(vatAmount);
            salesOrder.setTotalAmount(subtotal.add(vatAmount));
            
            salesOrderRepository.save(salesOrder);
        }
        
        log.info("Seeded sales orders");
    }

    private void seedShipments() {
        log.info("Seeding shipments...");
        
        String[] origins = {"Addis Ababa", "Dire Dawa", "Adama", "Bahir Dar", "Mekelle"};
        String[] destinations = {"Jimma", "Hawassa", "Dessie", "Gondar", "Harar", "Shashamene", "Debre Markos"};
        String[] carriers = {"DHL Ethiopia", "Comet Logistics", "Trans Ethiopia", "Express Transit", "Nile Logistics"};
        String[] customsAgents = {"Ethio Customs Agent", "AA Customs Services", "Bole Clearing Agent", "Professional Customs"};
        
        for (int i = 1; i <= 50; i++) {
            String origin = origins[random.nextInt(origins.length)];
            String destination = destinations[random.nextInt(destinations.length)];
            
            Shipment shipment = Shipment.builder()
                .trackingNumber(String.format("TRK%08d", 1000000 + i))
                .description(getRandomShipmentDescription())
                .origin(origin)
                .destination(destination)
                .status(getRandomShipmentStatus())
                .mode(getRandomTransportMode())
                .priority(getRandomShipmentPriority())
                .carrier(carriers[random.nextInt(carriers.length)])
                .weightKg(new BigDecimal(random.nextInt(5000) + 10))
                .volumeCbm(new BigDecimal(random.nextInt(100) + 1))
                .currency("ETB")
                .customsValue(new BigDecimal(random.nextInt(500000) + 10000))
                .dutyAmount(new BigDecimal(random.nextInt(50000) + 1000))
                .vatAmount(new BigDecimal(random.nextInt(30000) + 500))
                .totalTaxes(new BigDecimal(random.nextInt(80000) + 1500))
                .createdDate(LocalDateTime.now().minusDays(random.nextInt(90)))
                .pickupDate(LocalDateTime.now().minusDays(random.nextInt(80)))
                .estimatedDelivery(LocalDateTime.now().plusDays(random.nextInt(30) + 1))
                .customsDeclarationNumber(String.format("CD-%d-%06d", 2024, random.nextInt(999999)))
                .portOfEntry(random.nextBoolean() ? "Bole International Airport" : "Djibouti Port")
                .customsAgent(customsAgents[random.nextInt(customsAgents.length)])
                .tinNumber(String.format("TIN%010d", random.nextInt(1000000000)))
                .importerName("Importer Company " + (random.nextInt(20) + 1))
                .isInternational(random.nextBoolean())
                .requiresCustoms(random.nextBoolean())
                .isTemperatureControlled(random.nextBoolean())
                .specialInstructions(getRandomSpecialInstructions())
                .build();
            
            shipment = shipmentRepository.save(shipment);
            
            // Add shipment events
            addShipmentEvents(shipment);
        }
        
        log.info("Seeded shipments");
    }

    private void addShipmentEvents(Shipment shipment) {
        List<String> eventTypes = Arrays.asList(
            "SHIPMENT_CREATED", "PICKED_UP", "DEPARTED_ORIGIN", "IN_TRANSIT", 
            "CUSTOMS_SUBMITTED", "CUSTOMS_CLEARED", "OUT_FOR_DELIVERY", "DELIVERED"
        );
        
        String[] locations = {"Addis Ababa Hub", "Bole Airport", "Customs Office", "Delivery Center", "Customer Location"};
        
        int eventCount = Math.min(eventTypes.size(), random.nextInt(6) + 2); // 2-6 events
        
        for (int i = 0; i < eventCount; i++) {
            String eventType = eventTypes.get(i);
            String location = locations[random.nextInt(locations.length)];
            
            ShipmentEvent event = ShipmentEvent.builder()
                .shipment(shipment)
                .eventType(eventType)
                .location(location)
                .description(getEventDescription(eventType, location))
                .eventTimestamp(shipment.getCreatedDate().plusHours(i * 6 + random.nextInt(4)))
                .createdBy("System")
                .isMilestone(Arrays.asList("PICKED_UP", "CUSTOMS_CLEARED", "DELIVERED").contains(eventType))
                .build();
            
            shipmentEventRepository.save(event);
        }
    }

    // Helper methods for creating entities
    private UnitOfMeasure createUnitOfMeasure(String code, String name, String description) {
        return UnitOfMeasure.builder()
            .code(code)
            .name(name)
            .description(description)
            .active(true)
            .build();
    }

    private Warehouse createWarehouse(String code, String name, String city, String region, 
                                    String description, Double capacity, Boolean hasRefrigeration, Boolean hasSecurity) {
        return Warehouse.builder()
            .warehouseCode(code)
            .warehouseName(name)
            .city(city)
            .region(region)
            .description(description)
            .capacityCubicMeter(capacity)
            .isRefrigerated(hasRefrigeration)
            .hasSecurity(hasSecurity)
            .isActive(true)
            .warehouseType(Warehouse.WarehouseType.MAIN_WAREHOUSE)
            .build();
    }

    private Customer createBusinessCustomer(String code, String name, String nameAmharic, String contactPerson,
                                          String region, String woreda, String kebele, String email, String type) {
        return Customer.builder()
            .code(code)
            .name(name)
            .nameAmharic(nameAmharic)
            .contactPerson(contactPerson)
            .email(email)
            .phone("+251-11-" + (1000000 + random.nextInt(9000000)))
            .region(region)
            .woreda(woreda)
            .kebele(kebele)
            .customerType(Customer.CustomerType.valueOf(type))
            .businessType(Customer.BusinessType.SHARE_COMPANY)
            .vatRegistered(true)
            .tinNumber("TIN" + String.format("%010d", random.nextInt(1000000000)))
            .vatNumber("VAT" + String.format("%010d", random.nextInt(1000000000)))
            .creditLimit(new BigDecimal(random.nextInt(1000000) + 100000))
            .creditDays(30)
            .paymentTerms(Customer.PaymentTerms.NET_30)
            .languagePreference("en")
            .active(true)
            .approved(true)
            .customerSince(LocalDate.now().minusDays(random.nextInt(1000)))
            .build();
    }

    private Customer createGovernmentCustomer(String code, String name, String nameAmharic, String contactPerson,
                                            String region, String woreda, String kebele, String email) {
        return Customer.builder()
            .code(code)
            .name(name)
            .nameAmharic(nameAmharic)
            .contactPerson(contactPerson)
            .email(email)
            .phone("+251-11-" + (1000000 + random.nextInt(9000000)))
            .region(region)
            .woreda(woreda)
            .kebele(kebele)
            .customerType(Customer.CustomerType.GOVERNMENT)
            .businessType(Customer.BusinessType.PUBLIC_ENTERPRISE)
            .vatRegistered(false) // Government entities often exempt
            .creditLimit(new BigDecimal(random.nextInt(5000000) + 500000))
            .creditDays(45)
            .paymentTerms(Customer.PaymentTerms.NET_45)
            .languagePreference("en")
            .active(true)
            .approved(true)
            .customerSince(LocalDate.now().minusDays(random.nextInt(1000)))
            .build();
    }

    private Customer createNGOCustomer(String code, String name, String nameAmharic, String contactPerson,
                                     String region, String woreda, String kebele, String email) {
        return Customer.builder()
            .code(code)
            .name(name)
            .nameAmharic(nameAmharic)
            .contactPerson(contactPerson)
            .email(email)
            .phone("+251-11-" + (1000000 + random.nextInt(9000000)))
            .region(region)
            .woreda(woreda)
            .kebele(kebele)
            .customerType(Customer.CustomerType.NGO)
            .businessType(Customer.BusinessType.ASSOCIATION)
            .vatRegistered(false) // NGOs often exempt
            .creditLimit(new BigDecimal(random.nextInt(2000000) + 200000))
            .creditDays(30)
            .paymentTerms(Customer.PaymentTerms.NET_30)
            .languagePreference("en")
            .active(true)
            .approved(true)
            .customerSince(LocalDate.now().minusDays(random.nextInt(1000)))
            .build();
    }

    private Customer createIndividualCustomer(String code, String name, String nameAmharic, 
                                            String region, String woreda, String kebele) {
        return Customer.builder()
            .code(code)
            .name(name)
            .nameAmharic(nameAmharic)
            .phone("+251-9" + String.format("%08d", random.nextInt(100000000)))
            .region(region)
            .woreda(woreda)
            .kebele(kebele)
            .customerType(Customer.CustomerType.INDIVIDUAL)
            .vatRegistered(false)
            .creditLimit(new BigDecimal(50000))
            .creditDays(15)
            .paymentTerms(Customer.PaymentTerms.CASH)
            .languagePreference("am")
            .active(true)
            .approved(true)
            .customerSince(LocalDate.now().minusDays(random.nextInt(500)))
            .build();
    }

    private Supplier createSupplier(String code, String name, String email, String address, String phone) {
        return Supplier.builder()
            .code(code)
            .name(name)
            .email(email)
            .address(address)
            .phone(phone)
            .contactPerson("Procurement Manager")
            .active(true)
            .build();
    }

    private Product createProduct(String code, String name, String nameAmharic, String manufacturer,
                                String description, String category, BigDecimal unitPrice, UnitOfMeasure unit) {
        return Product.builder()
            .code(code)
            .name(name)
            .nameAmharic(nameAmharic)
            .manufacturer(manufacturer)
            .description(description)
            .category(category)
            .unitPrice(unitPrice)
            .costPrice(unitPrice.multiply(new BigDecimal("0.7"))) // 30% margin
            .unitOfMeasure(unit != null ? unit.getCode() : "PC")
            .currentStock(random.nextInt(1000) + 50)
            .minimumStockLevel(20)
            .reorderLevel(50)
            .taxable(true)
            .taxRate(new BigDecimal("15.0"))
            .active(true)
            .countryOfOrigin("Ethiopia")
            .leadTimeDays(random.nextInt(30) + 5)
            .shelfLifeMonths(random.nextInt(24) + 6)
            .warrantyMonths(random.nextInt(12) + 1)
            .weight(new BigDecimal(random.nextInt(50) + 1))
            .volume(new BigDecimal("0." + String.format("%03d", random.nextInt(1000))))
            .build();
    }

    // Helper methods for random values
    private Quotation.QuotationStatus getRandomQuotationStatus() {
        Quotation.QuotationStatus[] statuses = Quotation.QuotationStatus.values();
        return statuses[random.nextInt(statuses.length)];
    }

    private Quotation.QuotationPriority getRandomPriority() {
        Quotation.QuotationPriority[] priorities = Quotation.QuotationPriority.values();
        return priorities[random.nextInt(priorities.length)];
    }

    private SalesOrder.PaymentTerms getRandomPaymentTerms() {
        SalesOrder.PaymentTerms[] terms = SalesOrder.PaymentTerms.values();
        return terms[random.nextInt(terms.length)];
    }

    private SalesOrder.SalesOrderStatus getRandomSalesOrderStatus() {
        SalesOrder.SalesOrderStatus[] statuses = SalesOrder.SalesOrderStatus.values();
        return statuses[random.nextInt(statuses.length)];
    }

    private SalesOrder.OrderPriority getRandomSalesOrderPriority() {
        SalesOrder.OrderPriority[] priorities = SalesOrder.OrderPriority.values();
        return priorities[random.nextInt(priorities.length)];
    }

    private SalesOrder.PaymentTerms getRandomSalesOrderPaymentTerms() {
        SalesOrder.PaymentTerms[] terms = SalesOrder.PaymentTerms.values();
        return terms[random.nextInt(terms.length)];
    }

    private SalesOrder.PaymentMethod getRandomPaymentMethod() {
        SalesOrder.PaymentMethod[] methods = SalesOrder.PaymentMethod.values();
        return methods[random.nextInt(methods.length)];
    }

    private Shipment.ShipmentStatus getRandomShipmentStatus() {
        Shipment.ShipmentStatus[] statuses = Shipment.ShipmentStatus.values();
        return statuses[random.nextInt(statuses.length)];
    }

    private Shipment.TransportMode getRandomTransportMode() {
        Shipment.TransportMode[] modes = Shipment.TransportMode.values();
        return modes[random.nextInt(modes.length)];
    }

    private Shipment.Priority getRandomShipmentPriority() {
        Shipment.Priority[] priorities = Shipment.Priority.values();
        return priorities[random.nextInt(priorities.length)];
    }

    private String getRandomShipmentDescription() {
        String[] descriptions = {
            "Electronics and Computer Equipment",
            "Textile and Clothing Materials", 
            "Food and Beverage Products",
            "Construction Materials and Tools",
            "Medical Supplies and Equipment",
            "Agricultural Products and Seeds",
            "Automotive Parts and Accessories",
            "Office Supplies and Furniture",
            "Pharmaceutical Products",
            "Educational Materials and Books"
        };
        return descriptions[random.nextInt(descriptions.length)];
    }

    private String getRandomSpecialInstructions() {
        String[] instructions = {
            "Handle with care - fragile items",
            "Keep in dry conditions",
            "Temperature controlled transport required",
            "Customs clearance priority",
            "Direct delivery to customer",
            "Refrigeration required",
            "Security escort needed",
            "Document verification required",
            "Insurance coverage included",
            "Express delivery requested"
        };
        return instructions[random.nextInt(instructions.length)];
    }

    private String getEventDescription(String eventType, String location) {
        switch (eventType) {
            case "SHIPMENT_CREATED":
                return "Shipment created and prepared for pickup";
            case "PICKED_UP":
                return "Package picked up from " + location;
            case "DEPARTED_ORIGIN":
                return "Departed from " + location;
            case "IN_TRANSIT":
                return "In transit via " + location;
            case "CUSTOMS_SUBMITTED":
                return "Documents submitted to customs at " + location;
            case "CUSTOMS_CLEARED":
                return "Customs clearance completed at " + location;
            case "OUT_FOR_DELIVERY":
                return "Out for delivery from " + location;
            case "DELIVERED":
                return "Successfully delivered at " + location;
            default:
                return "Event occurred at " + location;
        }
    }
}
