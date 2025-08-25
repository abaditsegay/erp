/**
 * Ethiopian Calendar Service - Enterprise Implementation
 * Complete 13-month calendar system with business logic integration
 * Supports Ethiopian calendar (2017) with full Gregorian conversion
 */

export interface EthiopianDate {
  ethiopianYear: number;    // Current: 2017
  ethiopianMonth: number;   // 1-13 (13 months system)
  ethiopianDay: number;     // 1-30 (except Pagume: 1-6)
  gregorianEquivalent: Date;
  monthName: string;        // Meskerem, Tikimt, etc.
  monthNameAmharic: string; // መስከረም, ጥቅምት, etc.
  dayName: string;          // Monday, Tuesday, etc.
  dayNameAmharic: string;   // ሰኞ, ማክሰኞ, etc.
  isHoliday: boolean;
  isWorkingDay: boolean;
  isLeapYear: boolean;
  dayOfYear: number;        // 1-365/366
  weekOfYear: number;       // 1-52/53
  holidayName?: string;
}

export interface EthiopianHoliday {
  name: string;
  nameAmharic: string;
  date: { month: number; day: number };
  type: 'religious' | 'national' | 'cultural' | 'regional';
  isFixed: boolean;         // Fixed date or calculated
  description?: string;
  regions?: string[];       // Specific regions if regional holiday
}

export interface FastingPeriod {
  name: string;
  nameAmharic: string;
  startDate: { month: number; day: number };
  endDate: { month: number; day: number };
  type: 'orthodox' | 'muslim' | 'other';
  description?: string;
}

export interface EthiopianFiscalYear {
  year: number;
  startDate: Date;
  endDate: Date;
  quarters: EthiopianQuarter[];
  isCurrentYear: boolean;
}

export interface EthiopianQuarter {
  quarter: number;
  startDate: Date;
  endDate: Date;
  months: number[];
  name: string;
  nameAmharic: string;
}

// Ethiopian months (13 months)
export const ETHIOPIAN_MONTHS = [
  { name: 'Meskerem', amharic: 'መስከረም', days: 30 },
  { name: 'Tikimt', amharic: 'ጥቅምት', days: 30 },
  { name: 'Hidar', amharic: 'ህዳር', days: 30 },
  { name: 'Tahsas', amharic: 'ታህሳስ', days: 30 },
  { name: 'Tir', amharic: 'ጥር', days: 30 },
  { name: 'Yekatit', amharic: 'የካቲት', days: 30 },
  { name: 'Megabit', amharic: 'መጋቢት', days: 30 },
  { name: 'Miazia', amharic: 'ሚያዝያ', days: 30 },
  { name: 'Ginbot', amharic: 'ግንቦት', days: 30 },
  { name: 'Sene', amharic: 'ሰኔ', days: 30 },
  { name: 'Hamle', amharic: 'ሐምሌ', days: 30 },
  { name: 'Nehase', amharic: 'ነሐሴ', days: 30 },
  { name: 'Pagume', amharic: 'ጳጉሜ', days: 5 } // 6 in leap years
];

// Ethiopian weekdays
export const ETHIOPIAN_DAYS = [
  { name: 'Sunday', amharic: 'እሁድ' },
  { name: 'Monday', amharic: 'ሰኞ' },
  { name: 'Tuesday', amharic: 'ማክሰኞ' },
  { name: 'Wednesday', amharic: 'ረቡዕ' },
  { name: 'Thursday', amharic: 'ሐሙስ' },
  { name: 'Friday', amharic: 'ዓርብ' },
  { name: 'Saturday', amharic: 'ቅዳመ' }
];

