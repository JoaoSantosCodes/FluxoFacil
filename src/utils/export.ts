import { Transaction, Category } from '../types';

export interface ExportData {
  transactions: Transaction[];
  categories: Category[];
  summary: {
    monthlyIncome: number;
    monthlyExpenses: number;
    monthlyBalance: number;
  };
  exportDate: string;
}

export const exportToJSON = (data: ExportData): void => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `contas-mensais-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportToCSV = (transactions: Transaction[]): void => {
  const headers = ['Data', 'Tipo', 'Categoria', 'Descrição', 'Valor'];
  const csvContent = [
    headers.join(','),
    ...transactions.map(t => [
      new Date(t.date).toLocaleDateString('pt-BR'),
      t.type === 'income' ? 'Receita' : 'Despesa',
      t.category,
      `"${t.description}"`,
      t.amount.toFixed(2)
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transacoes-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}; 