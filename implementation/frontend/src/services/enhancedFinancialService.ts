/**
 * Enhanced Financial Reporting Service
 * Phase 1.4: Core ERP Module Enhancement
 * 
 * Features:
 * - Advanced financial statements
 * - Ethiopian accounting standards compliance
 * - Multi-currency reporting
 * - Real-time financial analytics
 * - Budget vs actual analysis
 * - Cash flow forecasting
 * - Tax reporting automation
 * - Audit trail management
 * - Financial ratio analysis
 * - Executive dashboards
 */

import { apiService } from './apiService';

// Enhanced Financial Interfaces
export interface FinancialStatement {
  id: string;
  type: 'BALANCE_SHEET' | 'INCOME_STATEMENT' | 'CASH_FLOW' | 'EQUITY_STATEMENT' | 'TRIAL_BALANCE';
  title: string;
  
  // Period Information
  fiscalYear: string;
  period: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  periodNumber: number;
  startDate: string;
  endDate: string;
  
  // Currency
  baseCurrency: string;
  reportingCurrency: string;
  exchangeRate?: number;
  
  // Statement Data
  sections: FinancialSection[];
  
  // Comparative Data
  hasComparative: boolean;
  comparativePeriod?: string;
  
  // Status
  status: 'DRAFT' | 'PRELIMINARY' | 'FINAL' | 'AUDITED';
  preparedBy: string;
  preparedByName: string;
  reviewedBy?: string;
  reviewedByName?: string;
  approvedBy?: string;
  approvedByName?: string;
  
  // Audit Information
  auditFirm?: string;
  auditDate?: string;
  auditOpinion?: 'UNQUALIFIED' | 'QUALIFIED' | 'ADVERSE' | 'DISCLAIMER';
  
  // Generation Info
  generatedAt: string;
  lastUpdated: string;
  
  // Notes
  notes: FinancialNote[];
  
  // Ethiopian Specific
  ethAccountingStandard: 'ESAS' | 'IFRS' | 'GAAP';
  taxYear: string;
  ercaSubmissionStatus?: 'PENDING' | 'SUBMITTED' | 'ACCEPTED' | 'REJECTED';
}

export interface FinancialSection {
  id: string;
  name: string;
  order: number;
  level: number;
  parentId?: string;
  
  // Account Information
  accountCode?: string;
  accountName?: string;
  accountType: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  accountSubType: string;
  
  // Amounts
  currentAmount: number;
  previousAmount?: number;
  budgetAmount?: number;
  variance?: number;
  variancePercentage?: number;
  
  // Display Options
  isHeader: boolean;
  isBold: boolean;
  isTotal: boolean;
  showAmount: boolean;
  indentLevel: number;
  
  // Children
  children?: FinancialSection[];
}

export interface FinancialNote {
  id: string;
  noteNumber: string;
  title: string;
  content: string;
  category: 'ACCOUNTING_POLICY' | 'SIGNIFICANT_ESTIMATE' | 'SUBSEQUENT_EVENT' | 'CONTINGENCY' | 'OTHER';
  references: string[];
}

export interface BudgetAnalysis {
  id: string;
  fiscalYear: string;
  period: string;
  department?: string;
  costCenter?: string;
  
  // Summary
  totalBudget: number;
  totalActual: number;
  totalVariance: number;
  variancePercentage: number;
  
  // Categories
  categories: BudgetCategory[];
  
  // Performance Indicators
  performanceMetrics: {
    budgetAccuracy: number;
    forecastAccuracy: number;
    spendingEfficiency: number;
    varianceAnalysis: 'FAVORABLE' | 'UNFAVORABLE' | 'NEUTRAL';
  };
  
  // Trends
  monthlyTrends: BudgetTrend[];
  
  // Generated Info
  generatedAt: string;
  generatedBy: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  code: string;
  type: 'REVENUE' | 'EXPENSE' | 'CAPITAL';
  
  // Amounts
  budgetAmount: number;
  actualAmount: number;
  variance: number;
  variancePercentage: number;
  
  // Forecast
  forecastAmount: number;
  remainingBudget: number;
  utilizationRate: number;
  
