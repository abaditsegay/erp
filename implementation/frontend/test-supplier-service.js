// Test script to verify mock supplier service
import { mockSupplierService } from './src/services/mockSupplierService';

console.log('Testing MockSupplierService...');

async function testSupplierService() {
  try {
    console.log('1. Getting all suppliers...');
    const allSuppliers = await mockSupplierService.getAllSuppliers();
    console.log(`Found ${allSuppliers.length} existing suppliers`);

    console.log('2. Creating a new supplier...');
    const newSupplierData = {
      code: 'TEST001',
      name: 'Test Supplier Ltd',
      type: 'wholesaler',
      category: 'Import/Export',
      contactPerson: 'John Doe',
      email: 'john@test.com',
      phone: '+251911123456',
      website: 'https://test.com',
      taxId: 'TIN123456',
      businessLicense: 'BL789',
      address: {
        street: '123 Test Street',
        city: 'Addis Ababa',
        region: 'Addis Ababa',
        country: 'Ethiopia',
        postalCode: '1000',
        poBox: 'P.O. Box 123',
      },
      contacts: [],
      active: true,
      rating: 4,
      paymentTerms: 'net_30',
      leadTimeDays: 7,
      minimumOrderAmount: 1000,
      currency: 'ETB',
      notes: 'Test supplier for debugging',
      isImporter: false,
      isExporter: true,
      specializations: ['Electronics', 'Computers'],
    };

    const createdSupplier = await mockSupplierService.createSupplier(newSupplierData);
    console.log('Created supplier:', createdSupplier);

    console.log('3. Getting all suppliers again...');
    const updatedSuppliers = await mockSupplierService.getAllSuppliers();
    console.log(`Now have ${updatedSuppliers.length} suppliers`);

    console.log('✅ MockSupplierService test completed successfully!');
  } catch (error) {
    console.error('❌ Error testing MockSupplierService:', error);
  }
}

testSupplierService();
