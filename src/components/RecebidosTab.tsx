import React, { useState } from 'react';
import { Plus, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import { useRecebidos } from '../contexts/RecebidosContext';
import RecebidoList from './RecebidoList';
import RecebidoForm from './RecebidoForm';
import { Recebido } from '../types/recebidos';

const RecebidosTab: React.FC = () => {
  const { recebidos, adicionarRecebido, atualizarRecebido, deletarRecebido, loading } = useRecebidos();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Recebido | null>(null);

  const handleSave = async (recebido: Omit<Recebido, 'id' | 'data_criacao' | 'data_atualizacao'>) => {
    let success = false;
    if (editing) {
      success = await atualizarRecebido(editing.id!, recebido);
    } else {
      success = await adicionarRecebido(recebido);
    }
    if (success) {
      setShowForm(false);
      setEditing(null);
    }
  };

  const totalRecebidos = recebidos.length;
  const valorTotalRecebidos = recebidos.reduce((sum, r) => sum + r.valor, 0);
  const recebidosPendentes = recebidos.filter(r => r.status === 'PENDENTE').length;
  const recebidosAtrasados = recebidos.filter(r => r.status === 'ATRASADO').length;
  const recebidosRecebidos = recebidos.filter(r => r.status === 'RECEBIDO').length;

  return (
    <div className="dashboard-content" style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 6, letterSpacing: '-0.02em', color: 'hsl(var(--primary))' }}>Recebidos</h1>
        <div style={{ fontSize: '1.1rem', color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>
          Controle todos os valores a receber e recebidos do mês.
        </div>
      </div>
      <div className="financial-summary">
        <div className="summary-cards" style={{ marginBottom: 24 }}>
          <div className="summary-card income" style={{ minWidth: 260 }}>
            <div className="card-icon card-icon--income"><DollarSign size={28} /></div>
            <div className="card-content">
              <h3>Total Recebidos</h3>
              <span className="card-value">{valorTotalRecebidos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              <div className="text-muted">{totalRecebidos} recebidos</div>
            </div>
          </div>
          <div className="summary-card" style={{ minWidth: 220 }}>
            <div className="card-icon card-icon--pending"><Clock size={28} /></div>
            <div className="card-content">
              <h3>Recebidos Pendentes</h3>
              <span className="card-value">{recebidosPendentes}</span>
            </div>
          </div>
          <div className="summary-card" style={{ minWidth: 220 }}>
            <div className="card-icon card-icon--late"><AlertTriangle size={28} /></div>
            <div className="card-content">
              <h3>Recebidos Atrasados</h3>
              <span className="card-value">{recebidosAtrasados}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="transactions-section" style={{ marginTop: 32 }}>
        <div className="section-header">
          <h3 className="section-title">Lista de Recebidos</h3>
          <div className="section-actions">
            <span className="transaction-count">{recebidos.length} recebidos</span>
            <button
              onClick={() => { setEditing(null); setShowForm(true); }}
              className="btn btn-primary btn-sm"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--success)) 0%, hsl(var(--success) / 0.8) 100%)',
                color: 'hsl(var(--success-foreground))',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              <Plus size={16} />
              Novo Recebido
            </button>
          </div>
        </div>
        <RecebidoList
          recebidos={recebidos}
          onDelete={deletarRecebido}
          onEdit={(r) => { setEditing(r); setShowForm(true); }}
          loading={loading}
        />
      </div>
      {showForm && (
        <div style={{ zIndex: 100000 }}>
          <RecebidoForm
            recebido={editing}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditing(null); }}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default RecebidosTab; 