import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Transaction, Category } from './types';
import { Recebido } from './types/recebidos';
import { loadTransactions, saveTransactions, loadCategories } from './utils/storage';
import { calculateFinancialSummary } from './utils/calculations';
import { exportToJSON } from './utils/export';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import LoaderDemo from './components/ui/loader-demo';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ui/theme-toggle';
import { ContasProvider, useContas } from './contexts/ContasContext';
import { RecebidosProvider, useRecebidos } from './contexts/RecebidosContext';
import ContasList from './components/ContasList';
import ContaForm from './components/ContaForm';
import RecebidoForm from './components/RecebidoForm';
import RecebidoList from './components/RecebidoList';
import RecebidosTab from './components/RecebidosTab';
import { ErrorBoundary } from './components/ErrorBoundary';
import { 
  IconHome, 
  IconCreditCard, 
  IconChartPie, 
  IconSettings,
  IconPlus,
  IconMenu,
  IconX
} from '@tabler/icons-react';
import DashboardTab from './components/DashboardTab';
import TransactionsTab from './components/TransactionsTab';
import ContasTab from './components/ContasTab';
import AnalyticsTab from './components/AnalyticsTab';
import SettingsTab from './components/SettingsTab';
import LoadersTab from './components/LoadersTab';
import Logo from './components/Logo';
import ConnectionStatus from './components/ConnectionStatus';

type TabType =
  | 'dashboard'
  | 'consulta'
  | 'recebidos'
  | 'contas'
  | 'transacoes'
  | 'documentacoes'
  | 'ajuda'
  | 'configuracoes';

