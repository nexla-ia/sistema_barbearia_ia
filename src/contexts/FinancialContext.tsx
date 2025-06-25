import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  Transaction,
  CashRegister,
  Account,
  CashFlow,
  FiscalDocument,
  TaxObligation,
  DRE,
  BalanceSheet,
  PerformanceMetrics,
  BankReconciliation,
  FinancialAlert,
  FinancialSettings,
  TransactionCategory,
  PaymentMethod,
  CashMovement
} from '../types/financial';

interface FinancialState {
  transactions: Transaction[];
  cashRegisters: CashRegister[];
  currentCashRegister: CashRegister | null;
  accounts: Account[];
  fiscalDocuments: FiscalDocument[];
  taxObligations: TaxObligation[];
  alerts: FinancialAlert[];
  categories: TransactionCategory[];
  paymentMethods: PaymentMethod[];
  settings: FinancialSettings;
  loading: boolean;
  error: string | null;
}

type FinancialAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_CASH_REGISTERS'; payload: CashRegister[] }
  | { type: 'SET_CURRENT_CASH_REGISTER'; payload: CashRegister | null }
  | { type: 'UPDATE_CASH_REGISTER'; payload: CashRegister }
  | { type: 'SET_ACCOUNTS'; payload: Account[] }
  | { type: 'ADD_ACCOUNT'; payload: Account }
  | { type: 'UPDATE_ACCOUNT'; payload: Account }
  | { type: 'DELETE_ACCOUNT'; payload: string }
  | { type: 'SET_FISCAL_DOCUMENTS'; payload: FiscalDocument[] }
  | { type: 'ADD_FISCAL_DOCUMENT'; payload: FiscalDocument }
  | { type: 'SET_TAX_OBLIGATIONS'; payload: TaxObligation[] }
  | { type: 'SET_ALERTS'; payload: FinancialAlert[] }
  | { type: 'ADD_ALERT'; payload: FinancialAlert }
  | { type: 'MARK_ALERT_READ'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: TransactionCategory[] }
  | { type: 'SET_PAYMENT_METHODS'; payload: PaymentMethod[] }
  | { type: 'SET_SETTINGS'; payload: FinancialSettings };

const initialState: FinancialState = {
  transactions: [],
  cashRegisters: [],
  currentCashRegister: null,
  accounts: [],
  fiscalDocuments: [],
  taxObligations: [],
  alerts: [],
  categories: [],
  paymentMethods: [],
  settings: {
    cashRegister: {
      autoClose: true,
      closeTime: '22:00',
      requireApproval: false,
      maxDifference: 10,
    },
    alerts: {
      dueDateDays: 5,
      lowCashThreshold: 500,
      highExpenseThreshold: 5000,
    },
    fiscal: {
      companyType: 'mei',
      taxRegime: 'Simples Nacional',
    },
    backup: {
      frequency: 'daily',
      retention: 30,
      autoBackup: true,
    },
  },
  loading: false,
  error: null,
};

function financialReducer(state: FinancialState, action: FinancialAction): FinancialState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    case 'SET_CASH_REGISTERS':
      return { ...state, cashRegisters: action.payload };
    case 'SET_CURRENT_CASH_REGISTER':
      return { ...state, currentCashRegister: action.payload };
    case 'UPDATE_CASH_REGISTER':
      return {
        ...state,
        cashRegisters: state.cashRegisters.map(cr =>
          cr.id === action.payload.id ? action.payload : cr
        ),
        currentCashRegister: state.currentCashRegister?.id === action.payload.id 
          ? action.payload 
          : state.currentCashRegister,
      };
    case 'SET_ACCOUNTS':
      return { ...state, accounts: action.payload };
    case 'ADD_ACCOUNT':
      return { ...state, accounts: [...state.accounts, action.payload] };
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.map(a =>
          a.id === action.payload.id ? action.payload : a
        ),
      };
    case 'DELETE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.filter(a => a.id !== action.payload),
      };
    case 'SET_FISCAL_DOCUMENTS':
      return { ...state, fiscalDocuments: action.payload };
    case 'ADD_FISCAL_DOCUMENT':
      return { ...state, fiscalDocuments: [...state.fiscalDocuments, action.payload] };
    case 'SET_TAX_OBLIGATIONS':
      return { ...state, taxObligations: action.payload };
    case 'SET_ALERTS':
      return { ...state, alerts: action.payload };
    case 'ADD_ALERT':
      return { ...state, alerts: [...state.alerts, action.payload] };
    case 'MARK_ALERT_READ':
      return {
        ...state,
        alerts: state.alerts.map(a =>
          a.id === action.payload ? { ...a, isRead: true } : a
        ),
      };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_PAYMENT_METHODS':
      return { ...state, paymentMethods: action.payload };
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    default:
      return state;
  }
}

