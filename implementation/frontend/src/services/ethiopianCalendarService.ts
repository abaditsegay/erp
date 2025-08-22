// Ethiopian Calendar Service - Now using Gregorian Calendar
// Simplified to use standard Gregorian calendar for better compatibility

export interface EthiopianDate {
  ethiopianYear: number;    // Now uses Gregorian year
  ethiopianMonth: number;   // 1-12 (standard months)
  ethiopianDay: number;     // 1-31 (standard days)
  gregorianEquivalent: Date;
  monthName: string;        // January, February, etc.
  monthNameAmharic: string; // ጃንዩዌሪ፣ ፌብሩዌሪ፣ etc.
  dayName: string;          // Monday, Tuesday, etc.
  dayNameAmharic: string;   // ሰኞ፣ ማክሰኞ፣ etc.
  isHoliday: boolean;
  holidayName?: string;
}

export interface EthiopianHoliday {
  name: string;
  nameAmharic: string;
  date: { month: number; day: number }; // Simplified to month/day
  type: 'religious' | 'national' | 'regional';
  isFixedDate: boolean;
  description: string;
}

export interface FastingPeriod {
  name: string;
  nameAmharic: string;
  startDate: { month: number; day: number }; // Simplified to month/day
  endDate: { month: number; day: number };   // Simplified to month/day
  description: string;
}

