import React, { useEffect, useState } from 'react';
import { Trash2, Edit, Calendar, Tag, AlertTriangle, CheckCircle, Clock, DollarSign, CreditCard, Check } from 'lucide-react';
import { useContas } from '../contexts/ContasContext';
import { formatCurrency, formatDate, getStatusConta, isContaVenceEmBreve } from '../utils/contasUtils';
import { Conta } from '../types/contas';

// CSS animation for loading spinner
const spinnerAnimation = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

interface ContasListProps {
  filter: 'todas' | 'pendentes' | 'vencidas' | 'pagas';
  monthFilter?: string;
  fornecedorFilter?: string;
  onCountsChange?: (counts: { todas: number; pendentes: number; vencidas: number; pagas: number }) => void;
}

const ContasList: React.FC<ContasListProps> = ({ filter, monthFilter = '', fornecedorFilter = '', onCountsChange }) => {
  const { contas, loading, error, deletarConta, atualizarConta } = useContas();
  const [pagandoConta, setPagandoConta] = useState<number | null>(null);

  useEffect(() => {
    // Add CSS animation if not already present
    if (!document.getElementById('contas-list-styles')) {
      const style = document.createElement('style');
      style.id = 'contas-list-styles';
      style.textContent = spinnerAnimation;
      document.head.appendChild(style);
    }
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta conta?')) {
      await deletarConta(id);
    }
  };

  const handlePagar = async (conta: Conta) => {
    if (confirm(`Confirmar pagamento de ${conta.fornecedor} - ${formatCurrency(conta.valor)}?`)) {
      setPagandoConta(conta.id!);
      
      try {
        // Atualizar a conta para status pago
        const contaAtualizada = {
          ...conta,
          status: 'PAGO' as const,
          data_pagamento: new Date().toISOString().split('T')[0]
        };
        
        const success = await atualizarConta(conta.id!, contaAtualizada);
        
        if (success) {
          // Feedback visual de sucesso
          setTimeout(() => {
            setPagandoConta(null);
          }, 2000);
        } else {
          setPagandoConta(null);
          alert('Erro ao marcar conta como paga. Tente novamente.');
        }
      } catch (error) {
        setPagandoConta(null);
        alert('Erro ao marcar conta como paga. Tente novamente.');
      }
    }
  };

  // Filtrar contas baseado no status selecionado e filtros adicionais
  const filteredContas = contas.filter(conta => {
    const status = getStatusConta(conta);
    
    // Filtro por status
    let statusMatch = false;
    switch (filter) {
      case 'todas':
        statusMatch = true;
        break;
      case 'pendentes':
        statusMatch = status === 'PENDENTE';
        break;
      case 'vencidas':
        statusMatch = status === 'VENCIDO';
        break;
      case 'pagas':
        statusMatch = status === 'PAGO';
        break;
      default:
        statusMatch = true;
    }
    
    if (!statusMatch) return false;
    
    // Filtro por mês de vencimento
    if (monthFilter) {
      const contaMonth = conta.data_vencimento.split('-')[1]; // Extrair mês (MM)
      if (contaMonth !== monthFilter) return false;
    }
    
    // Filtro por fornecedor
    if (fornecedorFilter) {
      const fornecedorLower = conta.fornecedor.toLowerCase();
      const filterLower = fornecedorFilter.toLowerCase();
      if (!fornecedorLower.includes(filterLower)) return false;
    }
    
    return true;
  });

  // Contar contas por status
  const getContaCounts = () => {
    const counts = {
      todas: contas.length,
      pendentes: contas.filter(conta => getStatusConta(conta) === 'PENDENTE').length,
      vencidas: contas.filter(conta => getStatusConta(conta) === 'VENCIDO').length,
      pagas: contas.filter(conta => getStatusConta(conta) === 'PAGO').length
    };
    return counts;
  };

  // Expor contadores para o componente pai
  useEffect(() => {
    const counts = getContaCounts();
    onCountsChange?.(counts);
  }, [contas, onCountsChange]);

  const getStatusIcon = (conta: Conta) => {
    const status = getStatusConta(conta);
    
    switch (status) {
      case 'PAGO':
        return <CheckCircle size={18} style={{ color: 'hsl(var(--success))' }} />;
      case 'VENCIDO':
        return <AlertTriangle size={18} style={{ color: 'hsl(var(--destructive))' }} />;
      case 'PENDENTE':
        if (isContaVenceEmBreve(conta.data_vencimento)) {
          return <Clock size={18} style={{ color: 'hsl(var(--warning))' }} />;
        }
        return <Clock size={18} style={{ color: 'hsl(var(--primary))' }} />;
      default:
        return <Clock size={18} style={{ color: 'hsl(var(--muted-foreground))' }} />;
    }
  };

  const getStatusText = (conta: Conta) => {
    const status = getStatusConta(conta);
    
    switch (status) {
      case 'PAGO':
        return 'Pago';
      case 'VENCIDO':
        return 'Vencido';
      case 'PENDENTE':
        if (isContaVenceEmBreve(conta.data_vencimento)) {
          return 'Vence em breve';
        }
        return 'Pendente';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusStyle = (conta: Conta) => {
    const status = getStatusConta(conta);
    
    switch (status) {
      case 'PAGO':
        return {
          background: 'hsla(var(--success) / 0.1)',
          color: 'hsl(var(--success))',
          border: '1px solid hsla(var(--success) / 0.2)'
        };
      case 'VENCIDO':
        return {
          background: 'hsla(var(--destructive) / 0.1)',
          color: 'hsl(var(--destructive))',
          border: '1px solid hsla(var(--destructive) / 0.2)'
        };
      case 'PENDENTE':
        if (isContaVenceEmBreve(conta.data_vencimento)) {
          return {
            background: 'hsla(var(--warning) / 0.1)',
            color: 'hsl(var(--warning))',
            border: '1px solid hsla(var(--warning) / 0.2)'
          };
        }
        return {
          background: 'hsla(var(--primary) / 0.1)',
          color: 'hsl(var(--primary))',
          border: '1px solid hsla(var(--primary) / 0.2)'
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
          borderTop: '2px solid hsl(var(--primary))',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }} />
        <p style={{ color: 'hsl(var(--muted-foreground))' }}>Carregando contas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: 'hsla(var(--destructive) / 0.05)',
        border: '1px solid hsla(var(--destructive) / 0.2)',
        borderRadius: '12px',
        padding: '1.5rem',
        textAlign: 'center'
      }}>
        <AlertTriangle size={48} style={{ color: 'hsl(var(--destructive))', margin: '0 auto 1rem' }} />
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: 'hsl(var(--destructive))',
          marginBottom: '0.5rem'
        }}>
          Erro ao carregar contas
        </h3>
        <p style={{ color: 'hsl(var(--destructive))' }}>{error}</p>
      </div>
    );
  }

  if (filteredContas.length === 0) {
    const getEmptyMessage = () => {
      // Verificar se há filtros ativos
      const hasActiveFilters = monthFilter || fornecedorFilter;
      
      if (hasActiveFilters) {
        let filterText = [];
        if (monthFilter) {
          const monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
          ];
          const monthIndex = parseInt(monthFilter) - 1;
          filterText.push(monthNames[monthIndex]);
        }
        if (fornecedorFilter) {
          filterText.push(`fornecedor "${fornecedorFilter}"`);
        }
        
        return {
          title: 'Nenhuma conta encontrada',
          message: `Nenhuma conta encontrada com os filtros aplicados (${filterText.join(', ')}).`,
          icon: '🔍'
        };
      }
      
      switch (filter) {
        case 'pendentes':
          return {
            title: 'Nenhuma conta pendente',
            message: 'Todas as suas contas estão em dia! 🎉',
            icon: '✅'
          };
        case 'vencidas':
          return {
            title: 'Nenhuma conta vencida',
            message: 'Excelente! Você está em dia com suas contas! 🎉',
            icon: '✅'
          };
        case 'pagas':
          return {
            title: 'Nenhuma conta paga',
            message: 'Ainda não há contas pagas registradas.',
            icon: '📊'
          };
        default:
          return {
            title: 'Nenhuma conta registrada',
            message: 'Adicione sua primeira conta para começar a controlar suas despesas!',
            icon: '📊'
          };
      }
    };

    const emptyMessage = getEmptyMessage();

    return (
      <div style={{
        background: 'hsl(var(--card))',
        border: '1px solid hsl(var(--border))',
        borderRadius: '12px',
        padding: '2.5rem 1.25rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{emptyMessage.icon}</div>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          marginBottom: '0.5rem',
          color: 'hsl(var(--foreground))'
        }}>
          {emptyMessage.title}
        </h3>
        <p style={{
          color: 'hsl(var(--muted-foreground))',
          marginBottom: '1rem'
        }}>
          {emptyMessage.message}
        </p>
        {filter === 'todas' && (
          <div style={{
            fontSize: '0.875rem',
            color: 'hsl(var(--muted-foreground))'
          }}>
            <p>💡 Dica: Use o botão "Nova Conta" para adicionar contas e despesas</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {filteredContas.map(conta => {
        const status = getStatusConta(conta);
        const isPaga = status === 'PAGO';
        
        return (
          <div
            key={conta.id}
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
              e.currentTarget.style.borderColor = 'hsl(var(--primary))';
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
                background: 'linear-gradient(135deg, hsla(var(--primary) / 0.02) 0%, hsla(var(--accent) / 0.02) 100%)',
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
                    background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
                    color: 'hsl(var(--primary-foreground))'
                  }}>
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: 'hsl(var(--foreground))',
                      margin: 0,
                      marginBottom: '0.25rem'
                    }}>
                      {conta.fornecedor}
                    </h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {getStatusIcon(conta)}
                      <span style={{
                        fontSize: '0.875rem',
                        color: 'hsl(var(--muted-foreground))'
                      }}>
                        {getStatusText(conta)}
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
                  ...getStatusStyle(conta)
                }}>
                  {getStatusText(conta)}
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
                    <span>{formatDate(conta.data_vencimento)}</span>
                  </div>
                  {conta.parcelas > 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>📦 {conta.parcelas}x</span>
                    </div>
                  )}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    background: 'hsla(var(--primary) / 0.1)',
                    borderRadius: '8px',
                    border: '1px solid hsla(var(--primary) / 0.2)'
                  }}>
                    <DollarSign size={16} style={{ color: 'hsl(var(--primary))' }} />
                    <span style={{
                      fontSize: '1.125rem',
                      fontWeight: '700',
                      color: 'hsl(var(--foreground))'
                    }}>
                      {formatCurrency(conta.valor)}
                    </span>
                  </div>

                  {/* Botão Pagar - só mostra se não estiver paga */}
                  {!isPaga && (
                    <button
                      onClick={() => handlePagar(conta)}
                      disabled={pagandoConta === conta.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        background: pagandoConta === conta.id 
                          ? 'hsla(var(--success) / 0.2)'
                          : 'hsla(var(--success) / 0.1)',
                        border: '1px solid hsla(var(--success) / 0.2)',
                        color: 'hsl(var(--success))',
                        cursor: pagandoConta === conta.id ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        opacity: pagandoConta === conta.id ? 0.7 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (pagandoConta !== conta.id) {
                          e.currentTarget.style.background = 'hsla(var(--success) / 0.2)';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (pagandoConta !== conta.id) {
                          e.currentTarget.style.background = 'hsla(var(--success) / 0.1)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }
                      }}
                      title={pagandoConta === conta.id ? "Processando pagamento..." : "Marcar como paga"}
                    >
                      {pagandoConta === conta.id ? (
                        <>
                          <div style={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid hsl(var(--success))',
                            borderTop: '2px solid transparent',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }} />
                          Pago!
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          Pagar
                        </>
                      )}
                    </button>
                  )}

                  {/* Botão de exclusão */}
                  <button
                    onClick={() => handleDelete(conta.id!)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'hsla(var(--destructive) / 0.1)',
                      border: '1px solid hsla(var(--destructive) / 0.2)',
                      color: 'hsl(var(--destructive))',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'hsla(var(--destructive) / 0.2)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'hsla(var(--destructive) / 0.1)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    title="Excluir conta"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContasList; 