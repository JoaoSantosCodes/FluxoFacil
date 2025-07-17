import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Transaction, Category } from '../types';
import { generateId } from '../utils/calculations';

interface TransactionFormProps {
  categories: Category[];
  onAddTransaction: (transaction: Transaction) => void;
  onClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ categories, onAddTransaction, onClose }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animação de entrada
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Fechar com Escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount || !formData.category) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const transaction: Transaction = {
      id: generateId(),
      description: formData.description,
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      date: formData.date,
      createdAt: new Date().toISOString()
    };

    onAddTransaction(transaction);
    onClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 200);
  };

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100000,
        padding: '1rem'
      }}
      onClick={handleClose}
    >
      <div 
        style={{
          backgroundColor: 'hsl(var(--card))',
          color: 'hsl(var(--card-foreground))',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '28rem',
          width: '100%',
          margin: '0 1rem',
          border: '1px solid hsl(var(--border))',
          transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(4px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: isVisible ? 1 : 0,
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '1.5rem', 
          borderBottom: '1px solid hsl(var(--border))',
          background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
          color: 'hsl(var(--primary-foreground))'
        }}>
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold', 
            margin: 0,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>Nova Transação</h2>
          <button 
            onClick={handleClose} 
            style={{
              padding: '0.5rem',
              background: 'hsla(var(--primary-foreground) / 0.1)',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: 'hsl(var(--primary-foreground))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'hsla(var(--primary-foreground) / 0.2)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'hsla(var(--primary-foreground) / 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: 'hsl(var(--foreground))', 
              marginBottom: '0.5rem' 
            }}>
              Tipo
            </label>
            <select
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                backgroundColor: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                fontSize: '0.875rem',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
              onFocus={(e) => {
                e.target.style.borderColor = 'hsl(var(--ring))';
                e.target.style.boxShadow = '0 0 0 2px hsl(var(--ring) / 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'hsl(var(--border))';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: 'hsl(var(--foreground))', 
              marginBottom: '0.5rem' 
            }}>
              Descrição
            </label>
            <input
              type="text"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                backgroundColor: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                fontSize: '0.875rem',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ex: Salário, Aluguel, Compras..."
              autoFocus
              onFocus={(e) => {
                e.target.style.borderColor = 'hsl(var(--ring))';
                e.target.style.boxShadow = '0 0 0 2px hsl(var(--ring) / 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'hsl(var(--border))';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: 'hsl(var(--foreground))', 
              marginBottom: '0.5rem' 
            }}>
              Valor (R$)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                backgroundColor: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                fontSize: '0.875rem',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0,00"
              onFocus={(e) => {
                e.target.style.borderColor = 'hsl(var(--ring))';
                e.target.style.boxShadow = '0 0 0 2px hsl(var(--ring) / 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'hsl(var(--border))';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: 'hsl(var(--foreground))', 
              marginBottom: '0.5rem' 
            }}>
              Categoria
            </label>
            <select
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                backgroundColor: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                fontSize: '0.875rem',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              onFocus={(e) => {
                e.target.style.borderColor = 'hsl(var(--ring))';
                e.target.style.boxShadow = '0 0 0 2px hsl(var(--ring) / 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'hsl(var(--border))';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">Selecione uma categoria</option>
              {filteredCategories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: 'hsl(var(--foreground))', 
              marginBottom: '0.5rem' 
            }}>
              Data
            </label>
            <input
              type="date"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                backgroundColor: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                fontSize: '0.875rem',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              onFocus={(e) => {
                e.target.style.borderColor = 'hsl(var(--ring))';
                e.target.style.boxShadow = '0 0 0 2px hsl(var(--ring) / 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'hsl(var(--border))';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem' }}>
            <button 
              type="submit" 
              style={{
                flex: 1,
                backgroundColor: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
                fontWeight: '600',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                fontSize: '0.875rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'hsl(var(--primary) / 0.9)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'hsl(var(--primary))';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Plus size={20} />
              Adicionar
            </button>
            <button 
              type="button" 
              onClick={handleClose} 
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid hsl(var(--border))',
                color: 'hsl(var(--foreground))',
                borderRadius: '8px',
                backgroundColor: 'hsl(var(--card))',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'hsl(var(--accent))';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'hsl(var(--card))';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm; 