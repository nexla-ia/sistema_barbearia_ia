export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: TransactionCategory;
  subcategory?: string;
  amount: number;
  description: string;
  date: Date;
  paymentMethod: PaymentMethod;
  reference?: string; // Número do agendamento, nota fiscal, etc.
  attachments?: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
  isActive: boolean;
  subcategories?: string[];
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'cash' | 'card' | 'pix' | 'transfer' | 'check' | 'other';
  isActive: boolean;
  fees?: number; // Taxa em percentual
}

export interface CashRegister {
  id: string;
  date: Date;
  openingBalance: number;
  closingBalance: number;
  expectedBalance: number;
  difference: number;
  status: 'open' | 'closed' | 'pending_review';
  openedBy: string;
  closedBy?: string;
  openedAt: Date;
  closedAt?: Date;
  transactions: Transaction[];
  cashMovements: CashMovement[];
  notes?: string;
}

export interface CashMovement {
  id: string;
  type: 'withdrawal' | 'supply'; // Sangria ou suprimento
  amount: number;
  reason: string;
  authorizedBy: string;
  createdAt: Date;
}

export interface Account {
  id: string;
  type: 'payable' | 'receivable';
  category: string;
  description: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  installments?: AccountInstallment[];
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  supplier?: string;
  client?: string;
  reference?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountInstallment {
  id: string;
  installmentNumber: number;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'pending' | 'paid' | 'overdue';
}

export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // A cada X dias/semanas/meses/anos
  endDate?: Date;
  maxOccurrences?: number;
}

export interface CashFlow {
  period: {
    start: Date;
    end: Date;
  };
  opening: number;
  income: {
    total: number;
    byCategory: { [key: string]: number };
    byPaymentMethod: { [key: string]: number };
  };
  expenses: {
    total: number;
    byCategory: { [key: string]: number };
    byPaymentMethod: { [key: string]: number };
  };
  closing: number;
  projection?: CashFlowProjection;
}

export interface CashFlowProjection {
  period: {
    start: Date;
    end: Date;
  };
  projectedIncome: number;
  projectedExpenses: number;
  projectedBalance: number;
  scenarios: {
    optimistic: number;
    realistic: number;
    pessimistic: number;
  };
}

export interface FiscalDocument {
  id: string;
  type: 'nfe' | 'receipt' | 'invoice' | 'tax_document';
  number: string;
  series?: string;
  date: Date;
  amount: number;
  client?: string;
  supplier?: string;
  description: string;
  status: 'draft' | 'issued' | 'cancelled';
  xmlUrl?: string;
  pdfUrl?: string;
  createdAt: Date;
}

export interface TaxObligation {
  id: string;
  type: 'simples' | 'mei' | 'lucro_presumido' | 'lucro_real';
  name: string;
  dueDate: Date;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  reference: string; // Período de referência
  calculationBase: number;
  rate: number;
  createdAt: Date;
}

export interface FinancialReport {
  id: string;
  type: 'dre' | 'balance_sheet' | 'cash_flow' | 'performance' | 'custom';
  name: string;
  period: {
    start: Date;
    end: Date;
  };
  data: any;
  filters: ReportFilters;
  generatedAt: Date;
  generatedBy: string;
}

export interface ReportFilters {
  services?: string[];
  professionals?: string[];
  paymentMethods?: string[];
  categories?: string[];
  clients?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface DRE {
  period: {
    start: Date;
    end: Date;
  };
  revenue: {
    services: number;
    products: number;
    other: number;
    total: number;
  };
  expenses: {
    fixed: number;
    variable: number;
    total: number;
  };
  grossProfit: number;
  operatingExpenses: {
    administrative: number;
    commercial: number;
    total: number;
  };
  ebitda: number;
  financialResult: number;
  netIncome: number;
  margins: {
    gross: number;
    ebitda: number;
    net: number;
  };
}

export interface BalanceSheet {
  date: Date;
  assets: {
    current: {
      cash: number;
      accountsReceivable: number;
      inventory: number;
      other: number;
      total: number;
    };
    nonCurrent: {
      equipment: number;
      furniture: number;
      other: number;
      total: number;
    };
    total: number;
  };
  liabilities: {
    current: {
      accountsPayable: number;
      taxes: number;
      other: number;
      total: number;
    };
    nonCurrent: {
      loans: number;
      other: number;
      total: number;
    };
    total: number;
  };
  equity: {
    capital: number;
    retainedEarnings: number;
    total: number;
  };
}

export interface PerformanceMetrics {
  period: {
    start: Date;
    end: Date;
  };
  revenue: {
    total: number;
    growth: number;
    byService: { [key: string]: number };
    byProfessional: { [key: string]: number };
    byPaymentMethod: { [key: string]: number };
  };
  averageTicket: {
    current: number;
    previous: number;
    growth: number;
  };
  profitability: {
    gross: number;
    net: number;
    ebitda: number;
  };
  efficiency: {
    costPerService: number;
    revenuePerProfessional: number;
    utilizationRate: number;
  };
}

export interface BankReconciliation {
  id: string;
  bankAccount: string;
  period: {
    start: Date;
    end: Date;
  };
  bankBalance: number;
  systemBalance: number;
  difference: number;
  status: 'pending' | 'reconciled' | 'discrepancy';
  transactions: ReconciliationTransaction[];
  createdAt: Date;
  reconciledAt?: Date;
  reconciledBy?: string;
}

export interface ReconciliationTransaction {
  id: string;
  bankTransactionId?: string;
  systemTransactionId?: string;
  date: Date;
  description: string;
  amount: number;
  status: 'matched' | 'unmatched' | 'pending';
  type: 'bank_only' | 'system_only' | 'matched';
}

export interface FinancialAlert {
  id: string;
  type: 'due_date' | 'low_cash' | 'high_expense' | 'target_achieved' | 'custom';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
  relatedEntity?: {
    type: 'account' | 'transaction' | 'cash_register';
    id: string;
  };
}

export interface FinancialSettings {
  cashRegister: {
    autoClose: boolean;
    closeTime: string;
    requireApproval: boolean;
    maxDifference: number;
  };
  alerts: {
    dueDateDays: number;
    lowCashThreshold: number;
    highExpenseThreshold: number;
  };
  fiscal: {
    companyType: 'mei' | 'simples' | 'lucro_presumido' | 'lucro_real';
    taxRegime: string;
    cnpj?: string;
    stateRegistration?: string;
    municipalRegistration?: string;
  };
  backup: {
    frequency: 'daily' | 'weekly' | 'monthly';
    retention: number; // dias
    autoBackup: boolean;
  };
}