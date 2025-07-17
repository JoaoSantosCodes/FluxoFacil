import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle, AlertTriangle, DollarSign, FileText, Edit, Trash2 } from 'lucide-react';

interface Conta {
  id: number;
  status: 'PENDENTE' | 'PAGO' | 'VENCIDO';
  fornecedor: string;
  valor: number;
  data_vencimento: string;
  parcelas: number;
  data_criacao?: string;
  data_atualizacao?: string;
}

const statusColors: Record<string, string> = {
  'PENDENTE': 'badge badge-warning',
  'PAGO': 'badge badge-success',
  'VENCIDO': 'badge badge-danger',
};

const statusIcons: Record<string, JSX.Element> = {
  'PENDENTE': <Clock size={18} />, 
  'PAGO': <CheckCircle size={18} />, 
  'VENCIDO': <AlertTriangle size={18} />
};

const ContaCard: React.FC<{ conta: Conta }> = ({ conta }) => (
  <div style={{
    background: 'rgba(20,22,34,0.95)',
    borderRadius: 18,
    boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
    padding: 24,
    marginBottom: 18,
    color: '#fff',
    border: '1.5px solid #23263a',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
      <FileText size={28} style={{ color: '#60a5fa', background: '#19213a', borderRadius: 12, padding: 4 }} />
      <span style={{ fontWeight: 700, fontSize: 18 }}>{conta.fornecedor}</span>
      <span className={statusColors[conta.status]} style={{ marginLeft: 'auto', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
        {statusIcons[conta.status]} {conta.status}
      </span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', marginBottom: 6 }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 15 }}>
        <DollarSign size={16} /> <b>R$ {conta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</b>
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 15 }}>
        <Clock size={16} /> {conta.data_vencimento}
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 15 }}>
        Parcelas: {conta.parcelas}
      </span>
    </div>
    <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
      <button className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Edit size={16} /> Editar
      </button>
      <button className="btn btn-danger btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Trash2 size={16} /> Excluir
      </button>
    </div>
  </div>
);

const ContasTab: React.FC = () => {
  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/contas')
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar contas');
        return res.json();
      })
      .then(data => setContas(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 32 }}>Carregando contas...</div>;
  if (error) return <div style={{ padding: 32, color: 'red' }}>Erro: {error}</div>;

  const totalContas = contas.length;
  const valorTotalContas = contas.reduce((sum, c) => sum + c.valor, 0);
  const contasPendentes = contas.filter(c => c.status === 'PENDENTE').length;
  const contasPagas = contas.filter(c => c.status === 'PAGO').length;
  const contasVencidas = contas.filter(c => c.status === 'VENCIDO').length;

  return (
    <div className="dashboard-content">
      <div className="financial-summary">
        <div className="summary-header">
          <div className="summary-title">
            <DollarSign className="summary-icon" size={32} />
            <h2>Contas</h2>
          </div>
          <div className="summary-subtitle">
            Resumo das contas cadastradas
          </div>
        </div>
        <div className="summary-cards">
          <div className="summary-card balance">
            <div className="card-icon card-icon--balance"><DollarSign size={28} /></div>
            <div className="card-content">
              <h3>Total de Contas</h3>
              <span className="card-value">{totalContas}</span>
              <div className="text-muted">Valor total: {valorTotalContas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            </div>
          </div>
          <div className="summary-card">
            <div className="card-icon card-icon--pending"><Clock size={28} /></div>
            <div className="card-content">
              <h3>Contas Pendentes</h3>
              <span className="card-value">{contasPendentes}</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="card-icon card-icon--paid"><CheckCircle size={28} /></div>
            <div className="card-content">
              <h3>Contas Pagas</h3>
              <span className="card-value">{contasPagas}</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="card-icon card-icon--late"><AlertTriangle size={28} /></div>
            <div className="card-content">
              <h3>Contas Vencidas</h3>
              <span className="card-value">{contasVencidas}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="transactions-section" style={{ marginTop: 32 }}>
        <div className="section-header">
          <h3 className="section-title">Lista de Contas</h3>
        </div>
        {contas.length === 0 ? (
          <p>Nenhuma conta encontrada.</p>
        ) : (
          <div>
            {contas.map(conta => (
              <ContaCard key={conta.id} conta={conta} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContasTab; 