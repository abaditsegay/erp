// Ethiopian Language Service - Amharic Translation and Localization
// Comprehensive bilingual support for English and Amharic

export type LanguageCode = 'en' | 'am';

export interface EthiopianTranslation {
  en: string;
  am: string;
}

export interface EthiopianLocaleConfig {
  language: LanguageCode;
  direction: 'ltr' | 'rtl';
  numberFormat: 'arabic' | 'ethiopian';
  calendarSystem: 'gregorian' | 'ethiopian';
  currencySymbol: string;
  currencyFormat: 'prefix' | 'suffix';
}

// Core Business Terms Dictionary
export const BUSINESS_TERMS: Record<string, EthiopianTranslation> = {
  // Main Navigation
  dashboard: { en: 'Dashboard', am: 'ዳሽቦርድ' },
  inventory: { en: 'Inventory', am: 'ዕቃ ክምችት' },
  purchase: { en: 'Purchase', am: 'ግዢ' },
  finance: { en: 'Finance', am: 'ፋይናንስ' },
  logistics: { en: 'Logistics', am: 'ሎጂስቲክስ' },
  sales: { en: 'Sales', am: 'ሽያጭ' },
  reports: { en: 'Reports', am: 'ሪፖርቶች' },
  analytics: { en: 'Analytics', am: 'ትንተና' },
  settings: { en: 'Settings', am: 'ቅንብሮች' },

  // Common Actions
  create: { en: 'Create', am: 'ፍጠር' },
  edit: { en: 'Edit', am: 'አርም' },
  delete: { en: 'Delete', am: 'ሰርዝ' },
  save: { en: 'Save', am: 'አስቀምጥ' },
  cancel: { en: 'Cancel', am: 'ሰርዝ' },
  submit: { en: 'Submit', am: 'አስገባ' },
  approve: { en: 'Approve', am: 'ፍቀድ' },
  reject: { en: 'Reject', am: 'ውድቅ አድርግ' },
  view: { en: 'View', am: 'ተመልከት' },
  search: { en: 'Search', am: 'ፈልግ' },
  filter: { en: 'Filter', am: 'ማረግ' },
  export: { en: 'Export', am: 'ወደ ውጭ ላክ' },
  import: { en: 'Import', am: 'ከውጭ አስገባ' },
  print: { en: 'Print', am: 'አትም' },

  // Authentication Terms
  login: { en: 'Login', am: 'ግባ' },
  logout: { en: 'Logout', am: 'ውጣ' },
  signin: { en: 'Sign In', am: 'ግባ' },
  signout: { en: 'Sign Out', am: 'ውጣ' },
  password: { en: 'Password', am: 'የይለፍ ቃል' },
  username: { en: 'Username', am: 'የተጠቃሚ ስም' },
  email: { en: 'Email', am: 'ኢሜይል' },
  profile: { en: 'Profile', am: 'መገለጫ' },

  // Financial Terms
  payment: { en: 'Payment', am: 'ክፍያ' },
  invoice: { en: 'Invoice', am: 'ደረሰኝ' },
  receipt: { en: 'Receipt', am: 'ደረሰኝ' },
  expense: { en: 'Expense', am: 'ወጪ' },
  revenue: { en: 'Revenue', am: 'ገቢ' },
  profit: { en: 'Profit', am: 'ትርፍ' },
  loss: { en: 'Loss', am: 'ኪሳራ' },
  budget: { en: 'Budget', am: 'በጀት' },
  account: { en: 'Account', am: 'ሂሳብ' },
  balance: { en: 'Balance', am: 'ቀሪ' },
  tax: { en: 'Tax', am: 'ግብር' },
  vat: { en: 'VAT', am: 'ተጨ.እ.ግ' }, // ተጨማሪ እሴት ግብር
  withholdingTax: { en: 'Withholding Tax', am: 'ከምንጭ የሚቀነስ ግብር' },

  // Purchase/Procurement Terms
  supplier: { en: 'Supplier', am: 'አቅራቢ' },
  vendor: { en: 'Vendor', am: 'ሻጭ' },
  purchaseOrder: { en: 'Purchase Order', am: 'የግዢ ትዕዛዝ' },
  requisition: { en: 'Requisition', am: 'ጥያቄ' },
  quotation: { en: 'Quotation', am: 'ዋጋ ምዝገባ' },
  contract: { en: 'Contract', am: 'ውል' },
  delivery: { en: 'Delivery', am: 'ማድረስ' },
  goodsReceived: { en: 'Goods Received', am: 'የተቀበሉ ዕቃዎች' },

  // Inventory Terms
  stock: { en: 'Stock', am: 'ክምችት' },
  warehouse: { en: 'Warehouse', am: 'መጋዘን' },
  item: { en: 'Item', am: 'ዕቃ' },
  product: { en: 'Product', am: 'ምርት' },
  category: { en: 'Category', am: 'ምድብ' },
  quantity: { en: 'Quantity', am: 'መጠን' },
  unit: { en: 'Unit', am: 'አሃድ' },
  price: { en: 'Price', am: 'ዋጋ' },
  cost: { en: 'Cost', am: 'ወጪ' },
  barcode: { en: 'Barcode', am: 'የእቃ ኮድ' },
  inventory_advanced: { en: 'Advanced Inventory', am: 'የላቀ ዕቃ ክምችት' },

  // Logistics Terms
  shipment: { en: 'Shipment', am: 'መላኪያ' },
  transportation: { en: 'Transportation', am: 'መጓጓዣ' },
  customs: { en: 'Customs', am: 'ጉምሩክ' },
  clearance: { en: 'Clearance', am: 'መልቀቂያ' },
  tracking: { en: 'Tracking', am: 'ክትትል' },
  route: { en: 'Route', am: 'መንገድ' },
  destination: { en: 'Destination', am: 'መድረሻ' },

  // Status Terms
  pending: { en: 'Pending', am: 'በመጠባበቅ ላይ' },
  approved: { en: 'Approved', am: 'ፈቅዶ የወጣ' },
  rejected: { en: 'Rejected', am: 'ውድቅ የሆነ' },
  completed: { en: 'Completed', am: 'የተጠናቀቀ' },
  inProgress: { en: 'In Progress', am: 'በሂደት ላይ' },
  cancelled: { en: 'Cancelled', am: 'የተሰረዘ' },
  active: { en: 'Active', am: 'ንቁ' },
  inactive: { en: 'Inactive', am: 'ንቁ ያልሆነ' },

  // Date and Time
  today: { en: 'Today', am: 'ዛሬ' },
  yesterday: { en: 'Yesterday', am: 'ትናንት' },
  tomorrow: { en: 'Tomorrow', am: 'ነገ' },
  week: { en: 'Week', am: 'ሳምንት' },
  month: { en: 'Month', am: 'ወር' },
  year: { en: 'Year', am: 'አመት' },
  date: { en: 'Date', am: 'ቀን' },
  time: { en: 'Time', am: 'ሰዓት' },

  // People and Roles
  user: { en: 'User', am: 'ተጠቃሚ' },
  employee: { en: 'Employee', am: 'ሠራተኛ' },
  manager: { en: 'Manager', am: 'ሥራ አስኪያጅ' },
  administrator: { en: 'Administrator', am: 'ሥርዓት አስተዳዳሪ' },
  customer: { en: 'Customer', am: 'ደንበኛ' },
  client: { en: 'Client', am: 'ደንበኛ' },

  // Ethiopian Specific Terms
  birr: { en: 'Birr', am: 'ብር' },
  kebele: { en: 'Kebele', am: 'ቀበሌ' },
  woreda: { en: 'Woreda', am: 'ወረዳ' },
  region: { en: 'Region', am: 'ክልል' },
  addisAbaba: { en: 'Addis Ababa', am: 'አዲስ አበባ' },
  ethiopia: { en: 'Ethiopia', am: 'ኢትዮጵያ' },
  ethiopian: { en: 'Ethiopian', am: 'ኢትዮጵያዊ' },

  // Units and Measurements
  kilogram: { en: 'Kilogram', am: 'ኪሎግራም' },
  gram: { en: 'Gram', am: 'ግራም' },
  liter: { en: 'Liter', am: 'ሊትር' },
  meter: { en: 'Meter', am: 'ሜትር' },
  piece: { en: 'Piece', am: 'ቁጥር' },
  box: { en: 'Box', am: 'ሳጥን' },
  bag: { en: 'Bag', am: 'ከረጢት' },

  // Common Messages
  success: { en: 'Success', am: 'ተሳክቷል' },
  error: { en: 'Error', am: 'ስህተት' },
  warning: { en: 'Warning', am: 'ማስጠንቀቂያ' },
  info: { en: 'Information', am: 'መረጃ' },
  loading: { en: 'Loading...', am: 'በመጫን ላይ...' },
  noData: { en: 'No data available', am: 'መረጃ አልተገኘም' },
  confirmDelete: { en: 'Are you sure you want to delete?', am: 'በእርግጥ መሰረዝ ይፈልጋሉ?' },
  saveSuccess: { en: 'Saved successfully', am: 'በተሳካ ሁኔታ ተቀምጧል' },
  deleteSuccess: { en: 'Deleted successfully', am: 'በተሳካ ሁኔታ ተሰርዟል' },
  updateSuccess: { en: 'Updated successfully', am: 'በተሳካ ሁኔታ ተሻሽሏል' }
};