  // Sub-categories
  subCategories?: BudgetCategory[];
}

export interface BudgetTrend {
  period: string;
  budgetAmount: number;
  actualAmount: number;
  variance: number;
  cumulativeBudget: number;
  cumulativeActual: number;
  cumulativeVariance: number;
}

export interface CashFlowForecast {
  id: string;
  title: string;
  
  // Period
  startDate: string;
  endDate: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  
  // Opening Balance
  openingBalance: number;
  
  // Forecast Periods
  periods: CashFlowPeriod[];
  
  // Summary
  summary: {
    totalInflows: number;
    totalOutflows: number;
    netCashFlow: number;
    closingBalance: number;
    minimumBalance: number;
    maximumBalance: number;
    averageBalance: number;
  };
  
  // Assumptions
  assumptions: CashFlowAssumption[];
  
  // Risk Analysis
  riskFactors: {
    factor: string;
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    probability: number;
    mitigation: string;
  }[];
  
  // Status
  status: 'DRAFT' | 'APPROVED' | 'ACTUAL';
  generatedAt: string;
  generatedBy: string;
}

export interface CashFlowPeriod {
  period: string;
  openingBalance: number;
  
  // Inflows
  inflows: CashFlowItem[];
  totalInflows: number;
  
  // Outflows
  outflows: CashFlowItem[];
  totalOutflows: number;
  
  // Net Flow
  netCashFlow: number;
  closingBalance: number;
  
  // Variance (if actual vs forecast)
  forecastNetFlow?: number;
  variance?: number;
}

export interface CashFlowItem {
  id: string;
  category: string;
  description: string;
  amount: number;
  confidence: number;
  
  // Source
  sourceType: 'HISTORICAL' | 'BUDGET' | 'CONTRACT' | 'FORECAST' | 'MANUAL';
  sourceReference?: string;
  
  // Timing
  timing: 'BEGINNING' | 'MIDDLE' | 'END' | 'DISTRIBUTED';
  
  // Actual (if available)
  actualAmount?: number;
  variance?: number;
}

export interface CashFlowAssumption {
  id: string;
  category: 'SALES' | 'PURCHASES' | 'PAYROLL' | 'TAXES' | 'CAPEX' | 'OTHER';
  description: string;
  value: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface FinancialRatios {
  // Liquidity Ratios
  liquidity: {
    currentRatio: number;
    quickRatio: number;
    cashRatio: number;
    workingCapital: number;
    workingCapitalRatio: number;
  };
  
  // Profitability Ratios
  profitability: {
    grossProfitMargin: number;
    operatingProfitMargin: number;
    netProfitMargin: number;
    returnOnAssets: number;
    returnOnEquity: number;
    returnOnInvestment: number;
    ebitdaMargin: number;
  };
  
  // Efficiency Ratios
  efficiency: {
    assetTurnover: number;
    inventoryTurnover: number;
    receivablesTurnover: number;
    payablesTurnover: number;
    daysInInventory: number;
    daysInReceivables: number;
    daysInPayables: number;
    cashConversionCycle: number;
  };
  
  // Leverage Ratios
  leverage: {
    debtToEquity: number;
    debtToAssets: number;
    equityRatio: number;
    interestCoverage: number;
    debtServiceCoverage: number;
    fixedChargeCoverage: number;
  };
  
  // Market Ratios (if applicable)
  market?: {
    priceToEarnings: number;
    priceToBook: number;
    earningsPerShare: number;
    bookValuePerShare: number;
    dividendYield: number;
  };
  
  // Industry Benchmarks
  benchmarks?: {
    industry: string;
    industryAverages: {
      currentRatio: number;
      quickRatio: number;
      grossProfitMargin: number;
      netProfitMargin: number;
      returnOnAssets: number;
      returnOnEquity: number;
      debtToEquity: number;
    };
  };
  
  // Analysis Period
  period: string;
  generatedAt: string;
}

export interface TaxReport {
  id: string;
  type: 'VAT' | 'INCOME_TAX' | 'WITHHOLDING_TAX' | 'EXCISE_TAX' | 'CUSTOMS_DUTY' | 'TURNOVER_TAX';
  title: string;
  