// Componente do Dashboard que usa o contexto das contas e recebidos
const DashboardContent: React.FC<{
  transactions: Transaction[];
  summary: { monthlyIncome: number; monthlyExpenses: number; monthlyBalance: number };
  categoryStats: { [key: string]: { income: number; expense: number } };
}> = ({ transactions, summary, categoryStats }) => {
  const { contas } = useContas();
  const { recebidos } = useRecebidos();
  
  // Calcular despesas incluindo contas
  const calcularDespesasComContas = () => {
    // Despesas das transações
    const despesasTransacoes = transactions
      .filter(t => t.type === 'expense')
      .reduce((total, t) => total + t.amount, 0);
    
    // Despesas das contas (apenas pendentes e vencidas, excluindo pagas)
    const contasDespesas = contas
      .filter(conta => {
        // Incluir apenas contas que NÃO estão pagas
        return conta.status !== 'PAGO';
      })
      .reduce((total, conta) => total + conta.valor, 0);
    
    return despesasTransacoes + contasDespesas;
  };
  
  const despesasComContas = calcularDespesasComContas();
  
  // Calcular receitas dos recebidos
  const recebidosReceitas = recebidos
    .filter((recebido: Recebido) => recebido.status === 'RECEBIDO')
    .reduce((total: number, recebido: Recebido) => total + recebido.valor, 0);
  
  const receitasComRecebidos = summary.monthlyIncome + recebidosReceitas;
  const saldoCompleto = receitasComRecebidos - despesasComContas;
  
  // Calcular estatísticas das contas
  const contasStats = {
    total: contas.length,
    pendentes: contas.filter(conta => {
      const dataVencimento = new Date(conta.data_vencimento);
      const hoje = new Date();
      return dataVencimento >= hoje;
    }).length,
    vencidas: contas.filter(conta => {
      const dataVencimento = new Date(conta.data_vencimento);
      const hoje = new Date();
      return dataVencimento < hoje;
    }).length,
    pagas: contas.filter(conta => conta.status === 'PAGO').length,
    valorTotal: contas.reduce((total, conta) => total + conta.valor, 0),
    valorPendente: contas.filter(conta => {
      const dataVencimento = new Date(conta.data_vencimento);
      const hoje = new Date();
      return dataVencimento >= hoje && conta.status !== 'PAGO';
    }).reduce((total, conta) => total + conta.valor, 0),
    valorVencido: contas.filter(conta => {
      const dataVencimento = new Date(conta.data_vencimento);
      const hoje = new Date();
      return dataVencimento < hoje && conta.status !== 'PAGO';
    }).reduce((total, conta) => total + conta.valor, 0)
  };

  // Contas que vencem em breve (próximos 7 dias)
  const contasVencemBreve = contas.filter(conta => {
    const dataVencimento = new Date(conta.data_vencimento);
    const hoje = new Date();
    const diffTime = dataVencimento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7 && conta.status !== 'PAGO';
  });

  // Top fornecedores por valor
  const topFornecedores = contas.reduce((acc, conta) => {
    if (!acc[conta.fornecedor]) {
      acc[conta.fornecedor] = 0;
    }
    acc[conta.fornecedor] += conta.valor;
    return acc;
  }, {} as Record<string, number>);

  const topFornecedoresArray = Object.entries(topFornecedores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Estatísticas dos recebidos
  const recebidosStats = {
    total: recebidos.length,
    recebidos: recebidos.filter(r => r.status === 'RECEBIDO').length,
    pendentes: recebidos.filter(r => r.status === 'PENDENTE').length,
    atrasados: recebidos.filter(r => r.status === 'ATRASADO').length,
    valorTotal: recebidos.reduce((total, r) => total + r.valor, 0),
    valorRecebido: recebidos.filter(r => r.status === 'RECEBIDO').reduce((total, r) => total + r.valor, 0),
    valorPendente: recebidos.filter(r => r.status === 'PENDENTE').reduce((total, r) => total + r.valor, 0)
  };

  // Top fontes de recebidos
  const topFontesRecebidos = recebidos.reduce((acc, recebido) => {
    if (!acc[recebido.fonte]) {
      acc[recebido.fonte] = 0;
    }
    acc[recebido.fonte] += recebido.valor;
    return acc;
  }, {} as Record<string, number>);

  const topFontesRecebidosArray = Object.entries(topFontesRecebidos)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="dashboard-content">
      {/* Financial Summary Cards */}
      <div className="financial-summary">
        <div className="summary-header">
          <div className="summary-title">
            <DollarSign size={24} className="summary-icon" />
            <h2 className="text-foreground">Resumo Financeiro</h2>
          </div>
          <p className="summary-subtitle text-muted-foreground">Acompanhe suas receitas, despesas e saldo mensal</p>
        </div>
        
        <div className="summary-cards">
          <div className="summary-card income">
            <div className="card-icon">
              <TrendingUp size={24} />
            </div>
            <div className="card-content">
              <h3 className="text-foreground">Receitas do Mês</h3>
              <span className="card-value">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(receitasComRecebidos)}
              </span>
            </div>
          </div>
          
          <div className="summary-card expense">
            <div className="card-icon">
              <TrendingDown size={24} />
            </div>
            <div className="card-content">
              <h3 className="text-foreground">Despesas do Mês</h3>
              <span className="card-value">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(despesasComContas)}
              </span>
              <small className="text-muted-foreground" style={{ fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
                Inclui transações + contas pendentes/vencidas
              </small>
            </div>
          </div>
          
          <div className="summary-card balance">
            <div className="card-icon">
              <DollarSign size={24} />
            </div>
            <div className="card-content">
              <h3 className="text-foreground">Saldo do Mês</h3>
              <span className="card-value">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saldoCompleto)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contas Mensais Summary */}
      <div className="financial-summary" style={{ marginTop: '2rem' }}>
        <div className="summary-header">
          <div className="summary-title">
            <DollarSign size={24} className="summary-icon" />
            <h2 className="text-foreground">Contas Mensais</h2>
          </div>
          <p className="summary-subtitle text-muted-foreground">Acompanhe suas contas a pagar e vencidas</p>
        </div>
        
        <div className="summary-cards">
          <div className="summary-card" style={{ 
            background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
            color: 'hsl(var(--primary-foreground))'
          }}>
            <div className="card-icon">
              <DollarSign size={24} />
            </div>
            <div className="card-content">
              <h3 className="text-foreground">Total de Contas</h3>
              <span className="card-value">
                {contasStats.total} conta{contasStats.total !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          <div className="summary-card" style={{ 
            background: 'linear-gradient(135deg, hsl(var(--warning)) 0%, hsl(var(--warning) / 0.8) 100%)',
            color: 'hsl(var(--warning-foreground))'
          }}>
            <div className="card-icon">
              <TrendingUp size={24} />
            </div>
            <div className="card-content">
              <h3 className="text-foreground">Pendentes</h3>
              <span className="card-value">
                {contasStats.pendentes} conta{contasStats.pendentes !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          <div className="summary-card" style={{ 
            background: 'linear-gradient(135deg, hsl(var(--destructive)) 0%, hsl(var(--destructive) / 0.8) 100%)',
            color: 'hsl(var(--destructive-foreground))'
          }}>
            <div className="card-icon">
              <TrendingDown size={24} />
            </div>
            <div className="card-content">
              <h3 className="text-foreground">Vencidas</h3>
              <span className="card-value">
                {contasStats.vencidas} conta{contasStats.vencidas !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          <div className="summary-card" style={{ 
            background: 'linear-gradient(135deg, hsl(var(--success)) 0%, hsl(var(--success) / 0.8) 100%)',
            color: 'hsl(var(--success-foreground))'
          }}>
            <div className="card-icon">
              <DollarSign size={24} />
            </div>
            <div className="card-content">
              <h3 className="text-foreground">Pagas</h3>
              <span className="card-value">
                {contasStats.pagas} conta{contasStats.pagas !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recebidos Summary */}
      <div className="financial-summary" style={{ marginTop: '2rem' }}>
        <div className="summary-header">
          <div className="summary-title">
            <DollarSign size={24} className="summary-icon" />
            <h2 className="text-foreground">Recebidos</h2>
          </div>
          <p className="summary-subtitle text-muted-foreground">Acompanhe suas receitas e recebimentos</p>
        </div>
        
        <div className="summary-cards">
          <div className="summary-card" style={{ 
            background: 'linear-gradient(135deg, hsl(var(--success)) 0%, hsl(var(--success) / 0.8) 100%)',
            color: 'hsl(var(--success-foreground))'
          }}>
            <div className="card-icon">
              <DollarSign size={24} />
            </div>
            <div className="card-content">
              <h3 className="text-foreground">Total de Recebidos</h3>
              <span className="card-value">
                {recebidosStats.total} recebido{recebidosStats.total !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          <div className="summary-card" style={{ 
            background: 'linear-gradient(135deg, hsl(var(--success)) 0%, hsl(var(--success) / 0.8) 100%)',
            color: 'hsl(var(--success-foreground))'
          }}>
            <div className="card-icon">
              <DollarSign size={24} />
            </div>
            <div className="card-content">
              <h3 className="text-foreground">Recebidos</h3>
              <span className="card-value">
                {recebidosStats.recebidos} recebido{recebidosStats.recebidos !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          <div className="summary-card" style={{ 
            background: 'linear-gradient(135deg, hsl(var(--warning)) 0%, hsl(var(--warning) / 0.8) 100%)',
            color: 'hsl(var(--warning-foreground))'
          }}>
            <div className="card-icon">
              <TrendingUp size={24} />
            </div>
            <div className="card-content">
              <h3 className="text-foreground">Pendentes</h3>
              <span className="card-value">
                {recebidosStats.pendentes} recebido{recebidosStats.pendentes !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          <div className="summary-card" style={{ 
            background: 'linear-gradient(135deg, hsl(var(--destructive)) 0%, hsl(var(--destructive) / 0.8) 100%)',
            color: 'hsl(var(--destructive-foreground))'
          }}>
            <div className="card-icon">
              <TrendingDown size={24} />
            </div>
            <div className="card-content">
              <h3 className="text-foreground">Atrasados</h3>
              <span className="card-value">
                {recebidosStats.atrasados} recebido{recebidosStats.atrasados !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Estatísticas Rápidas */}
        <div className="stats-card">
          <h3 className="stats-title text-foreground">
            <TrendingUp size={20} />
            Estatísticas Rápidas
          </h3>
          <div className="stats-content">
            <div className="stat-item">
              <span className="stat-label">Total de transações:</span>
              <span className="stat-value">
                {transactions.length} transação{transactions.length !== 1 ? 'ões' : ''}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Receitas do mês:</span>
              <span className="stat-value text-success">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(receitasComRecebidos)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Despesas do mês:</span>
              <span className="stat-value text-danger">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(despesasComContas)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Valor total contas:</span>
              <span className="stat-value text-warning">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contasStats.valorTotal)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Valor pendente:</span>
              <span className="stat-value text-warning">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contasStats.valorPendente)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Valor vencido:</span>
              <span className="stat-value text-danger">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contasStats.valorVencido)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Despesas (transações):</span>
              <span className="stat-value text-danger">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transactions.filter(t => t.type === 'expense').reduce((total, t) => total + t.amount, 0))}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Contas pendentes/vencidas:</span>
              <span className="stat-value text-danger">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contas.filter(conta => conta.status !== 'PAGO').reduce((total, conta) => total + conta.valor, 0))}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Contas pagas (excluídas):</span>
              <span className="stat-value text-success">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contas.filter(conta => conta.status === 'PAGO').reduce((total, conta) => total + conta.valor, 0))}
              </span>
            </div>
          </div>
        </div>

        {/* Contas que Vencem em Breve */}
        <div className="stats-card">
          <h3 className="stats-title text-foreground">
            <TrendingUp size={20} />
            Vencem em Breve
          </h3>
          <div className="stats-content">
            {contasVencemBreve.length > 0 ? (
              contasVencemBreve.slice(0, 5).map(conta => {
                const dataVencimento = new Date(conta.data_vencimento);
                const hoje = new Date();
                const diffTime = dataVencimento.getTime() - hoje.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={conta.id} className="category-stat">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="category-name">{conta.fornecedor}</span>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        color: diffDays === 0 ? 'hsl(var(--destructive))' : 'hsl(var(--warning))',
                        fontWeight: '600'
                      }}>
                        {diffDays === 0 ? 'Vence hoje!' : `${diffDays} dia${diffDays !== 1 ? 's' : ''}`}
                      </span>
                    </div>
                    <span className="category-value">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(conta.valor)}
                    </span>
                  </div>
                );
              })
            ) : (
              <div style={{ 
                textAlign: 'center', 
                color: 'hsl(var(--muted-foreground))',
                padding: '1rem'
              }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>✅</span>
                Nenhuma conta vence em breve!
              </div>
            )}
          </div>
        </div>

        {/* Top Categorias */}
        <div className="stats-card">
          <h3 className="stats-title text-foreground">
            <TrendingUp size={20} />
            Top Categorias
          </h3>
          <div className="stats-content">
            {Object.entries(categoryStats)
              .sort(([,a], [,b]) => (b.income + b.expense) - (a.income + a.expense))
              .slice(0, 5)
              .map(([category, stats]) => {
                const total = stats.income + stats.expense;
                return (
                  <div key={category} className="category-stat">
                    <span className="category-name">{category}</span>
                    <span className="category-value">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Top Fornecedores */}
        <div className="stats-card">
          <h3 className="stats-title text-foreground">
            <DollarSign size={20} />
            Top Fornecedores
          </h3>
          <div className="stats-content">
            {topFornecedoresArray.length > 0 ? (
              topFornecedoresArray.map(([fornecedor, valor]) => (
                <div key={fornecedor} className="category-stat">
                  <span className="category-name">{fornecedor}</span>
                  <span className="category-value">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ 
                textAlign: 'center', 
                color: 'hsl(var(--muted-foreground))',
                padding: '1rem'
              }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📊</span>
                Nenhum fornecedor registrado
              </div>
            )}
          </div>
        </div>

        {/* Top Fontes de Recebidos */}
        <div className="stats-card">
          <h3 className="stats-title text-foreground">
            <DollarSign size={20} />
            Top Fontes de Recebidos
          </h3>
          <div className="stats-content">
            {topFontesRecebidosArray.length > 0 ? (
              topFontesRecebidosArray.map(([fonte, valor]) => (
                <div key={fonte} className="category-stat">
                  <span className="category-name">{fonte}</span>
                  <span className="category-value">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ 
                textAlign: 'center', 
                color: 'hsl(var(--muted-foreground))',
                padding: '1rem'
              }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>💰</span>
                Nenhum recebido registrado
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showRecebidoForm, setShowRecebidoForm] = useState(false);
  const [editingRecebido, setEditingRecebido] = useState<Recebido | null>(null);
  const [summary, setSummary] = useState({
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlyBalance: 0
  });
  // Remover qualquer uso de useRecebidos() no topo do App
  // Remover qualquer uso de useRecebidos() fora do RecebidosProvider

  // Verificar se há transações recentes (últimas 24 horas)
  const hasRecentTransactions = transactions.some(transaction => {
    const transactionDate = new Date(transaction.date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - transactionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 1;
  });

  // Verificar se há transações pendentes (não categorizadas)
  const hasPendingTransactions = transactions.some(transaction => !transaction.category);
  
  // Contar transações do mês atual
  const currentMonthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const now = new Date();
    return transactionDate.getMonth() === now.getMonth() && 
           transactionDate.getFullYear() === now.getFullYear();
  }).length;

  // Carregar dados do localStorage
  useEffect(() => {
    const savedTransactions = loadTransactions();
    const savedCategories = loadCategories();
    
    setTransactions(savedTransactions);
    setCategories(savedCategories);
    
    // Verificar permissão de notificação
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
    
    console.log('Estado inicial carregado');
  }, []);

  // Atalho de teclado para nova transação
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'n' || event.key === 'N') {
        // Só abrir se não estiver em um campo de input
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'SELECT')) {
          return;
        }
        
        event.preventDefault();
        setShowForm(true);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Calcular resumo financeiro quando transações mudam
  useEffect(() => {
    const financialSummary = calculateFinancialSummary(transactions);
    
    setSummary({
      monthlyIncome: financialSummary.monthlyIncome,
      monthlyExpenses: financialSummary.monthlyExpenses,
      monthlyBalance: financialSummary.monthlyIncome - financialSummary.monthlyExpenses
    });
  }, [transactions]);

  // Salvar transações no localStorage
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  // Inicializar transações filtradas
  useEffect(() => {
    // setFilteredTransactions(transactions); // Removido
  }, [transactions]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
    
    // Mostrar animação de sucesso
    setShowSuccessAnimation(true);
    setTimeout(() => setShowSuccessAnimation(false), 2000);
    
    // Mostrar toast de sucesso
    setSuccessMessage(`${transaction.description} - R$ ${transaction.amount.toFixed(2)}`);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
    
    // Mostrar notificação de sucesso
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Transação Adicionada', {
        body: `${transaction.description} - R$ ${transaction.amount.toFixed(2)}`,
        icon: '/favicon.ico'
      });
    }
  };

  // Remover handleDeleteTransaction

  // Remover handleFilterByCategory

  // Remover handleFilterByType

  // Remover clearFilters

  const handleExportData = () => {
    const data = {
      transactions,
      categories,
      summary,
      exportDate: new Date().toISOString()
    };
    
    exportToJSON(data);
  };

  // Funções para gerenciar recebidos - serão movidas para dentro do contexto
  const handleAddRecebido = async (recebido: Omit<Recebido, 'id' | 'data_criacao' | 'data_atualizacao'>) => {
    // Esta função será implementada dentro do contexto
    console.log('Adicionando recebido:', recebido);
  };

  const handleEditRecebido = (recebido: Recebido) => {
    setEditingRecebido(recebido);
    setShowRecebidoForm(true);
  };

  const handleUpdateRecebido = async (recebido: Recebido) => {
    // Esta função será implementada dentro do contexto
    console.log('Atualizando recebido:', recebido);
  };

  const handleDeleteRecebido = async (id: number) => {
    // Esta função será implementada dentro do contexto
    console.log('Deletando recebido:', id);
  };

  const handleSaveRecebido = async (recebido: Omit<Recebido, 'id' | 'data_criacao' | 'data_atualizacao'>) => {
    // Função removida: gerenciamento de recebidos deve ser feito dentro do RecebidosTab
    setShowRecebidoForm(false);
    setEditingRecebido(null);
  };

  // Calcular estatísticas por categoria
  const getCategoryStats = () => {
    const stats: { [key: string]: { income: number; expense: number } } = {};
    
    categories.forEach(category => {
      const categoryTransactions = transactions.filter(t => t.category === category.name);
      stats[category.name] = {
        income: categoryTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
        expense: categoryTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
      };
    });
    
    return stats;
  };

  const categoryStats = getCategoryStats();

  // Atualizar navigationItems para:
  // Dashboard, Consulta, Recebidos, Contas, Transações, Documentações, Ajuda, Configurações
  const navigationItems = [
    {
      title: "Dashboard",
      icon: <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#dashboard"
    },
    {
      title: "Consulta",
      icon: <IconChartPie className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#consulta"
    },
    {
      title: "Recebidos",
      icon: <DollarSign className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#recebidos"
    },
    {
      title: "Contas",
      icon: <IconCreditCard className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#contas"
    },
    {
      title: "Transações",
      icon: <IconCreditCard className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#transacoes"
    },
    {
      title: "Documentações",
      icon: <IconChartPie className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#documentacoes"
    },
    {
      title: "Ajuda",
      icon: <IconMenu className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#ajuda"
    },
    {
      title: "Configurações",
      icon: <IconSettings className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#configuracoes"
    }
  ];

  // Atualizar handleNavigation para suportar as novas abas
  const handleNavigation = (href: string) => {
    const tab = href.replace('#', '');
    setActiveTab(tab as TabType);
  };

  // Atualizar renderTabContent para retornar placeholders para as novas abas
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ErrorBoundary><DashboardTab /></ErrorBoundary>;
      case 'consulta':
        return <div style={{ padding: 32 }}>Consulta (placeholder)</div>;
      case 'recebidos':
        return <ErrorBoundary><RecebidosTab /></ErrorBoundary>;
      case 'contas':
        return <ErrorBoundary><ContasTab /></ErrorBoundary>;
      case 'transacoes':
        return <div style={{ padding: 32 }}>Transações (placeholder)</div>;
      case 'documentacoes':
        return <div style={{ padding: 32 }}>Documentações (placeholder)</div>;
      case 'ajuda':
        return <div style={{ padding: 32 }}>Ajuda (placeholder)</div>;
      case 'configuracoes':
        return <ErrorBoundary><SettingsTab /></ErrorBoundary>;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider>
      <ContasProvider>
        <RecebidosProvider>
          <div className="app-container">
        <div className="container">
          {/* Header */}
          <div className="header-section">
            <div className="header-content flex items-center gap-4">
              <h1 className="app-title"><Logo size={40} showText /></h1>
              <button
                className="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Abrir menu"
              >
                <IconMenu size={24} />
              </button>
            </div>
          </div>

        {/* Content Area */}
        <div className="content-area">
          {renderTabContent()}
        </div>

        {/* Desktop Sidebar */}
        <div className="sidebar-desktop">
          <div className="sidebar-content">
            <div className="sidebar-header">
              <h3 className="sidebar-title"><Logo size={32} showText /></h3>
              <ConnectionStatus className="mt-2 mb-2" />
              <ThemeToggle />
            </div>
            <nav className="sidebar-nav">
              {navigationItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleNavigation(item.href)}
                  className={`sidebar-item ${activeTab === item.href.replace('#', '') ? 'active' : ''}`}
                >
                  <div className="sidebar-icon">
                    {item.icon}
                  </div>
                  <span className="sidebar-label">{item.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}>
            <div className={`mobile-menu-panel ${mobileMenuOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
              <div className="mobile-menu-panel-header">
                <h3 className="mobile-menu-panel-title"><Logo size={32} showText /></h3>
                <button 
                  className="mobile-menu-panel-close"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <IconX size={24} />
                </button>
              </div>
              
              <div className="mobile-menu-panel-nav">
                <button
                  onClick={() => {
                    setActiveTab('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className={`mobile-menu-panel-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                >
                  <div className="mobile-menu-panel-icon">
                    <IconHome size={24} />
                  </div>
                  <span className="mobile-menu-panel-label">Dashboard</span>
                </button>
                
                <button
                  onClick={() => {
                    setActiveTab('consulta');
                    setMobileMenuOpen(false);
                  }}
                  className={`mobile-menu-panel-item ${activeTab === 'consulta' ? 'active' : ''}`}
                >
                  <div className="mobile-menu-panel-icon">
                    <IconChartPie size={24} />
                  </div>
                  <span className="mobile-menu-panel-label">Consulta</span>
                </button>
                
                <button
                  onClick={() => {
                    setActiveTab('recebidos');
                    setMobileMenuOpen(false);
                  }}
                  className={`mobile-menu-panel-item ${activeTab === 'recebidos' ? 'active' : ''}`}
                >
                  <div className="mobile-menu-panel-icon">
                    <DollarSign size={24} />
                  </div>
                  <span className="mobile-menu-panel-label">Recebidos</span>
                </button>
                
                <button
                  onClick={() => {
                    setActiveTab('contas');
                    setMobileMenuOpen(false);
                  }}
                  className={`mobile-menu-panel-item ${activeTab === 'contas' ? 'active' : ''}`}
                >
                  <div className="mobile-menu-panel-icon">
                    <IconCreditCard size={24} />
                  </div>
                  <span className="mobile-menu-panel-label">Contas</span>
                </button>
                
                <button
                  onClick={() => {
                    setActiveTab('transacoes');
                    setMobileMenuOpen(false);
                  }}
                  className={`mobile-menu-panel-item ${activeTab === 'transacoes' ? 'active' : ''}`}
                >
                  <div className="mobile-menu-panel-icon">
                    <IconCreditCard size={24} />
                  </div>
                  <span className="mobile-menu-panel-label">Transações</span>
                </button>
                
                <button
                  onClick={() => {
                    setActiveTab('documentacoes');
                    setMobileMenuOpen(false);
                  }}
                  className={`mobile-menu-panel-item ${activeTab === 'documentacoes' ? 'active' : ''}`}
                >
                  <div className="mobile-menu-panel-icon">
                    <IconChartPie size={24} />
                  </div>
                  <span className="mobile-menu-panel-label">Documentações</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('ajuda');
                    setMobileMenuOpen(false);
                  }}
                  className={`mobile-menu-panel-item ${activeTab === 'ajuda' ? 'active' : ''}`}
                >
                  <div className="mobile-menu-panel-icon">
                    <IconMenu size={24} />
                  </div>
                  <span className="mobile-menu-panel-label">Ajuda</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('configuracoes');
                    setMobileMenuOpen(false);
                  }}
                  className={`mobile-menu-panel-item ${activeTab === 'configuracoes' ? 'active' : ''}`}
                >
                  <div className="mobile-menu-panel-icon">
                    <IconSettings size={24} />
                  </div>
                  <span className="mobile-menu-panel-label">Configurações</span>
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
        </RecebidosProvider>
      </ContasProvider>
    </ThemeProvider>
  );
};

export default App;