import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ArrowDownCircle, ArrowUpCircle, Tag } from 'lucide-react';

interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
  type: 'income' | 'expense';
}

const typeColors: Record<string, string> = {
  'income': 'badge badge-success',
  'expense': 'badge badge-danger',
};

const typeIcons: Record<string, JSX.Element> = {
  'income': <ArrowDownCircle size={18} style={{ color: '#10b981' }} />, // Entrada
  'expense': <ArrowUpCircle size={18} style={{ color: '#ef4444' }} />, // Saída
};

const TransactionsTab: React.FC = () => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/transacoes')
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar transações ou rota /transacoes não existe');
        return res.json();
      })
      .then(data => setTransacoes(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 32 }}>Carregando transações...</div>;
  if (error) return <div style={{ padding: 32, color: 'red' }}>Erro: {error}</div>;

  const totalReceitas = transacoes.filter(t => t.type === 'income').reduce((sum, t) => sum + t.valor, 0);
  const totalDespesas = transacoes.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.valor, 0);
  const saldo = totalReceitas - totalDespesas;

  return (
    <div className="dashboard-content" style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 6, letterSpacing: '-0.02em', color: 'hsl(var(--primary))' }}>Transações</h1>
        <div style={{ fontSize: '1.1rem', color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>
          Gerencie e visualize todas as movimentações financeiras do mês.
        </div>
      </div>
      <div className="financial-summary">
        <div className="summary-cards" style={{ marginBottom: 24 }}>
          <div className="summary-card income" style={{ minWidth: 260 }}>
            <div className="card-icon card-icon--income"><TrendingUp size={28} /></div>
            <div className="card-content">
              <h3>Receitas</h3>
              <span className="card-value">{totalReceitas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
          </div>
          <div className="summary-card expense" style={{ minWidth: 260 }}>
            <div className="card-icon card-icon--expense"><TrendingDown size={28} /></div>
            <div className="card-content">
              <h3>Despesas</h3>
              <span className="card-value">{totalDespesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
          </div>
          <div className="summary-card balance" style={{ minWidth: 260 }}>
            <div className="card-icon card-icon--balance"><DollarSign size={28} /></div>
            <div className="card-content">
              <h3>Saldo</h3>
              <span className="card-value">{saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Filtros rápidos (placeholder visual) */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <input type="text" placeholder="Buscar por descrição..." style={{ padding: '8px 14px', borderRadius: 8, border: '1.5px solid #23263a', background: 'rgba(255,255,255,0.07)', color: '#fff', fontSize: 15 }} />
        <select style={{ padding: '8px 14px', borderRadius: 8, border: '1.5px solid #23263a', background: 'rgba(255,255,255,0.07)', color: '#fff', fontSize: 15 }}>
          <option>Todos os tipos</option>
          <option value="income">Receita</option>
          <option value="expense">Despesa</option>
        </select>
        <select style={{ padding: '8px 14px', borderRadius: 8, border: '1.5px solid #23263a', background: 'rgba(255,255,255,0.07)', color: '#fff', fontSize: 15 }}>
          <option>Todas as categorias</option>
          {/* Aqui entrariam categorias reais */}
        </select>
      </div>
      <div className="transactions-section">
        <div className="section-header">
          <h3 className="section-title">Extrato de Transações</h3>
        </div>
        {transacoes.length === 0 ? (
          <p>Nenhuma transação encontrada.</p>
        ) : (
          <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.10)' }}>
            {transacoes.map((t, idx) => (
              <div key={t.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                padding: '18px 24px',
                background: idx % 2 === 0 ? 'rgba(30,34,54,0.97)' : 'rgba(24,26,40,0.97)',
                borderBottom: idx === transacoes.length - 1 ? 'none' : '1px solid #23263a',
                color: '#fff',
                fontSize: 16
              }}>
                <span>{typeIcons[t.type]}</span>
                <span style={{ fontWeight: 700, minWidth: 120 }}>{t.descricao}</span>
                <span className={typeColors[t.type]} style={{ fontSize: 13, marginLeft: 8, marginRight: 8 }}>{t.type === 'income' ? 'Receita' : 'Despesa'}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: t.type === 'income' ? '#10b981' : '#ef4444', fontWeight: 700, minWidth: 120 }}>
                  <DollarSign size={16} /> R$ {t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 110 }}>
                  <Tag size={15} /> {t.categoria}
                </span>
                <span style={{ minWidth: 100 }}>{t.data}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsTab; 