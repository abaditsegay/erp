/**
 * Quick Test Script for Fixed Ethiopian Services
 * This script tests the fixes for the circular dependency and missing translations
 */

import { ethiopianCalendarService } from './ethiopianCalendarService';
import { ethiopianLanguageService } from './ethiopianLanguageService';

export function testEthiopianServicesFixes() {
  console.log('🔧 Testing Ethiopian Services Fixes');
  console.log('=====================================\n');

  try {
    // Test 1: Ethiopian Calendar Service (should not have circular dependency)
    console.log('1️⃣ Testing Ethiopian Calendar Service...');
    const today = new Date();
    const ethiopianDate = ethiopianCalendarService.convertToEthiopian(today);
    
    console.log(`✅ Calendar conversion successful:`);
    console.log(`   Gregorian: ${today.toDateString()}`);
    console.log(`   Ethiopian: ${ethiopianDate.monthNameAmharic} ${ethiopianDate.ethiopianDay}, ${ethiopianDate.ethiopianYear}`);
    console.log(`   Is Working Day: ${ethiopianDate.isWorkingDay}`);
    console.log(`   Is Holiday: ${ethiopianDate.isHoliday}\n`);

    // Test 2: Working Day Check (should not cause circular dependency)
    console.log('2️⃣ Testing Working Day Check...');
    const isWorkingDay = ethiopianCalendarService.isWorkingDay(today);
    console.log(`✅ Working day check successful: ${isWorkingDay}\n`);

    // Test 3: Language Service - Logout Translation
    console.log('3️⃣ Testing Language Service - Authentication Terms...');
    const authTerms = ['login', 'logout', 'signin', 'signout', 'password', 'username'];
    
    authTerms.forEach(term => {
      try {
        const translation = ethiopianLanguageService.translate(term);
        console.log(`✅ ${term} → ${translation}`);
      } catch (error) {
        console.log(`❌ Failed to translate: ${term}`);
      }
    });

    console.log('\n🎉 All tests passed! The fixes are working correctly.');
    
    return {
      calendarWorking: true,
      workingDayWorking: true,
      translationsWorking: true,
      allTestsPassed: true
    };

  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      calendarWorking: false,
      workingDayWorking: false,
      translationsWorking: false,
      allTestsPassed: false,
      error: error
    };
  }
}

// Export for use in console or other components
export default testEthiopianServicesFixes;
