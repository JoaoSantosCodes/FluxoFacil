import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Conta, Estatisticas } from '../types/contas';
import { apiService, ApiResponse } from '../services/api';

interface ContasContextType {
  contas: Conta[];
  estatisticas: Estatisticas | null;
  loading: boolean;
  error: string | null;
  carregarContas: () => Promise<void>;
  adicionarConta: (conta: Omit<Conta, 'id' | 'data_criacao' | 'data_atualizacao'>) => Promise<boolean>;
  atualizarConta: (id: number, conta: Partial<Omit<Conta, 'id' | 'data_criacao'>>) => Promise<boolean>;
  deletarConta: (id: number) => Promise<boolean>;
  carregarEstatisticas: () => Promise<void>;
}

const ContasContext = createContext<ContasContextType | undefined>(undefined);

export const useContas = () => {
  const context = useContext(ContasContext);
  if (!context) {
    throw new Error('useContas deve ser usado dentro de um ContasProvider');
  }
  return context;
};

interface ContasProviderProps {
  children: ReactNode;
}

export const ContasProvider: React.FC<ContasProviderProps> = ({ children }) => {
  const [contas, setContas] = useState<Conta[]>([]);
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarContas = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Carregando contas...');
      const response = await apiService.getContas();
      console.log('📡 Resposta da API:', response);
      
      if (response.error) {
        console.error('❌ Erro da API:', response.error);
        setError(response.error);
      } else if (response.data) {
        console.log('✅ Contas carregadas:', response.data);
        setContas(response.data);
      }
    } catch (err) {
      console.error('❌ Erro ao carregar contas:', err);
      setError('Erro ao carregar contas');
    } finally {
      setLoading(false);
    }
  };

  const carregarEstatisticas = async () => {
    try {
      const response = await apiService.getEstatisticas();
      if (response.data) {
        setEstatisticas(response.data);
      }
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  };

  const adicionarConta = async (conta: Omit<Conta, 'id' | 'data_criacao' | 'data_atualizacao'>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.createConta(conta);
      if (response.error) {
        setError(response.error);
        return false;
      } else if (response.data) {
        setContas(prev => [...prev, response.data!]);
        await carregarEstatisticas();
        return true;
      }
      return false;
    } catch (err) {
      setError('Erro ao adicionar conta');
      console.error('Erro ao adicionar conta:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const atualizarConta = async (id: number, conta: Partial<Omit<Conta, 'id' | 'data_criacao'>>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.updateConta(id, conta);
      if (response.error) {
        setError(response.error);
        return false;
      } else if (response.data) {
        setContas(prev => prev.map(c => c.id === id ? response.data! : c));
        await carregarEstatisticas();
        return true;
      }
      return false;
    } catch (err) {
      setError('Erro ao atualizar conta');
      console.error('Erro ao atualizar conta:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deletarConta = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.deleteConta(id);
      if (response.error) {
        setError(response.error);
        return false;
      } else {
        setContas(prev => prev.filter(c => c.id !== id));
        await carregarEstatisticas();
        return true;
      }
    } catch (err) {
      setError('Erro ao deletar conta');
      console.error('Erro ao deletar conta:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarContas();
    carregarEstatisticas();
  }, []);

  const value: ContasContextType = {
    contas,
    estatisticas,
    loading,
    error,
    carregarContas,
    adicionarConta,
    atualizarConta,
    deletarConta,
    carregarEstatisticas,
  };

  return (
    <ContasContext.Provider value={value}>
      {children}
    </ContasContext.Provider>
  );
}; 