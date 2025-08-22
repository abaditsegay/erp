// Gregorian Calendar Service - Standard International Calendar
// Simplified calendar service using standard Gregorian calendar for now

export interface StandardDate {
  year: number;
  month: number;        // 1-12 (January-December)
  day: number;          // 1-31
  date: Date;
  monthName: string;    // January, February, etc.
  monthNameAmharic: string; // Keep Amharic names for cultural context
  dayName: string;      // Monday, Tuesday, etc.
  dayNameAmharic: string;   // ሰኞ፣ ማክሰኞ፣ etc.
  isHoliday: boolean;
  holidayName?: string;
}

export interface StandardHoliday {
  name: string;
  nameAmharic: string;
  date: { month: number; day: number };
  type: 'religious' | 'national' | 'international';
  isFixedDate: boolean;
  description: string;
}

// Standard Gregorian months with Amharic translations
export const STANDARD_MONTHS = [
  { id: 1, name: 'January', amharic: 'ጃንዩዌሪ', days: 31 },
  { id: 2, name: 'February', amharic: 'ፌብሩዌሪ', days: 28 }, // 29 in leap years
  { id: 3, name: 'March', amharic: 'ማርች', days: 31 },
  { id: 4, name: 'April', amharic: 'ኤፕሪል', days: 30 },
  { id: 5, name: 'May', amharic: 'ሜይ', days: 31 },
  { id: 6, name: 'June', amharic: 'ጁን', days: 30 },
  { id: 7, name: 'July', amharic: 'ጁላይ', days: 31 },
  { id: 8, name: 'August', amharic: 'ኦገስት', days: 31 },
  { id: 9, name: 'September', amharic: 'ሴፕቴምበር', days: 30 },
  { id: 10, name: 'October', amharic: 'ኦክቶበር', days: 31 },
  { id: 11, name: 'November', amharic: 'ኖቬምበር', days: 30 },
  { id: 12, name: 'December', amharic: 'ዲሴምበር', days: 31 }
];

export const STANDARD_DAYS = [
  { id: 0, name: 'Sunday', amharic: 'እሁድ' },
  { id: 1, name: 'Monday', amharic: 'ሰኞ' },
  { id: 2, name: 'Tuesday', amharic: 'ማክሰኞ' },
  { id: 3, name: 'Wednesday', amharic: 'ረቡዕ' },
  { id: 4, name: 'Thursday', amharic: 'ሐሙስ' },
  { id: 5, name: 'Friday', amharic: 'አርብ' },
  { id: 6, name: 'Saturday', amharic: 'ቅዳሜ' }
];

class GregorianCalendarService {

  /**
   * Convert standard Date to StandardDate format
   */
  convertToStandard(date: Date): StandardDate {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript months are 0-based
    const day = date.getDate();
    
    const monthInfo = STANDARD_MONTHS.find(m => m.id === month)!;
    const dayInfo = STANDARD_DAYS[date.getDay()];
    
    return {
      year,
      month,
      day,
      date: new Date(date),
      monthName: monthInfo.name,
      monthNameAmharic: monthInfo.amharic,
      dayName: dayInfo.name,
      dayNameAmharic: dayInfo.amharic,
      isHoliday: this.isHoliday(year, month, day),
      holidayName: this.getHolidayName(year, month, day)
    };
  }

  /**
   * Convert StandardDate back to regular Date
   */
  convertToGregorian(standardDate: StandardDate): Date {
    return new Date(standardDate.year, standardDate.month - 1, standardDate.day);
  }

  /**
   * Check if Gregorian year is leap year
   */
  isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  /**
   * Get current date in standard format
   */
  getCurrentStandardDate(): StandardDate {
    return this.convertToStandard(new Date());
  }

  /**
   * Check if date is holiday (Ethiopian holidays in Gregorian calendar)
   */
  isHoliday(year: number, month: number, day: number): boolean {
    const holidays = this.getStandardHolidays(year);
    return holidays.some(holiday => 
      holiday.date.month === month && 
      holiday.date.day === day
    );
  }

  /**
   * Get holiday name for specific date
   */
  getHolidayName(year: number, month: number, day: number): string | undefined {
    const holidays = this.getStandardHolidays(year);
    const holiday = holidays.find(h => 
      h.date.month === month && 
      h.date.day === day
    );
    return holiday?.name;
  }

