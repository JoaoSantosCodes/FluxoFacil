import React from 'react';
import { Trash2, Edit, Calendar, Tag } from 'lucide-react';
import { Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils/calculations';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDeleteTransaction }) => {
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      onDeleteTransaction(id);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="card text-center bg-card border border-border" style={{ padding: '40px 20px' }}>
        <div className="mb-4">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold mb-2 text-foreground">Nenhuma transação ainda</h3>
          <p className="text-muted-foreground">Adicione sua primeira transação para começar a controlar suas finanças!</p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>💡 Dica: Use o botão "Nova Transação" para adicionar receitas e despesas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedTransactions.map(transaction => (
        <div
          key={transaction.id}
          className="flex-between transition-colors bg-card border border-border rounded-lg p-4 mb-3"
          style={{
            backgroundColor: transaction.type === 'income' 
              ? 'hsl(var(--success) / 0.1)' 
              : 'hsl(var(--destructive) / 0.1)'
          }}
        >
          <div style={{ flex: 1 }}>
            <div className="flex-between mb-2">
              <h3 className="font-semibold">{transaction.description}</h3>
              <span className={`badge ${transaction.type === 'income' ? 'badge-success' : 'badge-danger'}`}>
                {transaction.type === 'income' ? 'Receita' : 'Despesa'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Tag size={14} />
                <span>{transaction.category}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{formatDate(transaction.date)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2" style={{ marginLeft: '16px' }}>
            <span className={`font-bold text-lg ${transaction.type === 'income' ? 'text-success' : 'text-danger'}`}>
              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
            </span>
            <button
              onClick={() => handleDelete(transaction.id)}
              className="btn btn-danger btn-sm"
              title="Excluir transação"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList; 