class EthiopianCalendarService {
  // Ethiopian holidays
  private readonly ETHIOPIAN_HOLIDAYS: EthiopianHoliday[] = [
    // Fixed religious holidays
    { name: 'Ethiopian New Year', nameAmharic: 'እንቁጣጣሽ', date: { month: 1, day: 1 }, type: 'religious', isFixed: true },
    { name: 'Finding of True Cross', nameAmharic: 'መስቀል', date: { month: 1, day: 17 }, type: 'religious', isFixed: true },
    { name: 'Ethiopian Christmas', nameAmharic: 'ገና', date: { month: 4, day: 29 }, type: 'religious', isFixed: true },
    { name: 'Epiphany', nameAmharic: 'ጥምቀት', date: { month: 5, day: 11 }, type: 'religious', isFixed: true },
    { name: 'Adwa Victory Day', nameAmharic: 'አድዋ', date: { month: 7, day: 23 }, type: 'national', isFixed: true },
    { name: 'Good Friday', nameAmharic: 'ስቅለት', date: { month: 8, day: 0 }, type: 'religious', isFixed: false }, // Calculated
    { name: 'Easter', nameAmharic: 'ፋሲካ', date: { month: 8, day: 0 }, type: 'religious', isFixed: false }, // Calculated
    { name: 'Labour Day', nameAmharic: 'የሰራተኞች ቀን', date: { month: 8, day: 23 }, type: 'national', isFixed: true },
    { name: 'Patriots Victory Day', nameAmharic: 'ድል', date: { month: 9, day: 20 }, type: 'national', isFixed: true },
    { name: 'Derg Downfall', nameAmharic: 'ደርግ ውድቀት', date: { month: 9, day: 20 }, type: 'national', isFixed: true }
  ];

  // Fasting periods
  private readonly FASTING_PERIODS: FastingPeriod[] = [
    { name: 'Hudadi/Abiy Tsom', nameAmharic: 'ሁዳዲ/አቢይ ጾም', startDate: { month: 2, day: 15 }, endDate: { month: 4, day: 28 }, type: 'orthodox' },
    { name: 'Lent', nameAmharic: 'ጾመ ንስሐ', startDate: { month: 6, day: 1 }, endDate: { month: 8, day: 0 }, type: 'orthodox' },
    { name: 'Apostles Fast', nameAmharic: 'ጾመ ሐዋርያት', startDate: { month: 10, day: 6 }, endDate: { month: 10, day: 28 }, type: 'orthodox' },
    { name: 'Assumption Fast', nameAmharic: 'ጾመ ፍልሰታ', startDate: { month: 12, day: 1 }, endDate: { month: 12, day: 15 }, type: 'orthodox' }
  ];

