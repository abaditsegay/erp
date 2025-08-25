/**
 * Ethiopian ERP Services Demonstration
 * This script demonstrates the enterprise-grade Ethiopian services implemented in Phase 1
 */

import { ethiopianCalendarService } from './ethiopianCalendarService';
import { ethiopianLanguageService } from './ethiopianLanguageService';
import { ethiopianTaxComplianceService } from './ethiopianTaxComplianceService';
import { nbeComplianceService } from './nbeComplianceService';

export async function demonstrateEthiopianServices() {
  console.log('🇪🇹 Ethiopian ERP Services Demonstration');
  console.log('==========================================\n');

  // 1. Ethiopian Calendar Service Demo
  console.log('📅 Ethiopian Calendar Service');
  console.log('------------------------------');
  
  const today = new Date();
  const ethiopianDate = ethiopianCalendarService.convertToEthiopian(today);
  console.log(`Today (Gregorian): ${today.toDateString()}`);
  console.log(`Today (Ethiopian): ${ethiopianDate.monthName} ${ethiopianDate.ethiopianDay}, ${ethiopianDate.ethiopianYear}`);
  
  const fiscalYear = ethiopianCalendarService.getEthiopianFiscalYear(ethiopianDate.ethiopianYear);
  console.log(`Current Fiscal Year: ${fiscalYear}`);
  
  console.log(`Is Holiday: ${ethiopianDate.isHoliday}`);
  console.log(`Is Working Day: ${ethiopianDate.isWorkingDay}`);
  console.log(`Day Name (Amharic): ${ethiopianDate.dayNameAmharic}\n`);

  // 2. Ethiopian Language Service Demo
  console.log('🔤 Ethiopian Language Service');
  console.log('------------------------------');
  
  const businessTerms = [
    'invoice', 'purchase_order', 'payment', 'supplier', 
    'customer', 'inventory', 'warehouse', 'delivery'
  ];
  
  businessTerms.forEach(term => {
    const amharic = ethiopianLanguageService.translate(term);
    console.log(`${term} → ${amharic}`);
  });
  
  const amount = 15750.50;
  const etbFormatted = ethiopianLanguageService.formatCurrency(amount, 'ETB');
  const usdFormatted = ethiopianLanguageService.formatCurrency(amount, 'USD');
  console.log(`Amount: ${amount} → ${etbFormatted} / ${usdFormatted}\n`);

  // 3. Tax Compliance Service Demo
  console.log('💰 Ethiopian Tax Compliance Service');
  console.log('------------------------------------');
  
  // TIN Validation
  const testTin = '1234567890';
  const tinValidation = ethiopianTaxComplianceService.validateTIN(testTin);
  console.log(`TIN ${testTin} validation:`, tinValidation);
  
  // VAT Calculation
  const saleAmount = 10000;
  const vatCalc = ethiopianTaxComplianceService.calculateVAT(saleAmount);
  console.log(`VAT on ETB ${saleAmount}:`, vatCalc);
  
  // Withholding Tax
  const servicePayment = 50000;
  const withholdingCalc = ethiopianTaxComplianceService.calculateWithholdingTax('consulting', servicePayment);
  console.log(`Withholding tax on consulting (ETB ${servicePayment}):`, withholdingCalc);
  
  // Excise Tax
  const carPrice = 2500000;
  const exciseCalc = ethiopianTaxComplianceService.calculateExciseTax('vehicles', carPrice);
  console.log(`Excise tax on vehicle (ETB ${carPrice}):`, exciseCalc);
  
  console.log('');

  // 4. NBE Banking Compliance Service Demo
  console.log('🏦 NBE Banking Compliance Service');
  console.log('----------------------------------');
  
  try {
    // Exchange Rates
    const rates = await nbeComplianceService.getCurrentExchangeRates();
    console.log('Current NBE Exchange Rates:');
    rates.forEach(rate => {
      console.log(`  ${rate.currency}: ${rate.buyingRate} - ${rate.sellingRate} ETB`);
    });
    
    // Currency Conversion
    const usdAmount = 1000;
    const conversion = await nbeComplianceService.convertCurrency(usdAmount, 'USD', 'ETB');
    console.log(`\nCurrency Conversion: USD ${usdAmount} → ETB ${conversion.convertedAmount}`);
    
    // AML Screening
    const entityName = 'Test Business Company';
    const amlResult = await nbeComplianceService.screenEntityAML(entityName, 'business');
    console.log(`\nAML Screening for "${entityName}":`, {
      riskLevel: amlResult.riskLevel,
      sanctionsStatus: amlResult.sanctionsStatus,
      requiresManualReview: amlResult.requiresManualReview
    });
    
    // Payment Validation
    const paymentValidation = await nbeComplianceService.validatePayment(
      25000, 'USD', 'import',
      { name: 'Importer Company', relationship: 'customer', riskProfile: 'low', address: 'Addis Ababa' },
      { name: 'Foreign Supplier', relationship: 'beneficiary', riskProfile: 'medium', address: 'Dubai, UAE' }
    );
    console.log('\nPayment Validation Result:', {
      isValid: paymentValidation.isValid,
      forexCompliance: paymentValidation.forexCompliance,
      amlCompliance: paymentValidation.amlCompliance,
      estimatedProcessingTime: `${paymentValidation.estimatedProcessingTime} business days`
    });
    
  } catch (error) {
    console.log('NBE Service Demo Error:', error);
  }

  console.log('\n🎉 Phase 1 Implementation Complete!');
  console.log('====================================');
  console.log('✅ Ethiopian Calendar System');
  console.log('✅ Bilingual Language Support');
  console.log('✅ ERCA Tax Compliance');
  console.log('✅ NBE Banking Compliance');
  console.log('\nYour Ethiopian ERP system now has enterprise-grade');
  console.log('Ethiopian business infrastructure! 🇪🇹');

  return {
    calendarService: ethiopianCalendarService,
    languageService: ethiopianLanguageService,
    taxService: ethiopianTaxComplianceService,
    bankingService: nbeComplianceService
  };
}

// Export for use in other parts of the application
export default demonstrateEthiopianServices;
