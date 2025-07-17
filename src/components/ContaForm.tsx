import React, { useState, useEffect } from 'react';
import { Plus, X, Save } from 'lucide-react';
import { useContas } from '../contexts/ContasContext';
import { Conta } from '../types/contas';
import { validarConta } from '../utils/contasUtils';

interface ContaFormProps {
  conta?: Conta; // Se fornecido, é modo de edição
  onClose: () => void;
}

const ContaForm: React.FC<ContaFormProps> = ({ conta, onClose }) => {
  const { adicionarConta, atualizarConta, loading } = useContas();
  const [errors, setErrors] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    status: conta?.status || 'PENDENTE' as Conta['status'],
    fornecedor: conta?.fornecedor || '',
    valor: conta?.valor || '',
    data_vencimento: conta?.data_vencimento || new Date().toISOString().split('T')[0],
    parcelas: conta?.parcelas || 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar dados
    const validationErrors = validarConta(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);

    const contaData = {
      ...formData,
      valor: Number(formData.valor)
    };

    let success = false;
    
    if (conta) {
      // Modo edição
      success = await atualizarConta(conta.id!, contaData);
    } else {
      // Modo criação
      success = await adicionarConta(contaData);
    }

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex-center z-50">
      <div className="card max-w-md w-full mx-4 bg-card border border-border shadow-2xl">
        <div className="flex-between mb-4">
          <h2 className="text-xl font-bold text-foreground">
            {conta ? 'Editar Conta' : 'Nova Conta'}
          </h2>
          <button onClick={onClose} className="btn btn-secondary">
            <X size={20} />
          </button>
        </div>

        {errors.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <ul className="text-red-600 dark:text-red-400 text-sm">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Conta['status'] })}
            >
              <option value="PENDENTE">Pendente</option>
              <option value="PAGO">Pago</option>
              <option value="VENCIDO">Vencido</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Fornecedor</label>
            <input
              type="text"
              className="form-input"
              value={formData.fornecedor}
              onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
              placeholder="Ex: Energia Elétrica, Água, Internet..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="form-input"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              placeholder="0,00"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Data de Vencimento</label>
            <input
              type="date"
              className="form-input"
              value={formData.data_vencimento}
              onChange={(e) => setFormData({ ...formData, data_vencimento: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Parcelas</label>
            <input
              type="number"
              min="1"
              max="12"
              className="form-input"
              value={formData.parcelas}
              onChange={(e) => setFormData({ ...formData, parcelas: Number(e.target.value) })}
              placeholder="1"
            />
          </div>

          <div className="flex gap-3">
            <button 
              type="submit" 
              className="btn btn-primary flex-1"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : conta ? (
                <>
                  <Save size={20} />
                  Salvar
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Adicionar
                </>
              )}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContaForm; 