// Standard Gregorian Calendar Constants (with Amharic names)
export const ETHIOPIAN_MONTHS = [
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

export const ETHIOPIAN_DAYS = [
  { id: 0, name: 'Sunday', amharic: 'እሁድ' },
  { id: 1, name: 'Monday', amharic: 'ሰኞ' },
  { id: 2, name: 'Tuesday', amharic: 'ማክሰኞ' },
  { id: 3, name: 'Wednesday', amharic: 'ረቡዕ' },
  { id: 4, name: 'Thursday', amharic: 'ሐሙስ' },
  { id: 5, name: 'Friday', amharic: 'አርብ' },
  { id: 6, name: 'Saturday', amharic: 'ቅዳሜ' }
];

class EthiopianCalendarService {

  /**
   * Convert Gregorian date to Ethiopian date format (now just Gregorian with Ethiopian labels)
   */
  convertToEthiopian(gregorianDate: Date): EthiopianDate {
    const year = gregorianDate.getFullYear();
    const month = gregorianDate.getMonth() + 1; // JavaScript months are 0-based
    const day = gregorianDate.getDate();
    
    const monthInfo = ETHIOPIAN_MONTHS.find(m => m.id === month)!;
    const dayInfo = ETHIOPIAN_DAYS[gregorianDate.getDay()];
    
    return {
      ethiopianYear: year,
      ethiopianMonth: month,
      ethiopianDay: day,
      gregorianEquivalent: new Date(gregorianDate),
      monthName: monthInfo.name,
      monthNameAmharic: monthInfo.amharic,
      dayName: dayInfo.name,
      dayNameAmharic: dayInfo.amharic,
      isHoliday: this.isHoliday(year, month, day),
      holidayName: this.getHolidayName(year, month, day)
    };
  }

  /**
   * Convert Ethiopian date to Gregorian date (now just returns the date)
   */
  convertToGregorian(ethiopianDate: EthiopianDate): Date {
    return new Date(ethiopianDate.ethiopianYear, ethiopianDate.ethiopianMonth - 1, ethiopianDate.ethiopianDay);
  }

  /**
   * Convert simplified date (month/day) to Gregorian date
   */
  convertSimpleDateToGregorian(date: { month: number; day: number }, year: number = new Date().getFullYear()): Date {
    return new Date(year, date.month - 1, date.day);
  }

  /**
   * Check if year is leap year (Gregorian)
   */
  isEthiopianLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  /**
   * Get current Ethiopian date (now Gregorian)
   */
  getCurrentEthiopianDate(): EthiopianDate {
    return this.convertToEthiopian(new Date());
  }

  /**
   * Check if date is Ethiopian holiday
   */
  isHoliday(year: number, month: number, day: number): boolean {
    const holidays = this.getEthiopianHolidays(year);
    return holidays.some(holiday => 
      holiday.date.month === month && 
      holiday.date.day === day
    );
  }

  /**
   * Get holiday name for specific date
   */
  getHolidayName(year: number, month: number, day: number): string | undefined {
    const holidays = this.getEthiopianHolidays(year);
    const holiday = holidays.find(h => 
      h.date.month === month && 
      h.date.day === day
    );
    return holiday?.name;
  }

  /**
   * Get Ethiopian holidays for a year (in Gregorian calendar)
   */
  getEthiopianHolidays(year: number): EthiopianHoliday[] {
    return [
      // International Holidays
      {
        name: 'New Year\'s Day',
        nameAmharic: 'አዲስ ዓመት',
        date: { month: 1, day: 1 },
        type: 'national',
        isFixedDate: true,
        description: 'International New Year celebration'
      },
      {
        name: 'Ethiopian Christmas (Genna)',
        nameAmharic: 'ገና',
        date: { month: 1, day: 7 },
        type: 'religious',
        isFixedDate: true,
        description: 'Ethiopian Orthodox Christmas'
      },
      {
        name: 'Epiphany (Timkat)',
        nameAmharic: 'ጥምቀት',
        date: { month: 1, day: 19 },
        type: 'religious',
        isFixedDate: true,
        description: 'Ethiopian Orthodox Epiphany celebration'
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
        type: 'national',
        isFixedDate: true,
        description: 'International Women\'s Day'
      },
      {
        name: 'Labour Day',
        nameAmharic: 'የሰራተኞች ቀን',
        date: { month: 5, day: 1 },
        type: 'national',
        isFixedDate: true,
        description: 'International Workers\' Day'
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
        name: 'Downfall of Derg Day',
        nameAmharic: 'ደርግ የወደቀበት ቀን',
        date: { month: 5, day: 28 },
        type: 'national',
        isFixedDate: true,
        description: 'End of the Derg military government'
      },
      {
        name: 'Ethiopian New Year (Enkutatash)',
        nameAmharic: 'እንቁጣጣሽ',
        date: { month: 9, day: 11 },
        type: 'religious',
        isFixedDate: true,
        description: 'Ethiopian New Year celebration'
      },
      {
        name: 'Finding of the True Cross (Meskel)',
        nameAmharic: 'መስቀል',
        date: { month: 9, day: 27 },
        type: 'religious',
        isFixedDate: true,
        description: 'Celebration of the finding of the True Cross'
      }
    ];
  }

  /**
   * Get Ethiopian fasting periods (approximated in Gregorian calendar)
   */
  getFastingPeriods(year: number): FastingPeriod[] {
    return [
      {
        name: 'Lent (Hudadi/Abiy Tsom)',
        nameAmharic: 'ሁዳዲ/አቢይ ጾም',
        startDate: { month: 2, day: 15 },
        endDate: { month: 4, day: 10 },
        description: 'The Great Lent - Fasting before Easter'
      },
      {
        name: 'Fast of the Prophets',
        nameAmharic: 'የነቢያት ጾም',
        startDate: { month: 11, day: 15 },
        endDate: { month: 12, day: 24 },
        description: 'Advent fast leading to Christmas'
      },
      {
        name: 'Fast of the Apostles',
        nameAmharic: 'የሐዋርያት ጾም',
        startDate: { month: 6, day: 15 },
        endDate: { month: 7, day: 12 },
        description: 'Fast commemorating the Apostles'
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
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    if (this.isHoliday(year, month, day)) {
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
   * Format Ethiopian date for display (now standard Gregorian format)
   */
  formatEthiopianDate(ethiopianDate: EthiopianDate, includeDay = true, useAmharic = false): string {
    const monthName = useAmharic ? ethiopianDate.monthNameAmharic : ethiopianDate.monthName;
    const dayName = useAmharic ? ethiopianDate.dayNameAmharic : ethiopianDate.dayName;
    
    if (includeDay) {
      return `${dayName}, ${monthName} ${ethiopianDate.ethiopianDay}, ${ethiopianDate.ethiopianYear}`;
    } else {
      return `${monthName} ${ethiopianDate.ethiopianDay}, ${ethiopianDate.ethiopianYear}`;
    }
  }

  /**
   * Get standard time
   */
  getEthiopianTime(date: Date = new Date()): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
}

// Export singleton instance
export const ethiopianCalendarService = new EthiopianCalendarService();

// Export utility functions
export const formatEthiopianDate = (date: Date, useAmharic = false): string => {
  const ethiopianDate = ethiopianCalendarService.convertToEthiopian(date);
  return ethiopianCalendarService.formatEthiopianDate(ethiopianDate, true, useAmharic);
};

export const getCurrentEthiopianYear = (): number => {
  return ethiopianCalendarService.getCurrentEthiopianDate().ethiopianYear;
};

export const isEthiopianHoliday = (date: Date): boolean => {
  const ethiopianDate = ethiopianCalendarService.convertToEthiopian(date);
  return ethiopianDate.isHoliday;
};

export const isEthiopianBusinessDay = (date: Date): boolean => {
  return ethiopianCalendarService.isBusinessDay(date);
};