class EthiopianLanguageService {
  private currentLanguage: LanguageCode = 'en';
  private localeConfig: EthiopianLocaleConfig;

  constructor() {
    this.localeConfig = this.getDefaultLocaleConfig();
    this.loadLanguagePreference();
  }

  /**
   * Get default locale configuration
   */
  private getDefaultLocaleConfig(): EthiopianLocaleConfig {
    return {
      language: 'en',
      direction: 'ltr',
      numberFormat: 'arabic',
      calendarSystem: 'gregorian',
      currencySymbol: 'Br',
      currencyFormat: 'prefix'
    };
  }

  /**
   * Load language preference from localStorage
   */
  private loadLanguagePreference(): void {
    const savedLanguage = localStorage.getItem('ethiopianLanguage') as LanguageCode;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'am')) {
      this.setLanguage(savedLanguage);
    }
  }

  /**
   * Set current language
   */
  setLanguage(language: LanguageCode): void {
    this.currentLanguage = language;
    this.localeConfig.language = language;
    
    // Update direction for Amharic (left-to-right for both)
    this.localeConfig.direction = 'ltr';
    
    // Save preference
    localStorage.setItem('ethiopianLanguage', language);
    
    // Update document direction
    document.documentElement.dir = this.localeConfig.direction;
    document.documentElement.lang = language === 'am' ? 'am-ET' : 'en-US';
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): LanguageCode {
    return this.currentLanguage;
  }

  /**
   * Get current locale configuration
   */
  getLocaleConfig(): EthiopianLocaleConfig {
    return { ...this.localeConfig };
  }

  /**
   * Translate a term
   */
  translate(key: string): string {
    const translation = BUSINESS_TERMS[key];
    if (!translation) {
      console.warn(`Translation not found for key: ${key}`);
      return key; // Return key if translation not found
    }
    return translation[this.currentLanguage];
  }

  /**
   * Get translation object for a key
   */
  getTranslation(key: string): EthiopianTranslation | null {
    return BUSINESS_TERMS[key] || null;
  }

  /**
   * Translate multiple terms
   */
  translateMultiple(keys: string[]): Record<string, string> {
    const result: Record<string, string> = {};
    keys.forEach(key => {
      result[key] = this.translate(key);
    });
    return result;
  }

  /**
   * Format number according to Ethiopian conventions
   */
  formatNumber(value: number, decimals = 2): string {
    if (this.localeConfig.numberFormat === 'ethiopian') {
      // Ethiopian number formatting (future enhancement)
      return value.toLocaleString('am-ET', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
    } else {
      // Arabic numerals
      return value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
    }
  }

  /**
   * Format currency according to Ethiopian conventions
   */
  formatCurrency(amount: number, currency = 'ETB'): string {
    const formattedAmount = this.formatNumber(amount, 2);
    const symbol = currency === 'ETB' ? 'Br' : '$';
    
    if (this.localeConfig.currencyFormat === 'prefix') {
      return `${symbol} ${formattedAmount}`;
    } else {
      return `${formattedAmount} ${symbol}`;
    }
  }

  /**
   * Get language options for UI
   */
  getLanguageOptions(): Array<{ code: LanguageCode; label: string; nativeLabel: string }> {
    return [
      { code: 'en', label: 'English', nativeLabel: 'English' },
      { code: 'am', label: 'Amharic', nativeLabel: 'አማርኛ' }
    ];
  }

  /**
   * Check if current language is RTL
   */
  isRTL(): boolean {
    return this.localeConfig.direction === 'rtl';
  }

  /**
   * Get month names in current language
   */
  getMonthNames(): string[] {
    if (this.currentLanguage === 'am') {
      return [
        'መስከረም', 'ጥቅምት', 'ህዳር', 'ታህሳስ', 'ጥር', 'የካቲት',
        'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'
      ];
    } else {
      return [
        'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
        'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'
      ];
    }
  }

  /**
   * Get day names in current language
   */
  getDayNames(): string[] {
    if (this.currentLanguage === 'am') {
      return ['እሁድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'አርብ', 'ቅዳሜ'];
    } else {
      return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    }
  }

  /**
   * Add new translation
   */
  addTranslation(key: string, translation: EthiopianTranslation): void {
    BUSINESS_TERMS[key] = translation;
  }

  /**
   * Get all available translation keys
   */
  getAvailableKeys(): string[] {
    return Object.keys(BUSINESS_TERMS);
  }

  /**
   * Get greeting based on time of day
   */
  getGreeting(): string {
    const hour = new Date().getHours();
    
    if (this.currentLanguage === 'am') {
      if (hour < 12) {
        return 'እንደምን አደሩ'; // Good morning
      } else if (hour < 18) {
        return 'እንደምን ዋሉ'; // Good afternoon
      } else {
        return 'እንደምን አመሹ'; // Good evening
      }
    } else {
      if (hour < 12) {
        return 'Good morning';
      } else if (hour < 18) {
        return 'Good afternoon';
      } else {
        return 'Good evening';
      }
    }
  }
}

// Export singleton instance
export const ethiopianLanguageService = new EthiopianLanguageService();

// Export utility functions
export const translate = (key: string): string => {
  return ethiopianLanguageService.translate(key);
};

export const formatEthiopianCurrency = (amount: number, currency = 'ETB'): string => {
  return ethiopianLanguageService.formatCurrency(amount, currency);
};

export const formatEthiopianNumber = (value: number, decimals = 2): string => {
  return ethiopianLanguageService.formatNumber(value, decimals);
};

export const getCurrentLanguage = (): LanguageCode => {
  return ethiopianLanguageService.getCurrentLanguage();
};

export const setLanguage = (language: LanguageCode): void => {
  ethiopianLanguageService.setLanguage(language);
};
