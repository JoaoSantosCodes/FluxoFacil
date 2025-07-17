import React from 'react';
import { Trash2, Edit, Calendar, Tag, AlertTriangle, CheckCircle, Clock, DollarSign, User, FileText } from 'lucide-react';
import { Recebido } from '../types/recebidos';

interface RecebidoListProps {
  recebidos: Recebido[];
  onDelete: (id: number) => void;
  onEdit: (recebido: Recebido) => void;
  loading?: boolean;
}

const RecebidoList: React.FC<RecebidoListProps> = ({ 
  recebidos, 
  onDelete, 
  onEdit, 
  loading = false 
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'RECEBIDO':
        return <CheckCircle size={18} style={{ color: 'hsl(var(--success))' }} />;
      case 'ATRASADO':
        return <AlertTriangle size={18} style={{ color: 'hsl(var(--destructive))' }} />;
      case 'PENDENTE':
        return <Clock size={18} style={{ color: 'hsl(var(--warning))' }} />;
      default:
        return <Clock size={18} style={{ color: 'hsl(var(--muted-foreground))' }} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'RECEBIDO':
        return 'Recebido';
      case 'ATRASADO':
        return 'Atrasado';
      case 'PENDENTE':
        return 'Pendente';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'RECEBIDO':
        return {
          background: 'hsla(var(--success) / 0.1)',
          color: 'hsl(var(--success))',
          border: '1px solid hsla(var(--success) / 0.2)'
        };
      case 'ATRASADO':
        return {
          background: 'hsla(var(--destructive) / 0.1)',
          color: 'hsl(var(--destructive))',
          border: '1px solid hsla(var(--destructive) / 0.2)'
        };
      case 'PENDENTE':
        return {
          background: 'hsla(var(--warning) / 0.1)',
          color: 'hsl(var(--warning))',
          border: '1px solid hsla(var(--warning) / 0.2)'
        };
      default:
        return {
          background: 'hsla(var(--muted) / 0.1)',
          color: 'hsl(var(--muted-foreground))',
          border: '1px solid hsla(var(--muted) / 0.2)'
        };
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        flexDirection: 'column'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '2px solid hsl(var(--border))',
          borderTop: '2px solid hsl(var(--success))',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }} />
        <p style={{ color: 'hsl(var(--muted-foreground))' }}>Carregando recebidos...</p>
      </div>
    );
  }

  if (recebidos.length === 0) {
    return (
      <div style={{
        background: 'hsl(var(--card))',
        border: '1px solid hsl(var(--border))',
        borderRadius: '12px',
        padding: '2.5rem 1.25rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💰</div>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          marginBottom: '0.5rem',
          color: 'hsl(var(--foreground))'
        }}>
          Nenhum recebido registrado
        </h3>
        <p style={{
          color: 'hsl(var(--muted-foreground))',
          marginBottom: '1rem'
        }}>
          Adicione seu primeiro recebido para começar a controlar suas receitas!
        </p>
        <div style={{
          fontSize: '0.875rem',
          color: 'hsl(var(--muted-foreground))'
        }}>
          <p>💡 Dica: Use o botão "Novo Recebido" para adicionar receitas e recebimentos</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {recebidos.map(recebido => (
        <div
          key={recebido.id}
          style={{
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '16px',
            padding: '1.25rem',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            e.currentTarget.style.borderColor = 'hsl(var(--success))';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.borderColor = 'hsl(var(--border))';
          }}
        >
          {/* Background gradient overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, hsla(var(--success) / 0.02) 0%, hsla(var(--accent) / 0.02) 100%)',
              borderRadius: '16px',
              opacity: 0,
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, hsl(var(--success)) 0%, hsl(var(--accent)) 100%)',
                  color: 'hsl(var(--success-foreground))'
                }}>
                  <DollarSign size={20} />
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: 'hsl(var(--foreground))',
                    margin: 0,
                    marginBottom: '0.25rem'
                  }}>
                    {recebido.descricao}
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {getStatusIcon(recebido.status)}
                    <span style={{
                      fontSize: '0.875rem',
                      color: 'hsl(var(--muted-foreground))'
                    }}>
                      {getStatusText(recebido.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: '600',
                ...getStatusStyle(recebido.status)
              }}>
                {getStatusText(recebido.status)}
              </div>
            </div>

            {/* Content */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: '1rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                fontSize: '0.875rem',
                color: 'hsl(var(--muted-foreground))'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={16} />
                  <span>{formatDate(recebido.data_recebimento)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Tag size={16} />
                  <span>{recebido.categoria}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={16} />
                  <span>{recebido.fonte}</span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: 'hsl(var(--success))'
                }}>
                  {formatCurrency(recebido.valor)}
                </span>
              </div>
            </div>

            {/* Observações */}
            {recebido.observacoes && (
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                background: 'hsla(var(--muted) / 0.1)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: 'hsl(var(--muted-foreground))'
              }}>
                <strong>Observações:</strong> {recebido.observacoes}
              </div>
            )}

            {/* Actions */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.5rem',
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid hsl(var(--border))'
            }}>
              <button
                onClick={() => onEdit(recebido)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid hsl(var(--border))',
                  background: 'hsl(var(--card))',
                  color: 'hsl(var(--foreground))',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'hsl(var(--accent))';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'hsl(var(--card))';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Edit size={16} />
                Editar
              </button>
              <button
                onClick={() => {
                  if (confirm('Tem certeza que deseja excluir este recebido?')) {
                    onDelete(recebido.id!);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid hsl(var(--destructive))',
                  background: 'hsla(var(--destructive) / 0.1)',
                  color: 'hsl(var(--destructive))',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'hsl(var(--destructive))';
                  e.currentTarget.style.color = 'hsl(var(--destructive-foreground))';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'hsla(var(--destructive) / 0.1)';
                  e.currentTarget.style.color = 'hsl(var(--destructive))';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Trash2 size={16} />
                Excluir
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecebidoList; 