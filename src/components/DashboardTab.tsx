import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

interface Conta {
  id: number;
  status: 'PENDENTE' | 'PAGO' | 'VENCIDO';
  fornecedor: string;
  valor: number;
  data_vencimento: string;
  parcelas: number;
}

interface Recebido {
  id: number;
  descricao: string;
  valor: number;
  data_recebimento: string;
  categoria: string;
  fonte: string;
  status: 'RECEBIDO' | 'PENDENTE' | 'ATRASADO';
}

const DashboardTab: React.FC = () => {
  const [contas, setContas] = useState<Conta[]>([]);
  const [recebidos, setRecebidos] = useState<Recebido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetch('/contas').then(res => {
        if (!res.ok) throw new Error('Erro ao buscar contas');
        return res.json();
      }),
      fetch('/recebidos').then(res => {
        if (!res.ok) throw new Error('Erro ao buscar recebidos');
        return res.json();
      })
    ])
      .then(([contasData, recebidosData]) => {
        setContas(contasData);
        setRecebidos(recebidosData);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 32 }}>Carregando dashboard...</div>;
  if (error) return <div style={{ padding: 32, color: 'red' }}>Erro: {error}</div>;

  const totalContas = contas.length;
  const valorTotalContas = contas.reduce((sum, c) => sum + c.valor, 0);
  const contasPendentes = contas.filter(c => c.status === 'PENDENTE').length;
  const contasPagas = contas.filter(c => c.status === 'PAGO').length;
  const contasVencidas = contas.filter(c => c.status === 'VENCIDO').length;

  const totalRecebidos = recebidos.length;
  const valorTotalRecebidos = recebidos.reduce((sum, r) => sum + r.valor, 0);
  const recebidosPendentes = recebidos.filter(r => r.status === 'PENDENTE').length;
  const recebidosRecebidos = recebidos.filter(r => r.status === 'RECEBIDO').length;
  const recebidosAtrasados = recebidos.filter(r => r.status === 'ATRASADO').length;

  return (
    <div className="dashboard-content" style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 8, letterSpacing: '-0.02em', color: 'hsl(var(--primary))' }}>Bem-vindo ao seu Painel Financeiro</h1>
        <div style={{ fontSize: '1.2rem', color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>
          Acompanhe suas receitas, despesas e saldo do mês em tempo real.
        </div>
      </div>
      <div className="financial-summary">
        <div className="summary-header">
          <div className="summary-title">
            <TrendingUp className="summary-icon" size={36} />
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Dashboard</h2>
          </div>
          <div className="summary-subtitle">
            Visão geral das receitas e despesas do mês
          </div>
        </div>
        <div className="summary-cards" style={{ justifyContent: 'center' }}>
          <div className="summary-card income" style={{ minWidth: 320 }}>
            <div className="card-icon card-icon--income"><TrendingUp size={32} /></div>
            <div className="card-content">
              <h3>Receitas do Mês</h3>
              <span className="card-value">{valorTotalRecebidos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              <div className="text-muted">Total de recebidos: {totalRecebidos}</div>
            </div>
          </div>
          <div className="summary-card expense" style={{ minWidth: 320 }}>
            <div className="card-icon card-icon--expense"><TrendingDown size={32} /></div>
            <div className="card-content">
              <h3>Despesas do Mês</h3>
              <span className="card-value">{valorTotalContas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              <div className="text-muted">Total de contas: {totalContas}</div>
            </div>
          </div>
          <div className="summary-card balance" style={{ minWidth: 320 }}>
            <div className="card-icon card-icon--balance"><DollarSign size={32} /></div>
            <div className="card-content">
              <h3>Saldo</h3>
              <span className="card-value">{(valorTotalRecebidos - valorTotalContas).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              <div className="text-muted">Recebidos - Despesas</div>
            </div>
          </div>
          {/* Cards secundários */}
          <div className="summary-card" style={{ minWidth: 220 }}>
            <div className="card-icon card-icon--pending"><Clock size={32} /></div>
            <div className="card-content">
              <h3>Contas Pendentes</h3>
              <span className="card-value">{contasPendentes}</span>
            </div>
          </div>
          <div className="summary-card" style={{ minWidth: 220 }}>
            <div className="card-icon card-icon--paid"><CheckCircle size={32} /></div>
            <div className="card-content">
              <h3>Contas Pagas</h3>
              <span className="card-value">{contasPagas}</span>
            </div>
          </div>
          <div className="summary-card" style={{ minWidth: 220 }}>
            <div className="card-icon card-icon--late"><AlertTriangle size={32} /></div>
            <div className="card-content">
              <h3>Contas Vencidas</h3>
              <span className="card-value">{contasVencidas}</span>
            </div>
          </div>
          <div className="summary-card" style={{ minWidth: 220 }}>
            <div className="card-icon card-icon--pending"><Clock size={32} /></div>
            <div className="card-content">
              <h3>Recebidos Pendentes</h3>
              <span className="card-value">{recebidosPendentes}</span>
            </div>
          </div>
          <div className="summary-card" style={{ minWidth: 220 }}>
            <div className="card-icon card-icon--income"><DollarSign size={32} /></div>
            <div className="card-content">
              <h3>Recebidos</h3>
              <span className="card-value">{recebidosRecebidos}</span>
            </div>
          </div>
          <div className="summary-card" style={{ minWidth: 220 }}>
            <div className="card-icon card-icon--late"><AlertTriangle size={32} /></div>
            <div className="card-content">
              <h3>Recebidos Atrasados</h3>
              <span className="card-value">{recebidosAtrasados}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab; 