  // Period
  taxPeriod: string;
  startDate: string;
  endDate: string;
  
  // Authority
  taxAuthority: 'ERCA' | 'REGIONAL' | 'MUNICIPAL';
  submissionDeadline: string;
  
  // Tax Calculations
  calculations: TaxCalculation[];
  
  // Summary
  summary: {
    totalTaxable: number;
    totalTax: number;
    totalPaid: number;
    totalDue: number;
    penalties: number;
    interest: number;
    netPayable: number;
  };
  
  // Supporting Documents
  supportingDocuments: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
  
  // Submission
  submissionStatus: 'DRAFT' | 'READY' | 'SUBMITTED' | 'ACCEPTED' | 'REJECTED';
  submittedAt?: string;
  submittedBy?: string;
  ercaReference?: string;
  
  // Status
  preparedBy: string;
  preparedByName: string;
  reviewedBy?: string;
  reviewedByName?: string;
  
  generatedAt: string;
  lastUpdated: string;
}

export interface TaxCalculation {
  id: string;
  description: string;
  taxType: string;
  
  // Base Amounts
  taxableAmount: number;
  exemptAmount: number;
  
  // Tax Calculation
  taxRate: number;
  taxAmount: number;
  
  // Credits and Deductions
  credits: number;
  deductions: number;
  
  // Net Tax
  netTaxAmount: number;
  
  // Supporting Accounts
  supportingAccounts: string[];
}

export interface AuditTrail {
  id: string;
  entityType: 'JOURNAL_ENTRY' | 'INVOICE' | 'PAYMENT' | 'ADJUSTMENT' | 'REPORT';
  entityId: string;
  
  // User Information
  userId: string;
  userName: string;
  userRole: string;
  
  // Action Information
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'REVERSE' | 'GENERATE' | 'EXPORT';
  description: string;
  
  // Changes
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  
  // Context
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  
  // Timestamp
  timestamp: string;
  
  // Business Context
  businessReason?: string;
  approvalRequired?: boolean;
  approvedBy?: string;
  approvalDate?: string;
}

export interface FinancialDashboard {
  // Key Performance Indicators
  kpis: {
    totalRevenue: number;
    totalExpenses: number;
    netIncome: number;
    grossProfit: number;
    ebitda: number;
    cashBalance: number;
    accountsReceivable: number;
    accountsPayable: number;
    workingCapital: number;
    
    // Period Comparisons
    revenueGrowth: number;
    expenseGrowth: number;
    profitGrowth: number;
    cashGrowth: number;
  };
  
  // Charts Data
  charts: {
    revenueVsExpense: ChartData;
    monthlyProfitability: ChartData;
    cashFlowTrend: ChartData;
    expenseBreakdown: ChartData;
    revenueByCategory: ChartData;
    budgetVsActual: ChartData;
  };
  
  // Financial Health Indicators
  healthIndicators: {
    liquidityScore: number;
    profitabilityScore: number;
    efficiencyScore: number;
    stabilityScore: number;
    overallScore: number;
    
    // Alerts
    alerts: {
      type: 'WARNING' | 'CRITICAL' | 'INFO';
      message: string;
      action: string;
    }[];
  };
  
  // Recent Transactions
  recentTransactions: {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    category: string;
  }[];
  
  // Aging Analysis
  agingAnalysis: {
    receivables: AgingBucket[];
    payables: AgingBucket[];
  };
  
  // Period Information
  period: string;
  lastUpdated: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    fill?: boolean;
  }[];
}

export interface AgingBucket {
  period: string;
  amount: number;
  percentage: number;
  count: number;
}

class EnhancedFinancialService {
  /**
   * Financial Statements
   */
  async getFinancialStatement(
    type: FinancialStatement['type'],
    options: {
      fiscalYear: string;
      period: string;
      periodNumber?: number;
      currency?: string;
      comparative?: boolean;
    }
  ): Promise<FinancialStatement> {
    try {
      const params = new URLSearchParams();
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await apiService.get(`/finance/statements/${type}?${params}`);
      return response.data as FinancialStatement;
    } catch (error) {
      console.error('Error fetching financial statement:', error);
      return this.getMockFinancialStatement(type, options);
    }
  }