  /**
   * Get Ethiopian holidays in Gregorian calendar format
   */
  getStandardHolidays(year: number): StandardHoliday[] {
    return [
      // International Holidays
      {
        name: 'New Year\'s Day',
        nameAmharic: 'አዲስ ዓመት',
        date: { month: 1, day: 1 },
        type: 'international',
        isFixedDate: true,
        description: 'International New Year celebration'
      },
      {
        name: 'Ethiopian Christmas',
        nameAmharic: 'ገና',
        date: { month: 1, day: 7 },
        type: 'religious',
        isFixedDate: true,
        description: 'Ethiopian Orthodox Christmas (Genna)'
      },
      {
        name: 'Ethiopian Epiphany',
        nameAmharic: 'ጥምቀት',
        date: { month: 1, day: 19 },
        type: 'religious',
        isFixedDate: true,
        description: 'Ethiopian Orthodox Epiphany (Timkat)'
      },
      {
        name: 'Victory of Adwa Day',
        nameAmharic: 'የአድዋ ድል በዓል',
        date: { month: 3, day: 2 },
        type: 'national',
        isFixedDate: true,
        description: 'Commemoration of the Battle of Adwa victory'
      },
      {
        name: 'International Women\'s Day',
        nameAmharic: 'የአለማ የሴቶች ቀን',
        date: { month: 3, day: 8 },
        type: 'international',
        isFixedDate: true,
        description: 'International Women\'s Day'
      },
      {
        name: 'Patriots Victory Day',
        nameAmharic: 'የአርበኞች ድል በዓል',
        date: { month: 5, day: 5 },
        type: 'national',
        isFixedDate: true,
        description: 'Liberation from Italian occupation'
      },
      {
        name: 'Labour Day',
        nameAmharic: 'የሰራተኞች ቀን',
        date: { month: 5, day: 1 },
        type: 'international',
        isFixedDate: true,
        description: 'International Workers\' Day'
      },
      {
        name: 'Downfall of Derg Day',
        nameAmharic: 'ደርግ የወደቀበት ቀን',
        date: { month: 5, day: 28 },
        type: 'national',
        isFixedDate: true,
        description: 'End of the Derg military government'
      },
      {
        name: 'Ethiopian New Year',
        nameAmharic: 'እንቁጣጣሽ',
        date: { month: 9, day: 11 },
        type: 'national',
        isFixedDate: true,
        description: 'Ethiopian New Year (Enkutatash)'
      },
      {
        name: 'Finding of the True Cross',
        nameAmharic: 'መስቀል',
        date: { month: 9, day: 27 },
        type: 'religious',
        isFixedDate: true,
        description: 'Ethiopian Orthodox Meskel celebration'
      }
    ];
  }

  /**
   * Check if date is business day (excludes weekends and holidays)
   */
  isBusinessDay(date: Date): boolean {
    const dayOfWeek = date.getDay();
    
    // Weekend check (Saturday = 6, Sunday = 0)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return false;
    }
    
    // Holiday check
    const standardDate = this.convertToStandard(date);
    if (standardDate.isHoliday) {
      return false;
    }
    
    return true;
  }

  /**
   * Get next business day
   */
  getNextBusinessDay(date: Date): Date {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    while (!this.isBusinessDay(nextDay)) {
      nextDay.setDate(nextDay.getDate() + 1);
    }
    
    return nextDay;
  }

  /**
   * Calculate business days between two dates
   */
  calculateBusinessDays(startDate: Date, endDate: Date): number {
    let count = 0;
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      if (this.isBusinessDay(currentDate)) {
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return count;
  }

  /**
   * Format standard date for display
   */
  formatStandardDate(standardDate: StandardDate, includeDay = true, useAmharic = false): string {
    const monthName = useAmharic ? standardDate.monthNameAmharic : standardDate.monthName;
    const dayName = useAmharic ? standardDate.dayNameAmharic : standardDate.dayName;
    
    if (includeDay) {
      return `${dayName}, ${monthName} ${standardDate.day}, ${standardDate.year}`;
    } else {
      return `${monthName} ${standardDate.day}, ${standardDate.year}`;
    }
  }

  /**
   * Get standard time (regular system time)
   */
  getStandardTime(date: Date = new Date()): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  /**
   * Get holidays in a specific month
   */
  getHolidaysInMonth(date: Date): StandardHoliday[] {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const holidays = this.getStandardHolidays(year);
    
    return holidays.filter(holiday => holiday.date.month === month);
  }

  /**
   * Get month name in Amharic
   */
  getMonthNameAmharic(month: number): string {
    const monthInfo = STANDARD_MONTHS.find(m => m.id === month);
    return monthInfo?.amharic || '';
  }

  /**
   * Get day name in Amharic
   */
  getDayNameAmharic(dayOfWeek: number): string {
    const dayInfo = STANDARD_DAYS[dayOfWeek];
    return dayInfo?.amharic || '';
  }
}

// Export singleton instance with compatible interface names
export const gregorianCalendarService = new GregorianCalendarService();

// Compatibility aliases for Ethiopian calendar service
export const ethiopianCalendarService = gregorianCalendarService;

// Export utility functions with compatible names
export const formatEthiopianDate = (date: Date, useAmharic = false): string => {
  const standardDate = gregorianCalendarService.convertToStandard(date);
  return gregorianCalendarService.formatStandardDate(standardDate, true, useAmharic);
};

export const formatStandardDate = (date: Date, useAmharic = false): string => {
  const standardDate = gregorianCalendarService.convertToStandard(date);
  return gregorianCalendarService.formatStandardDate(standardDate, true, useAmharic);
};

export const getCurrentEthiopianYear = (): number => {
  return gregorianCalendarService.getCurrentStandardDate().year;
};

export const getCurrentYear = (): number => {
  return gregorianCalendarService.getCurrentStandardDate().year;
};

export const isEthiopianHoliday = (date: Date): boolean => {
  const standardDate = gregorianCalendarService.convertToStandard(date);
  return standardDate.isHoliday;
};

export const isHoliday = (date: Date): boolean => {
  const standardDate = gregorianCalendarService.convertToStandard(date);
  return standardDate.isHoliday;
};

export const isEthiopianBusinessDay = (date: Date): boolean => {
  return gregorianCalendarService.isBusinessDay(date);
};

export const isBusinessDay = (date: Date): boolean => {
  return gregorianCalendarService.isBusinessDay(date);
};

// Export types for compatibility
export type EthiopianDate = StandardDate;
export type EthiopianHoliday = StandardHoliday;

// Re-export constants with compatible names
export const ETHIOPIAN_MONTHS = STANDARD_MONTHS;
export const ETHIOPIAN_DAYS = STANDARD_DAYS;

export default gregorianCalendarService;