const FinancialContext = createContext<{
  state: FinancialState;
  dispatch: React.Dispatch<FinancialAction>;
  openCashRegister: (openingBalance: number) => Promise<void>;
  closeCashRegister: (closingBalance: number, notes?: string) => Promise<void>;
  addCashMovement: (movement: Omit<CashMovement, 'id' | 'createdAt'>) => Promise<void>;
  generateCashFlow: (startDate: Date, endDate: Date) => Promise<CashFlow>;
  generateDRE: (startDate: Date, endDate: Date) => Promise<DRE>;
  generateBalanceSheet: (date: Date) => Promise<BalanceSheet>;
  generatePerformanceReport: (startDate: Date, endDate: Date) => Promise<PerformanceMetrics>;
  reconcileBank: (bankAccount: string, transactions: any[]) => Promise<BankReconciliation>;
  generateFiscalDocument: (type: string, data: any) => Promise<FiscalDocument>;
  calculateTaxes: (period: { start: Date; end: Date }) => Promise<TaxObligation[]>;
  exportReport: (reportType: string, data: any) => Promise<Blob>;
} | null>(null);

export function FinancialProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(financialReducer, initialState);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Mock data - in production, this would come from your API
      const mockCategories: TransactionCategory[] = [
        {
          id: 'cat1',
          name: 'Serviços',
          type: 'income',
          color: '#10B981',
          icon: 'scissors',
          isActive: true,
          subcategories: ['Corte', 'Barba', 'Sobrancelha', 'Outros'],
        },
        {
          id: 'cat2',
          name: 'Produtos',
          type: 'income',
          color: '#3B82F6',
          icon: 'package',
          isActive: true,
          subcategories: ['Pomadas', 'Shampoos', 'Óleos', 'Outros'],
        },
        {
          id: 'cat3',
          name: 'Aluguel',
          type: 'expense',
          color: '#EF4444',
          icon: 'home',
          isActive: true,
        },
        {
          id: 'cat4',
          name: 'Salários',
          type: 'expense',
          color: '#F59E0B',
          icon: 'users',
          isActive: true,
        },
        {
          id: 'cat5',
          name: 'Materiais',
          type: 'expense',
          color: '#8B5CF6',
          icon: 'shopping-cart',
          isActive: true,
        },
      ];

      const mockPaymentMethods: PaymentMethod[] = [
        { id: 'cash', name: 'Dinheiro', type: 'cash', isActive: true },
        { id: 'debit', name: 'Cartão Débito', type: 'card', isActive: true, fees: 2.5 },
        { id: 'credit', name: 'Cartão Crédito', type: 'card', isActive: true, fees: 3.5 },
        { id: 'pix', name: 'PIX', type: 'pix', isActive: true, fees: 0 },
      ];

      const mockTransactions: Transaction[] = [
        {
          id: 't1',
          type: 'income',
          category: mockCategories[0],
          amount: 35,
          description: 'Corte de cabelo - João Silva',
          date: new Date(),
          paymentMethod: mockPaymentMethods[0],
          reference: 'AGD001',
          createdBy: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 't2',
          type: 'expense',
          category: mockCategories[2],
          amount: 1200,
          description: 'Aluguel do salão - Janeiro 2024',
          date: new Date(),
          paymentMethod: mockPaymentMethods[3],
          createdBy: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockAccounts: Account[] = [
        {
          id: 'acc1',
          type: 'payable',
          category: 'Aluguel',
          description: 'Aluguel do salão - Fevereiro 2024',
          amount: 1200,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          status: 'pending',
          isRecurring: true,
          recurrencePattern: {
            frequency: 'monthly',
            interval: 1,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockAlerts: FinancialAlert[] = [
        {
          id: 'alert1',
          type: 'due_date',
          title: 'Conta próxima do vencimento',
          message: 'Aluguel do salão vence em 3 dias',
          severity: 'warning',
          isRead: false,
          createdAt: new Date(),
          relatedEntity: {
            type: 'account',
            id: 'acc1',
          },
        },
      ];

      dispatch({ type: 'SET_CATEGORIES', payload: mockCategories });
      dispatch({ type: 'SET_PAYMENT_METHODS', payload: mockPaymentMethods });
      dispatch({ type: 'SET_TRANSACTIONS', payload: mockTransactions });
      dispatch({ type: 'SET_ACCOUNTS', payload: mockAccounts });
      dispatch({ type: 'SET_ALERTS', payload: mockAlerts });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load financial data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const openCashRegister = async (openingBalance: number): Promise<void> => {
    const newCashRegister: CashRegister = {
      id: `cr_${Date.now()}`,
      date: new Date(),
      openingBalance,
      closingBalance: 0,
      expectedBalance: openingBalance,
      difference: 0,
      status: 'open',
      openedBy: 'admin',
      openedAt: new Date(),
      transactions: [],
      cashMovements: [],
    };

    dispatch({ type: 'SET_CURRENT_CASH_REGISTER', payload: newCashRegister });
    dispatch({ type: 'SET_CASH_REGISTERS', payload: [...state.cashRegisters, newCashRegister] });
  };

  const closeCashRegister = async (closingBalance: number, notes?: string): Promise<void> => {
    if (!state.currentCashRegister) return;

    const expectedBalance = state.currentCashRegister.openingBalance + 
      state.currentCashRegister.transactions
        .filter(t => t.paymentMethod.type === 'cash')
        .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0) +
      state.currentCashRegister.cashMovements
        .reduce((sum, m) => sum + (m.type === 'supply' ? m.amount : -m.amount), 0);

    const updatedCashRegister: CashRegister = {
      ...state.currentCashRegister,
      closingBalance,
      expectedBalance,
      difference: closingBalance - expectedBalance,
      status: 'closed',
      closedBy: 'admin',
      closedAt: new Date(),
      notes,
    };

    dispatch({ type: 'UPDATE_CASH_REGISTER', payload: updatedCashRegister });
    dispatch({ type: 'SET_CURRENT_CASH_REGISTER', payload: null });
  };

  const addCashMovement = async (movement: Omit<CashMovement, 'id' | 'createdAt'>): Promise<void> => {
    if (!state.currentCashRegister) return;

    const newMovement: CashMovement = {
      ...movement,
      id: `cm_${Date.now()}`,
      createdAt: new Date(),
    };

    const updatedCashRegister: CashRegister = {
      ...state.currentCashRegister,
      cashMovements: [...state.currentCashRegister.cashMovements, newMovement],
    };

    dispatch({ type: 'UPDATE_CASH_REGISTER', payload: updatedCashRegister });
  };

  const generateCashFlow = async (startDate: Date, endDate: Date): Promise<CashFlow> => {
    const transactions = state.transactions.filter(t => 
      t.date >= startDate && t.date <= endDate
    );

    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      period: { start: startDate, end: endDate },
      opening: 0, // Would be calculated from previous period
      income: {
        total: income,
        byCategory: {},
        byPaymentMethod: {},
      },
      expenses: {
        total: expenses,
        byCategory: {},
        byPaymentMethod: {},
      },
      closing: income - expenses,
    };
  };

  const generateDRE = async (startDate: Date, endDate: Date): Promise<DRE> => {
    const transactions = state.transactions.filter(t => 
      t.date >= startDate && t.date <= endDate
    );

    const revenue = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => {
        if (t.category.name === 'Serviços') acc.services += t.amount;
        else if (t.category.name === 'Produtos') acc.products += t.amount;
        else acc.other += t.amount;
        return acc;
      }, { services: 0, products: 0, other: 0, total: 0 });

    revenue.total = revenue.services + revenue.products + revenue.other;

    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        // Categorize expenses as fixed or variable
        if (['Aluguel', 'Salários'].includes(t.category.name)) {
          acc.fixed += t.amount;
        } else {
          acc.variable += t.amount;
        }
        return acc;
      }, { fixed: 0, variable: 0, total: 0 });

    expenses.total = expenses.fixed + expenses.variable;

    const grossProfit = revenue.total - expenses.variable;
    const ebitda = grossProfit - expenses.fixed;
    const netIncome = ebitda; // Simplified

    return {
      period: { start: startDate, end: endDate },
      revenue,
      expenses,
      grossProfit,
      operatingExpenses: {
        administrative: expenses.fixed,
        commercial: 0,
        total: expenses.fixed,
      },
      ebitda,
      financialResult: 0,
      netIncome,
      margins: {
        gross: revenue.total > 0 ? (grossProfit / revenue.total) * 100 : 0,
        ebitda: revenue.total > 0 ? (ebitda / revenue.total) * 100 : 0,
        net: revenue.total > 0 ? (netIncome / revenue.total) * 100 : 0,
      },
    };
  };

  const generateBalanceSheet = async (date: Date): Promise<BalanceSheet> => {
    // Mock balance sheet - in production, this would be calculated from actual data
    return {
      date,
      assets: {
        current: {
          cash: 5000,
          accountsReceivable: 2000,
          inventory: 1500,
          other: 500,
          total: 9000,
        },
        nonCurrent: {
          equipment: 15000,
          furniture: 8000,
          other: 2000,
          total: 25000,
        },
        total: 34000,
      },
      liabilities: {
        current: {
          accountsPayable: 3000,
          taxes: 1500,
          other: 500,
          total: 5000,
        },
        nonCurrent: {
          loans: 10000,
          other: 0,
          total: 10000,
        },
        total: 15000,
      },
      equity: {
        capital: 15000,
        retainedEarnings: 4000,
        total: 19000,
      },
    };
  };

  const generatePerformanceReport = async (startDate: Date, endDate: Date): Promise<PerformanceMetrics> => {
    const transactions = state.transactions.filter(t => 
      t.date >= startDate && t.date <= endDate && t.type === 'income'
    );

    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);

    return {
      period: { start: startDate, end: endDate },
      revenue: {
        total: totalRevenue,
        growth: 15.5, // Mock growth
        byService: {},
        byProfessional: {},
        byPaymentMethod: {},
      },
      averageTicket: {
        current: transactions.length > 0 ? totalRevenue / transactions.length : 0,
        previous: 42, // Mock previous
        growth: 8.2,
      },
      profitability: {
        gross: 65.5,
        net: 25.8,
        ebitda: 35.2,
      },
      efficiency: {
        costPerService: 18.5,
        revenuePerProfessional: 2500,
        utilizationRate: 78.5,
      },
    };
  };

  const reconcileBank = async (bankAccount: string, transactions: any[]): Promise<BankReconciliation> => {
    // Mock bank reconciliation
    return {
      id: `br_${Date.now()}`,
      bankAccount,
      period: {
        start: new Date(),
        end: new Date(),
      },
      bankBalance: 10000,
      systemBalance: 9850,
      difference: 150,
      status: 'pending',
      transactions: [],
      createdAt: new Date(),
    };
  };

  const generateFiscalDocument = async (type: string, data: any): Promise<FiscalDocument> => {
    const newDocument: FiscalDocument = {
      id: `fd_${Date.now()}`,
      type: type as any,
      number: `${Date.now()}`,
      date: new Date(),
      amount: data.amount,
      client: data.client,
      description: data.description,
      status: 'issued',
      createdAt: new Date(),
    };

    dispatch({ type: 'ADD_FISCAL_DOCUMENT', payload: newDocument });
    return newDocument;
  };

  const calculateTaxes = async (period: { start: Date; end: Date }): Promise<TaxObligation[]> => {
    // Mock tax calculation
    const mockTaxes: TaxObligation[] = [
      {
        id: `tax_${Date.now()}`,
        type: 'mei',
        name: 'DAS MEI',
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        amount: 66.60,
        status: 'pending',
        reference: format(period.start, 'MM/yyyy'),
        calculationBase: 1000,
        rate: 6.66,
        createdAt: new Date(),
      },
    ];

    dispatch({ type: 'SET_TAX_OBLIGATIONS', payload: mockTaxes });
    return mockTaxes;
  };

  const exportReport = async (reportType: string, data: any): Promise<Blob> => {
    // Mock export - in production, this would generate actual files
    const content = JSON.stringify(data, null, 2);
    return new Blob([content], { type: 'application/json' });
  };

  return (
    <FinancialContext.Provider value={{
      state,
      dispatch,
      openCashRegister,
      closeCashRegister,
      addCashMovement,
      generateCashFlow,
      generateDRE,
      generateBalanceSheet,
      generatePerformanceReport,
      reconcileBank,
      generateFiscalDocument,
      calculateTaxes,
      exportReport,
    }}>
      {children}
    </FinancialContext.Provider>
  );
}

export function useFinancial() {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
}

// Helper function for date formatting
function format(date: Date, formatStr: string): string {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  if (formatStr === 'MM/yyyy') {
    return `${month}/${year}`;
  }
  
  return date.toLocaleDateString('pt-BR');
}