  /**
   * Budget Analysis
   */
  async getBudgetAnalysis(filters: {
    fiscalYear: string;
    period?: string;
    department?: string;
    costCenter?: string;
  }): Promise<BudgetAnalysis> {
    try {
      const response = await apiService.post('/finance/budget/analysis', filters);
      return response.data as BudgetAnalysis;
    } catch (error) {
      console.error('Error fetching budget analysis:', error);
      return this.getMockBudgetAnalysis();
    }
  }

  /**
   * Cash Flow Forecast
   */
  async getCashFlowForecast(options: {
    startDate: string;
    endDate: string;
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    scenarioType?: 'OPTIMISTIC' | 'REALISTIC' | 'PESSIMISTIC';
  }): Promise<CashFlowForecast> {
    try {
      const response = await apiService.post('/finance/cashflow/forecast', options);
      return response.data as CashFlowForecast;
    } catch (error) {
      console.error('Error fetching cash flow forecast:', error);
      return this.getMockCashFlowForecast();
    }
  }

  /**
   * Financial Ratios
   */
  async getFinancialRatios(options: {
    period: string;
    includeBenchmarks?: boolean;
    industry?: string;
  }): Promise<FinancialRatios> {
    try {
      const response = await apiService.post('/finance/ratios', options);
      return response.data as FinancialRatios;
    } catch (error) {
      console.error('Error fetching financial ratios:', error);
      return this.getMockFinancialRatios();
    }
  }

