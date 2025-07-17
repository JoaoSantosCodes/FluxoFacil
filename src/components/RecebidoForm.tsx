import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, DollarSign, Tag, User, FileText } from 'lucide-react';
import { Recebido } from '../types/recebidos';

interface RecebidoFormProps {
  recebido?: Recebido | null;
  onSave: (recebido: Recebido) => void;
  onCancel: () => void;
  loading?: boolean;
}

const RecebidoForm: React.FC<RecebidoFormProps> = ({ 
  recebido, 
  onSave, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState<Recebido>({
    descricao: '',
    valor: 0,
    data_recebimento: new Date().toISOString().split('T')[0],
    categoria: '',
    fonte: '',
    status: 'PENDENTE',
    observacoes: ''
  });

  const categoriasRecebidos = [
    'Salário',
    'Freelance',
    'Investimentos',
    'Vendas',
    'Aluguel',
    'Dividendos',
    'Bônus',
    'Outros'
  ];

  const fontesRecebidos = [
    'Empresa',
    'Cliente',
    'Banco',
    'Corretora',
    'Plataforma',
    'Pessoa Física',
    'Outros'
  ];

  useEffect(() => {
    if (recebido) {
      setFormData(recebido);
    }
  }, [recebido]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.descricao || !formData.valor || !formData.data_recebimento || !formData.categoria || !formData.fonte) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const recebidoToSave: Recebido = {
      ...formData,
      id: recebido?.id,
      data_criacao: recebido?.data_criacao || new Date().toISOString(),
      data_atualizacao: new Date().toISOString()
    };

    onSave(recebidoToSave);
  };

  const handleInputChange = (field: keyof Recebido, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'hsla(var(--background) / 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: 'hsl(var(--card))',
        border: '1px solid hsl(var(--border))',
        borderRadius: '16px',
        padding: '2rem',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid hsl(var(--border))'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, hsl(var(--success)) 0%, hsl(var(--success) / 0.8) 100%)',
              color: 'hsl(var(--success-foreground))'
            }}>
              <DollarSign size={20} />
            </div>
            <div>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: 'hsl(var(--foreground))',
                margin: 0
              }}>
                {recebido ? 'Editar Recebido' : 'Novo Recebido'}
              </h2>
              <p style={{
                fontSize: '0.875rem',
                color: 'hsl(var(--muted-foreground))',
                margin: 0
              }}>
                {recebido ? 'Atualize as informações do recebido' : 'Adicione um novo recebido'}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              color: 'hsl(var(--muted-foreground))',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'hsl(var(--accent))'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Descrição */}
          <div>
            <label style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'hsl(var(--foreground))',
              marginBottom: '0.5rem',
              display: 'block'
            }}>
              <FileText size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
              Descrição *
            </label>
            <input
              type="text"
              value={formData.descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              placeholder="Ex: Salário Janeiro 2024"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid hsl(var(--border))',
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                fontSize: '0.875rem',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'hsl(var(--primary))'}
              onBlur={(e) => e.target.style.borderColor = 'hsl(var(--border))'}
            />
          </div>

          {/* Valor */}
          <div>
            <label style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'hsl(var(--foreground))',
              marginBottom: '0.5rem',
              display: 'block'
            }}>
              <DollarSign size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
              Valor *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.valor}
              onChange={(e) => handleInputChange('valor', parseFloat(e.target.value) || 0)}
              placeholder="0,00"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid hsl(var(--border))',
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                fontSize: '0.875rem',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'hsl(var(--primary))'}
              onBlur={(e) => e.target.style.borderColor = 'hsl(var(--border))'}
            />
          </div>

          {/* Data de Recebimento */}
          <div>
            <label style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'hsl(var(--foreground))',
              marginBottom: '0.5rem',
              display: 'block'
            }}>
              <Calendar size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
              Data de Recebimento *
            </label>
            <input
              type="date"
              value={formData.data_recebimento}
              onChange={(e) => handleInputChange('data_recebimento', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid hsl(var(--border))',
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                fontSize: '0.875rem',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'hsl(var(--primary))'}
              onBlur={(e) => e.target.style.borderColor = 'hsl(var(--border))'}
            />
          </div>

          {/* Categoria */}
          <div>
            <label style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'hsl(var(--foreground))',
              marginBottom: '0.5rem',
              display: 'block'
            }}>
              <Tag size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
              Categoria *
            </label>
            <select
              value={formData.categoria}
              onChange={(e) => handleInputChange('categoria', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid hsl(var(--border))',
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'hsl(var(--primary))'}
              onBlur={(e) => e.target.style.borderColor = 'hsl(var(--border))'}
            >
              <option value="">Selecione uma categoria</option>
              {categoriasRecebidos.map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
          </div>

          {/* Fonte */}
          <div>
            <label style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'hsl(var(--foreground))',
              marginBottom: '0.5rem',
              display: 'block'
            }}>
              <User size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
              Fonte *
            </label>
            <select
              value={formData.fonte}
              onChange={(e) => handleInputChange('fonte', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid hsl(var(--border))',
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'hsl(var(--primary))'}
              onBlur={(e) => e.target.style.borderColor = 'hsl(var(--border))'}
            >
              <option value="">Selecione uma fonte</option>
              {fontesRecebidos.map(fonte => (
                <option key={fonte} value={fonte}>{fonte}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'hsl(var(--foreground))',
              marginBottom: '0.5rem',
              display: 'block'
            }}>
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value as 'RECEBIDO' | 'PENDENTE' | 'ATRASADO')}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid hsl(var(--border))',
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'hsl(var(--primary))'}
              onBlur={(e) => e.target.style.borderColor = 'hsl(var(--border))'}
            >
              <option value="PENDENTE">Pendente</option>
              <option value="RECEBIDO">Recebido</option>
              <option value="ATRASADO">Atrasado</option>
            </select>
          </div>

          {/* Observações */}
          <div>
            <label style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'hsl(var(--foreground))',
              marginBottom: '0.5rem',
              display: 'block'
            }}>
              Observações
            </label>
            <textarea
              value={formData.observacoes || ''}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              placeholder="Observações adicionais..."
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid hsl(var(--border))',
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                fontSize: '0.875rem',
                resize: 'vertical',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'hsl(var(--primary))'}
              onBlur={(e) => e.target.style.borderColor = 'hsl(var(--border))'}
            />
          </div>

          {/* Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '1rem'
          }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid hsl(var(--border))',
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'hsl(var(--accent))'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'hsl(var(--card))'}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, hsl(var(--success)) 0%, hsl(var(--success) / 0.8) 100%)',
                color: 'hsl(var(--success-foreground))',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: loading ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid transparent',
                    borderTop: '2px solid currentColor',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Salvando...
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Save size={16} />
                  {recebido ? 'Atualizar' : 'Salvar'}
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecebidoForm; 