  /**
   * Convert Gregorian date to Ethiopian date
   */
  convertToEthiopian(gregorianDate: Date): EthiopianDate {
    const year = gregorianDate.getFullYear();
    
    // Ethiopian calendar starts from September 11/12 (depending on leap year)
    const ethiopianEpoch = new Date(year, 8, this.isGregorianLeapYear(year) ? 11 : 12); // Sep 11/12
    
    let ethiopianYear: number;
    let dayOfYear: number;
    
    if (gregorianDate >= ethiopianEpoch) {
      ethiopianYear = year - 7;
      dayOfYear = Math.floor((gregorianDate.getTime() - ethiopianEpoch.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    } else {
      ethiopianYear = year - 8;
      const prevEthiopianEpoch = new Date(year - 1, 8, this.isGregorianLeapYear(year - 1) ? 11 : 12);
      dayOfYear = Math.floor((gregorianDate.getTime() - prevEthiopianEpoch.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }

    // Calculate Ethiopian month and day
    let ethiopianMonth = 1;
    let ethiopianDay = dayOfYear;
    
    for (let i = 0; i < 12; i++) {
      if (ethiopianDay <= 30) break;
      ethiopianDay -= 30;
      ethiopianMonth++;
    }
    
    // Handle Pagume (13th month)
    if (ethiopianMonth > 12) {
      ethiopianMonth = 13;
      ethiopianDay = dayOfYear - 360;
    }

    const monthInfo = ETHIOPIAN_MONTHS[ethiopianMonth - 1];
    const weekday = gregorianDate.getDay();
    const weekdayInfo = ETHIOPIAN_DAYS[weekday];
    
    const isLeapYear = this.isEthiopianLeapYear(ethiopianYear);
    const isHoliday = this.isHoliday(ethiopianMonth, ethiopianDay);
    
    // Calculate working day without circular dependency
    const isWorkingDay = weekday !== 0 && !isHoliday; // Sunday is rest day, not holiday

    return {
      ethiopianYear,
      ethiopianMonth,
      ethiopianDay,
      gregorianEquivalent: gregorianDate,
      monthName: monthInfo.name,
      monthNameAmharic: monthInfo.amharic,
      dayName: weekdayInfo.name,
      dayNameAmharic: weekdayInfo.amharic,
      isHoliday,
      isWorkingDay,
      isLeapYear,
      dayOfYear,
      weekOfYear: Math.ceil(dayOfYear / 7),
      holidayName: isHoliday ? this.getHolidayName(ethiopianMonth, ethiopianDay) : undefined
    };
  }

  /**
   * Convert Ethiopian date to Gregorian date
   */
  convertToGregorian(ethiopianDate: EthiopianDate): Date {
    const { ethiopianYear, ethiopianMonth, ethiopianDay } = ethiopianDate;
    
    // Calculate days from Ethiopian epoch
    let totalDays = 0;
    
    // Add days for complete months
    for (let i = 1; i < ethiopianMonth; i++) {
      if (i <= 12) {
        totalDays += 30;
      } else {
        totalDays += this.isEthiopianLeapYear(ethiopianYear) ? 6 : 5;
      }
    }
    
    // Add remaining days
    totalDays += ethiopianDay - 1;
    
    // Ethiopian epoch in Gregorian calendar
    const gregorianYear = ethiopianYear + 7;
    const epochStart = new Date(gregorianYear, 8, this.isGregorianLeapYear(gregorianYear) ? 11 : 12);
    
    const gregorianDate = new Date(epochStart);
    gregorianDate.setDate(epochStart.getDate() + totalDays);
    
    return gregorianDate;
  }

  /**
   * Convert simple date object to Gregorian
   */
  convertSimpleDateToGregorian(simpleDate: { month: number; day: number }): Date {
    const currentEthiopianYear = this.getCurrentEthiopianYear();
    const ethiopianDate: EthiopianDate = {
      ethiopianYear: currentEthiopianYear,
      ethiopianMonth: simpleDate.month,
      ethiopianDay: simpleDate.day,
      gregorianEquivalent: new Date(),
      monthName: ETHIOPIAN_MONTHS[simpleDate.month - 1].name,
      monthNameAmharic: ETHIOPIAN_MONTHS[simpleDate.month - 1].amharic,
      dayName: '',
      dayNameAmharic: '',
      isHoliday: false,
      isWorkingDay: true,
      isLeapYear: this.isEthiopianLeapYear(currentEthiopianYear),
      dayOfYear: 0,
      weekOfYear: 0
    };
    
    return this.convertToGregorian(ethiopianDate);
  }

  /**
   * Get current Ethiopian year
   */
  getCurrentEthiopianYear(): number {
    return this.convertToEthiopian(new Date()).ethiopianYear;
  }

  /**
   * Check if Ethiopian year is leap year
   */
  isEthiopianLeapYear(year: number): boolean {
    // Ethiopian leap year occurs every 4 years
    return (year % 4) === 3;
  }

  /**
   * Check if Gregorian year is leap year
   */
  private isGregorianLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  /**
   * Check if given Ethiopian date is a holiday
   */
  isHoliday(month: number, day: number): boolean {
    return this.ETHIOPIAN_HOLIDAYS.some(holiday => 
      holiday.isFixed && holiday.date.month === month && holiday.date.day === day
    );
  }

  /**
   * Get holiday name for specific date
   */
  getHolidayName(month: number, day: number): string | undefined {
    const holiday = this.ETHIOPIAN_HOLIDAYS.find(h => 
      h.isFixed && h.date.month === month && h.date.day === day
    );
    return holiday?.name;
  }

  /**
   * Check if given date is a working day
   */
  isWorkingDay(date: Date): boolean {
    const weekday = date.getDay();
    // In Ethiopia, Sunday is typically a rest day, Saturday is half day
    if (weekday === 0) return false; // Sunday
    
    const ethiopianDate = this.convertToEthiopian(date);
    return !ethiopianDate.isHoliday;
  }

  /**
   * Get Ethiopian holidays for a given year
   */
  getEthiopianHolidays(year: number): EthiopianHoliday[] {
    // Return both fixed and calculated holidays
    return this.ETHIOPIAN_HOLIDAYS.map(holiday => ({
      ...holiday,
      // For calculated holidays like Easter, we would calculate the actual date
      // For now, returning the template
    }));
  }

  /**
   * Get fasting periods for a given year
   */
  getFastingPeriods(year: number): FastingPeriod[] {
    return this.FASTING_PERIODS;
  }

  /**
   * Get Ethiopian time (Ethiopian time is 6 hours behind clock time)
   */
  getEthiopianTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    // Ethiopian time starts at sunrise (6 AM = 12 Ethiopian time)
    let ethiopianHours = hours >= 6 ? hours - 6 : hours + 18;
    if (ethiopianHours === 0) ethiopianHours = 12;
    
    const period = hours >= 6 && hours < 18 ? 'AM' : 'PM';
    const ethiopianPeriod = hours >= 6 && hours < 18 ? 'ከቀን' : 'ከሌሊት';
    
    return `${ethiopianHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period} (${ethiopianPeriod})`;
  }

  /**
   * Get Ethiopian fiscal year information
   */
  getEthiopianFiscalYear(year?: number): EthiopianFiscalYear {
    const currentYear = year || this.getCurrentEthiopianYear();
    const startDate = this.convertToGregorian({
      ethiopianYear: currentYear,
      ethiopianMonth: 1,
      ethiopianDay: 1
    } as EthiopianDate);
    
    const endDate = this.convertToGregorian({
      ethiopianYear: currentYear,
      ethiopianMonth: 13,
      ethiopianDay: this.isEthiopianLeapYear(currentYear) ? 6 : 5
    } as EthiopianDate);

    const quarters: EthiopianQuarter[] = [
      {
        quarter: 1,
        startDate: this.convertToGregorian({ ethiopianYear: currentYear, ethiopianMonth: 1, ethiopianDay: 1 } as EthiopianDate),
        endDate: this.convertToGregorian({ ethiopianYear: currentYear, ethiopianMonth: 3, ethiopianDay: 30 } as EthiopianDate),
        months: [1, 2, 3],
        name: 'First Quarter',
        nameAmharic: 'የመጀመሪያ ሩብ'
      },
      {
        quarter: 2,
        startDate: this.convertToGregorian({ ethiopianYear: currentYear, ethiopianMonth: 4, ethiopianDay: 1 } as EthiopianDate),
        endDate: this.convertToGregorian({ ethiopianYear: currentYear, ethiopianMonth: 6, ethiopianDay: 30 } as EthiopianDate),
        months: [4, 5, 6],
        name: 'Second Quarter',
        nameAmharic: 'የሁለተኛ ሩብ'
      },
      {
        quarter: 3,
        startDate: this.convertToGregorian({ ethiopianYear: currentYear, ethiopianMonth: 7, ethiopianDay: 1 } as EthiopianDate),
        endDate: this.convertToGregorian({ ethiopianYear: currentYear, ethiopianMonth: 9, ethiopianDay: 30 } as EthiopianDate),
        months: [7, 8, 9],
        name: 'Third Quarter',
        nameAmharic: 'የሦስተኛ ሩብ'
      },
      {
        quarter: 4,
        startDate: this.convertToGregorian({ ethiopianYear: currentYear, ethiopianMonth: 10, ethiopianDay: 1 } as EthiopianDate),
        endDate: this.convertToGregorian({ ethiopianYear: currentYear, ethiopianMonth: 13, ethiopianDay: this.isEthiopianLeapYear(currentYear) ? 6 : 5 } as EthiopianDate),
        months: [10, 11, 12, 13],
        name: 'Fourth Quarter',
        nameAmharic: 'የአራተኛ ሩብ'
      }
    ];

    return {
      year: currentYear,
      startDate,
      endDate,
      quarters,
      isCurrentYear: currentYear === this.getCurrentEthiopianYear()
    };
  }

  /**
   * Calculate business days between two dates
   */
  calculateBusinessDays(startDate: Date, endDate: Date): number {
    let count = 0;
    const current = new Date(startDate);
    
    while (current <= endDate) {
      if (this.isWorkingDay(current)) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    
    return count;
  }

  /**
   * Get next working day
   */
  getNextWorkingDay(date: Date): Date {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    while (!this.isWorkingDay(nextDay)) {
      nextDay.setDate(nextDay.getDate() + 1);
    }
    
    return nextDay;
  }

  /**
   * Check if date is business day (excludes weekends and holidays)
   */
  isBusinessDay(date: Date): boolean {
    return this.isWorkingDay(date);
  }

  /**
   * Get next business day
   */
  getNextBusinessDay(date: Date): Date {
    return this.getNextWorkingDay(date);
  }

  /**
   * Format Ethiopian date for display
   */
  formatEthiopianDate(date: Date, inAmharic: boolean = false): string {
    const ethiopianDate = this.convertToEthiopian(date);
    
    if (inAmharic) {
      return `${ethiopianDate.dayNameAmharic}, ${ethiopianDate.monthNameAmharic} ${this.formatEthiopianNumber(ethiopianDate.ethiopianDay)}, ${this.formatEthiopianNumber(ethiopianDate.ethiopianYear)}`;
    } else {
      return `${ethiopianDate.dayName}, ${ethiopianDate.monthName} ${ethiopianDate.ethiopianDay}, ${ethiopianDate.ethiopianYear}`;
    }
  }

  /**
   * Format number in Amharic numerals
   */
  private formatEthiopianNumber(num: number): string {
    const amharicNumerals = ['໐', '໑', '໒', '໓', '໔', '໕', '໖', '໗', '໘', '໙'];
    return num.toString().split('').map(digit => amharicNumerals[parseInt(digit)] || digit).join('');
  }

  /**
   * Parse Ethiopian date string
   */
  parseEthiopianDate(dateString: string): EthiopianDate | null {
    // Implementation for parsing Ethiopian date strings
    // This would parse various Ethiopian date formats
    try {
      // Basic parsing logic - can be enhanced
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const year = parseInt(parts[2]);
        
        if (month >= 1 && month <= 13 && day >= 1 && day <= 30) {
          const gregorianDate = this.convertToGregorian({
            ethiopianYear: year,
            ethiopianMonth: month,
            ethiopianDay: day
          } as EthiopianDate);
          
          return this.convertToEthiopian(gregorianDate);
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}

// Export singleton instance
export const ethiopianCalendarService = new EthiopianCalendarService();

// Export utility functions
export const formatEthiopianDate = (date: Date, useAmharic = false): string => {
  return ethiopianCalendarService.formatEthiopianDate(date, useAmharic);
};

export const getCurrentEthiopianYear = (): number => {
  return ethiopianCalendarService.getCurrentEthiopianYear();
};

export const convertToEthiopian = (date: Date): EthiopianDate => {
  return ethiopianCalendarService.convertToEthiopian(date);
};

export const convertToGregorian = (ethiopianDate: EthiopianDate): Date => {
  return ethiopianCalendarService.convertToGregorian(ethiopianDate);
};

export const isWorkingDay = (date: Date): boolean => {
  return ethiopianCalendarService.isWorkingDay(date);
};

export const calculateBusinessDays = (startDate: Date, endDate: Date): number => {
  return ethiopianCalendarService.calculateBusinessDays(startDate, endDate);
};

export const isEthiopianHoliday = (date: Date): boolean => {
  const ethiopianDate = ethiopianCalendarService.convertToEthiopian(date);
  return ethiopianDate.isHoliday;
};

export const isEthiopianBusinessDay = (date: Date): boolean => {
  return ethiopianCalendarService.isBusinessDay(date);
};