  /**
   * Tax Reports
   */
  async getTaxReports(filters: {
    type?: string;
    taxPeriod?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  } = {}): Promise<TaxReport[]> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await apiService.get(`/finance/tax/reports?${params}`);
      return response.data as TaxReport[];
    } catch (error) {
      console.error('Error fetching tax reports:', error);
      return this.getMockTaxReports();
    }
  }

  async generateTaxReport(options: {
    type: TaxReport['type'];
    startDate: string;
    endDate: string;
    autoSubmit?: boolean;
  }): Promise<TaxReport> {
    try {
      const response = await apiService.post('/finance/tax/generate', options);
      return response.data as TaxReport;
    } catch (error) {
      console.error('Error generating tax report:', error);
      throw error;
    }
  }

  /**
   * Audit Trail
   */
  async getAuditTrail(filters: {
    entityType?: string;
    entityId?: string;
    userId?: string;
    action?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{
    auditEntries: AuditTrail[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await apiService.get(`/finance/audit/trail?${params}`);
      return response.data as {
        auditEntries: AuditTrail[];
        total: number;
        page: number;
        totalPages: number;
      };
    } catch (error) {
      console.error('Error fetching audit trail:', error);
      return this.getMockAuditTrail();
    }
  }

  /**
   * Financial Dashboard
   */
  async getFinancialDashboard(options: {
    period: string;
    currency?: string;
    includeComparisons?: boolean;
  }): Promise<FinancialDashboard> {
    try {
      // Temporarily return mock data directly for debugging
      console.log('Loading financial dashboard for period:', options.period);
      return this.getMockFinancialDashboard();
      
      // TODO: Re-enable API call when backend is ready
      // const response = await apiService.post('/finance/dashboard', options);
      // return response.data as FinancialDashboard;
    } catch (error) {
      console.error('Error fetching financial dashboard:', error);
      return this.getMockFinancialDashboard();
    }
  }

  /**
   * Export Reports
   */
  async exportReport(options: {
    reportType: string;
    reportId?: string;
    format: 'PDF' | 'EXCEL' | 'CSV';
    parameters?: any;
  }): Promise<{
    downloadUrl: string;
    fileName: string;
  }> {
    try {
      const response = await apiService.post('/finance/reports/export', options);
      return response.data as {
        downloadUrl: string;
        fileName: string;
      };
    } catch (error) {
      console.error('Error exporting report:', error);
      throw error;
    }
  }

  // Mock data methods for development
  private getMockFinancialStatement(type: FinancialStatement['type'], options: any): FinancialStatement {
    return {
      id: '1',
      type,
      title: `${type.replace('_', ' ')} Statement`,
      fiscalYear: options.fiscalYear || '2024',
      period: options.period || 'MONTHLY',
      periodNumber: options.periodNumber || 12,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      baseCurrency: 'ETB',
      reportingCurrency: options.currency || 'ETB',
      sections: [],
      hasComparative: options.comparative || false,
      status: 'FINAL',
      preparedBy: 'user1',
      preparedByName: 'Finance Manager',
      generatedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      notes: [],
      ethAccountingStandard: 'ESAS',
      taxYear: '2024'
    };
  }

  private getMockBudgetAnalysis(): BudgetAnalysis {
    return {
      id: '1',
      fiscalYear: '2024',
      period: '2024-12',
      totalBudget: 10000000,
      totalActual: 9750000,
      totalVariance: -250000,
      variancePercentage: -2.5,
      categories: [
        {
          id: '1',
          name: 'Revenue',
          code: 'REV',
          type: 'REVENUE',
          budgetAmount: 12000000,
          actualAmount: 11800000,
          variance: -200000,
          variancePercentage: -1.67,
          forecastAmount: 11900000,
          remainingBudget: 200000,
          utilizationRate: 98.33
        }
      ],
      performanceMetrics: {
        budgetAccuracy: 97.5,
        forecastAccuracy: 99.2,
        spendingEfficiency: 102.1,
        varianceAnalysis: 'FAVORABLE'
      },
      monthlyTrends: [],
      generatedAt: new Date().toISOString(),
      generatedBy: 'Finance Manager'
    };
  }

  private getMockCashFlowForecast(): CashFlowForecast {
    return {
      id: '1',
      title: 'Monthly Cash Flow Forecast',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      frequency: 'MONTHLY',
      openingBalance: 5000000,
      periods: [],
      summary: {
        totalInflows: 120000000,
        totalOutflows: 115000000,
        netCashFlow: 5000000,
        closingBalance: 10000000,
        minimumBalance: 3000000,
        maximumBalance: 12000000,
        averageBalance: 7500000
      },
      assumptions: [],
      riskFactors: [],
      status: 'APPROVED',
      generatedAt: new Date().toISOString(),
      generatedBy: 'Finance Manager'
    };
  }

  private getMockFinancialRatios(): FinancialRatios {
    return {
      liquidity: {
        currentRatio: 2.45,
        quickRatio: 1.85,
        cashRatio: 0.65,
        workingCapital: 15000000,
        workingCapitalRatio: 0.35
      },
      profitability: {
        grossProfitMargin: 45.5,
        operatingProfitMargin: 18.7,
        netProfitMargin: 12.3,
        returnOnAssets: 15.8,
        returnOnEquity: 22.4,
        returnOnInvestment: 19.2,
        ebitdaMargin: 25.1
      },
      efficiency: {
        assetTurnover: 1.28,
        inventoryTurnover: 8.5,
        receivablesTurnover: 12.3,
        payablesTurnover: 15.2,
        daysInInventory: 43,
        daysInReceivables: 30,
        daysInPayables: 24,
        cashConversionCycle: 49
      },
      leverage: {
        debtToEquity: 0.65,
        debtToAssets: 0.39,
        equityRatio: 0.61,
        interestCoverage: 8.5,
        debtServiceCoverage: 2.8,
        fixedChargeCoverage: 3.2
      },
      period: '2024-12',
      generatedAt: new Date().toISOString()
    };
  }

  private getMockTaxReports(): TaxReport[] {
    return [
      {
        id: '1',
        type: 'VAT',
        title: 'VAT Return - December 2024',
        taxPeriod: '2024-12',
        startDate: '2024-12-01',
        endDate: '2024-12-31',
        taxAuthority: 'ERCA',
        submissionDeadline: '2025-01-10',
        calculations: [],
        summary: {
          totalTaxable: 5000000,
          totalTax: 750000,
          totalPaid: 700000,
          totalDue: 50000,
          penalties: 0,
          interest: 0,
          netPayable: 50000
        },
        supportingDocuments: [],
        submissionStatus: 'READY',
        preparedBy: 'user1',
        preparedByName: 'Tax Manager',
        generatedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }
    ];
  }

  private getMockAuditTrail(): any {
    return {
      auditEntries: [
        {
          id: '1',
          entityType: 'JOURNAL_ENTRY',
          entityId: 'je001',
          userId: 'user1',
          userName: 'Finance Manager',
          userRole: 'FINANCE_MANAGER',
          action: 'CREATE',
          description: 'Created journal entry for monthly accruals',
          newValues: { amount: 50000, description: 'Monthly accruals' },
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0...',
          sessionId: 'sess123',
          timestamp: new Date().toISOString()
        }
      ],
      total: 1,
      page: 1,
      totalPages: 1
    };
  }

  private getMockFinancialDashboard(): FinancialDashboard {
    return {
      kpis: {
        totalRevenue: 12000000,
        totalExpenses: 9000000,
        netIncome: 3000000,
        grossProfit: 5400000,
        ebitda: 3600000,
        cashBalance: 8500000,
        accountsReceivable: 2400000,
        accountsPayable: 1800000,
        workingCapital: 4200000,
        revenueGrowth: 15.2,
        expenseGrowth: 8.7,
        profitGrowth: 28.5,
        cashGrowth: 12.3
      },
      charts: {
        revenueVsExpense: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Revenue',
              data: [1000000, 1100000, 1200000, 1150000, 1300000, 1250000]
            },
            {
              label: 'Expenses',
              data: [750000, 800000, 850000, 820000, 900000, 880000]
            }
          ]
        },
        monthlyProfitability: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Net Profit',
              data: [250000, 300000, 350000, 330000, 400000, 370000]
            }
          ]
        },
        cashFlowTrend: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Cash Flow',
              data: [200000, 150000, 300000, 250000, 350000, 280000]
            }
          ]
        },
        expenseBreakdown: {
          labels: ['Salaries', 'Materials', 'Utilities', 'Marketing', 'Other'],
          datasets: [
            {
              label: 'Expenses',
              data: [4000000, 2500000, 800000, 1200000, 500000]
            }
          ]
        },
        revenueByCategory: {
          labels: ['Product Sales', 'Services', 'Consulting', 'Other'],
          datasets: [
            {
              label: 'Revenue',
              data: [8000000, 2500000, 1200000, 300000]
            }
          ]
        },
        budgetVsActual: {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          datasets: [
            {
              label: 'Budget',
              data: [2800000, 3000000, 3200000, 3000000]
            },
            {
              label: 'Actual',
              data: [2750000, 3100000, 3150000, 3000000]
            }
          ]
        }
      },
      healthIndicators: {
        liquidityScore: 85,
        profitabilityScore: 92,
        efficiencyScore: 78,
        stabilityScore: 88,
        overallScore: 86,
        alerts: [
          {
            type: 'INFO',
            message: 'Cash flow is healthy for the next 3 months',
            action: 'Continue monitoring receivables collection'
          }
        ]
      },
      recentTransactions: [
        {
          id: '1',
          date: new Date().toISOString(),
          description: 'Coffee Sales - Export',
          amount: 1250000,
          type: 'INCOME',
          category: 'Sales Revenue'
        }
      ],
      agingAnalysis: {
        receivables: [
          { period: '0-30 days', amount: 1800000, percentage: 75, count: 45 },
          { period: '31-60 days', amount: 400000, percentage: 17, count: 12 },
          { period: '61-90 days', amount: 150000, percentage: 6, count: 5 },
          { period: '90+ days', amount: 50000, percentage: 2, count: 3 }
        ],
        payables: [
          { period: '0-30 days', amount: 1200000, percentage: 67, count: 38 },
          { period: '31-60 days', amount: 450000, percentage: 25, count: 15 },
          { period: '61-90 days', amount: 120000, percentage: 7, count: 4 },
          { period: '90+ days', amount: 30000, percentage: 1, count: 2 }
        ]
      },
      period: '2024-12',
      lastUpdated: new Date().toISOString()
    };
  }
}

export const enhancedFinancialService = new EnhancedFinancialService();
export default EnhancedFinancialService;
