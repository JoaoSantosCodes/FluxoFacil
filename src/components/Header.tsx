import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

interface HeaderProps {
  summary: {
    monthlyIncome: number;
    monthlyExpenses: number;
    monthlyBalance: number;
  };
}

const Header: React.FC<HeaderProps> = ({ summary }) => {
  const currentMonth = new Date().toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <header className="card bg-card border border-border">
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calendar size={20} className="text-muted-foreground" />
          <span className="text-muted-foreground font-medium">{currentMonth}</span>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-foreground">💰 Resumo Financeiro</h2>
        <p className="text-muted-foreground">Acompanhe suas receitas, despesas e saldo mensal</p>
      </div>
      
      <div className="grid grid-3">
        <div className="card text-center bg-card border border-border">
          <div className="flex-center mb-2">
            <TrendingUp className="text-success" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-success">Receitas do Mês</h3>
          <p className="text-2xl font-bold text-success">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.monthlyIncome)}
          </p>
        </div>
        
        <div className="card text-center bg-card border border-border">
          <div className="flex-center mb-2">
            <TrendingDown className="text-danger" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-danger">Despesas do Mês</h3>
          <p className="text-2xl font-bold text-danger">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.monthlyExpenses)}
          </p>
        </div>
        
        <div className="card text-center bg-card border border-border">
          <div className="flex-center mb-2">
            <DollarSign className={summary.monthlyBalance >= 0 ? 'text-success' : 'text-danger'} size={24} />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Saldo do Mês</h3>
          <p className={`text-2xl font-bold ${summary.monthlyBalance >= 0 ? 'text-success' : 'text-danger'}`}>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.monthlyBalance)}
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header; 