import React, { useState } from 'react';
import { 
  DollarSign, Plus, Minus, Calculator, Clock, User, 
  CheckCircle, XCircle, AlertTriangle, Download, Eye
} from 'lucide-react';
import { useFinancial } from '../../contexts/FinancialContext';
import { Transaction, CashMovement } from '../../types/financial';

export function CashRegister() {
  const { 
    state, 
    dispatch, 
    openCashRegister, 
    closeCashRegister, 
    addCashMovement 
  } = useFinancial();
  
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  
  const [openingBalance, setOpeningBalance] = useState('');
  const [closingBalance, setClosingBalance] = useState('');
  const [closingNotes, setClosingNotes] = useState('');
  
  const [movementData, setMovementData] = useState({
    type: 'withdrawal' as 'withdrawal' | 'supply',
    amount: '',
    reason: '',
  });

  const [transactionData, setTransactionData] = useState({
    type: 'income' as 'income' | 'expense',
    categoryId: '',
    amount: '',
    description: '',
    paymentMethodId: '',
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleOpenCashRegister = async () => {
    const balance = parseFloat(openingBalance);
    if (isNaN(balance) || balance < 0) return;
    
    await openCashRegister(balance);
    setShowOpenModal(false);
    setOpeningBalance('');
  };

  const handleCloseCashRegister = async () => {
    const balance = parseFloat(closingBalance);
    if (isNaN(balance) || balance < 0) return;
    
    await closeCashRegister(balance, closingNotes);
    setShowCloseModal(false);
    setClosingBalance('');
    setClosingNotes('');
  };

  const handleAddMovement = async () => {
    const amount = parseFloat(movementData.amount);
    if (isNaN(amount) || amount <= 0 || !movementData.reason) return;
    
    await addCashMovement({
      type: movementData.type,
      amount,
      reason: movementData.reason,
      authorizedBy: 'admin',
    });
    
    setShowMovementModal(false);
    setMovementData({ type: 'withdrawal', amount: '', reason: '' });
  };

  const handleAddTransaction = async () => {
    const amount = parseFloat(transactionData.amount);
    if (isNaN(amount) || amount <= 0 || !transactionData.categoryId || !transactionData.paymentMethodId) return;
    
    const category = state.categories.find(c => c.id === transactionData.categoryId);
    const paymentMethod = state.paymentMethods.find(p => p.id === transactionData.paymentMethodId);
    
    if (!category || !paymentMethod) return;

    const newTransaction: Transaction = {
      id: `t_${Date.now()}`,
      type: transactionData.type,
      category,
      amount,
      description: transactionData.description,
      date: new Date(),
      paymentMethod,
      createdBy: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    
    // Add to current cash register if open
    if (state.currentCashRegister) {
      const updatedCashRegister = {
        ...state.currentCashRegister,
        transactions: [...state.currentCashRegister.transactions, newTransaction],
        expectedBalance: state.currentCashRegister.expectedBalance + 
          (newTransaction.type === 'income' ? amount : -amount),
      };
      dispatch({ type: 'UPDATE_CASH_REGISTER', payload: updatedCashRegister });
    }
    
    setShowTransactionModal(false);
    setTransactionData({
      type: 'income',
      categoryId: '',
      amount: '',
      description: '',
      paymentMethodId: '',
    });
  };

  const calculateExpectedBalance = () => {
    if (!state.currentCashRegister) return 0;
    
    const transactionBalance = state.currentCashRegister.transactions
      .filter(t => t.paymentMethod.type === 'cash')
      .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
    
    const movementBalance = state.currentCashRegister.cashMovements
      .reduce((sum, m) => sum + (m.type === 'supply' ? m.amount : -m.amount), 0);
    
    return state.currentCashRegister.openingBalance + transactionBalance + movementBalance;
  };

  const getTodayTransactions = () => {
    const today = new Date().toDateString();
    return state.transactions.filter(t => t.date.toDateString() === today);
  };

  const todayTransactions = getTodayTransactions();
  const todayIncome = todayTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const todayExpenses = todayTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Controle de Caixa</h1>
        <div className="flex items-center space-x-3">
          {state.currentCashRegister ? (
            <>
              <button
                onClick={() => setShowMovementModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Sangria/Suprimento
              </button>
              <button
                onClick={() => setShowTransactionModal(true)}
                className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Transação
              </button>
              <button
                onClick={() => setShowCloseModal(true)}
                className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Fechar Caixa
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowOpenModal(true)}
              className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Abrir Caixa
            </button>
          )}
        </div>
      </div>

      {/* Cash Register Status */}
      {state.currentCashRegister ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Caixa Aberto</h2>
                <p className="text-slate-600">
                  Aberto às {formatTime(state.currentCashRegister.openedAt)} por {state.currentCashRegister.openedBy}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Ativo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium text-slate-600 mb-1">Saldo Inicial</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(state.currentCashRegister.openingBalance)}
              </p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-slate-600 mb-1">Entradas</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(
                  state.currentCashRegister.transactions
                    .filter(t => t.type === 'income' && t.paymentMethod.type === 'cash')
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </p>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm font-medium text-slate-600 mb-1">Saídas</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(
                  state.currentCashRegister.transactions
                    .filter(t => t.type === 'expense' && t.paymentMethod.type === 'cash')
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-slate-600 mb-1">Saldo Esperado</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(calculateExpectedBalance())}
              </p>
            </div>
          </div>

          {/* Cash Movements */}
          {state.currentCashRegister.cashMovements.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-slate-900 mb-3">Movimentações de Caixa</h3>
              <div className="space-y-2">
                {state.currentCashRegister.cashMovements.map((movement) => (
                  <div key={movement.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        movement.type === 'supply' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {movement.type === 'supply' ? (
                          <Plus className="w-4 h-4 text-green-600" />
                        ) : (
                          <Minus className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {movement.type === 'supply' ? 'Suprimento' : 'Sangria'}
                        </p>
                        <p className="text-sm text-slate-600">{movement.reason}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        movement.type === 'supply' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {movement.type === 'supply' ? '+' : '-'}{formatCurrency(movement.amount)}
                      </p>
                      <p className="text-xs text-slate-500">{formatTime(movement.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-slate-500" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Caixa Fechado</h2>
          <p className="text-slate-600 mb-6">
            O caixa está fechado. Abra o caixa para começar a registrar transações.
          </p>
          <button
            onClick={() => setShowOpenModal(true)}
            className="inline-flex items-center px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Abrir Caixa
          </button>
        </div>
      )}

      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Receitas do Dia</h3>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(todayIncome)}</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            {todayTransactions.filter(t => t.type === 'income').length} transações
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Minus className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Despesas do Dia</h3>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(todayExpenses)}</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            {todayTransactions.filter(t => t.type === 'expense').length} transações
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Calculator className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Saldo do Dia</h3>
              <p className={`text-2xl font-bold ${
                todayIncome - todayExpenses >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(todayIncome - todayExpenses)}
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            {todayTransactions.length} transações totais
          </p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Transações Recentes</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Ver Todas
          </button>
        </div>
        
        {todayTransactions.length > 0 ? (
          <div className="space-y-3">
            {todayTransactions.slice(0, 10).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'income' ? (
                      <Plus className="w-4 h-4 text-green-600" />
                    ) : (
                      <Minus className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{transaction.description}</p>
                    <p className="text-sm text-slate-600">
                      {transaction.category.name} • {transaction.paymentMethod.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-xs text-slate-500">{formatTime(transaction.date)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">Nenhuma transação registrada hoje</p>
          </div>
        )}
      </div>

      {/* Open Cash Register Modal */}
      {showOpenModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Abrir Caixa</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Saldo Inicial
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="0,00"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowOpenModal(false)}
                className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleOpenCashRegister}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                Abrir Caixa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close Cash Register Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Fechar Caixa</h3>
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Saldo Esperado</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatCurrency(calculateExpectedBalance())}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Saldo Real Contado
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={closingBalance}
                  onChange={(e) => setClosingBalance(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="0,00"
                />
              </div>
              {closingBalance && (
                <div className={`p-3 rounded-lg ${
                  Math.abs(parseFloat(closingBalance) - calculateExpectedBalance()) <= 5
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <p className="text-sm font-medium">
                    Diferença: {formatCurrency(parseFloat(closingBalance) - calculateExpectedBalance())}
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Observações (opcional)
                </label>
                <textarea
                  value={closingNotes}
                  onChange={(e) => setClosingNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Observações sobre o fechamento..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCloseModal(false)}
                className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCloseCashRegister}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Fechar Caixa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cash Movement Modal */}
      {showMovementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Movimentação de Caixa</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo de Movimentação
                </label>
                <select
                  value={movementData.type}
                  onChange={(e) => setMovementData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="withdrawal">Sangria (Retirada)</option>
                  <option value="supply">Suprimento (Entrada)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Valor
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={movementData.amount}
                  onChange={(e) => setMovementData(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="0,00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Motivo
                </label>
                <input
                  type="text"
                  value={movementData.reason}
                  onChange={(e) => setMovementData(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Descreva o motivo da movimentação"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowMovementModal(false)}
                className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddMovement}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Registrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      {showTransactionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Nova Transação</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo
                </label>
                <select
                  value={transactionData.type}
                  onChange={(e) => setTransactionData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="income">Receita</option>
                  <option value="expense">Despesa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Categoria
                </label>
                <select
                  value={transactionData.categoryId}
                  onChange={(e) => setTransactionData(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">Selecione uma categoria</option>
                  {state.categories
                    .filter(c => c.type === transactionData.type)
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Valor
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={transactionData.amount}
                  onChange={(e) => setTransactionData(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="0,00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descrição
                </label>
                <input
                  type="text"
                  value={transactionData.description}
                  onChange={(e) => setTransactionData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Descrição da transação"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Forma de Pagamento
                </label>
                <select
                  value={transactionData.paymentMethodId}
                  onChange={(e) => setTransactionData(prev => ({ ...prev, paymentMethodId: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">Selecione a forma de pagamento</option>
                  {state.paymentMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowTransactionModal(false)}
                className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddTransaction}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Registrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}