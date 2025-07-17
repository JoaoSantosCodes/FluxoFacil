import { Transaction, Category } from '../types';

const STORAGE_KEYS = {
  TRANSACTIONS: 'app_contas_transactions',
  CATEGORIES: 'app_contas_categories'
};

export const loadTransactions = (): Transaction[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Erro ao carregar transações:', error);
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (error) {
    console.error('Erro ao salvar transações:', error);
  }
};

export const loadCategories = (): Category[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Categorias padrão se não existirem
    const defaultCategories: Category[] = [
      { id: '1', name: 'Salário', type: 'income', color: '#28a745' },
      { id: '2', name: 'Freelance', type: 'income', color: '#17a2b8' },
      { id: '3', name: 'Investimentos', type: 'income', color: '#ffc107' },
      { id: '4', name: 'Alimentação', type: 'expense', color: '#dc3545' },
      { id: '5', name: 'Transporte', type: 'expense', color: '#fd7e14' },
      { id: '6', name: 'Moradia', type: 'expense', color: '#6f42c1' },
      { id: '7', name: 'Saúde', type: 'expense', color: '#e83e8c' },
      { id: '8', name: 'Educação', type: 'expense', color: '#20c997' },
      { id: '9', name: 'Lazer', type: 'expense', color: '#6c757d' },
      { id: '10', name: 'Outros', type: 'expense', color: '#495057' }
    ];
    
    saveCategories(defaultCategories);
    return defaultCategories;
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
    return [];
  }
};

export const saveCategories = (categories: Category[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (error) {
    console.error('Erro ao salvar categorias:', error);
  }
}; 