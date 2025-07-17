import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Recebido } from '../types/recebidos';
import { apiService, ApiResponse } from '../services/api';

interface RecebidosContextType {
  recebidos: Recebido[];
  estatisticas: any | null;
  loading: boolean;
  error: string | null;
  carregarRecebidos: () => Promise<void>;
  adicionarRecebido: (recebido: Omit<Recebido, 'id' | 'data_criacao' | 'data_atualizacao'>) => Promise<boolean>;
  atualizarRecebido: (id: number, recebido: Partial<Omit<Recebido, 'id' | 'data_criacao'>>) => Promise<boolean>;
  deletarRecebido: (id: number) => Promise<boolean>;
  carregarEstatisticas: () => Promise<void>;
}

const RecebidosContext = createContext<RecebidosContextType | undefined>(undefined);

interface RecebidosProviderProps {
  children: ReactNode;
}

export const RecebidosProvider: React.FC<RecebidosProviderProps> = ({ children }) => {
  const [recebidos, setRecebidos] = useState<Recebido[]>([]);
  const [estatisticas, setEstatisticas] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarRecebidos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Carregando recebidos...');
      const response = await apiService.getRecebidos();
      console.log('📡 Resposta da API:', response);
      
      if (response.error) {
        console.error('❌ Erro da API:', response.error);
        setError(response.error);
      } else if (response.data) {
        console.log('✅ Recebidos carregados:', response.data);
        setRecebidos(response.data);
      }
    } catch (err) {
      console.error('❌ Erro ao carregar recebidos:', err);
      setError('Erro ao carregar recebidos');
    } finally {
      setLoading(false);
    }
  };

  const carregarEstatisticas = async () => {
    try {
      const response = await apiService.getEstatisticasRecebidos();
      if (response.data) {
        setEstatisticas(response.data);
      }
    } catch (err) {
      console.error('Erro ao carregar estatísticas dos recebidos:', err);
    }
  };

  const adicionarRecebido = async (recebido: Omit<Recebido, 'id' | 'data_criacao' | 'data_atualizacao'>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.createRecebido(recebido);
      if (response.error) {
        setError(response.error);
        return false;
      } else if (response.data) {
        setRecebidos(prev => [...prev, response.data!]);
        await carregarEstatisticas();
        return true;
      }
      return false;
    } catch (err) {
      setError('Erro ao adicionar recebido');
      console.error('Erro ao adicionar recebido:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const atualizarRecebido = async (id: number, recebido: Partial<Omit<Recebido, 'id' | 'data_criacao'>>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.updateRecebido(id, recebido);
      if (response.error) {
        setError(response.error);
        return false;
      } else if (response.data) {
        setRecebidos(prev => prev.map(r => r.id === id ? response.data! : r));
        await carregarEstatisticas();
        return true;
      }
      return false;
    } catch (err) {
      setError('Erro ao atualizar recebido');
      console.error('Erro ao atualizar recebido:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deletarRecebido = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.deleteRecebido(id);
      if (response.error) {
        setError(response.error);
        return false;
      } else {
        setRecebidos(prev => prev.filter(r => r.id !== id));
        await carregarEstatisticas();
        return true;
      }
    } catch (err) {
      setError('Erro ao deletar recebido');
      console.error('Erro ao deletar recebido:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarRecebidos();
    carregarEstatisticas();
  }, []);

  const value: RecebidosContextType = {
    recebidos,
    estatisticas,
    loading,
    error,
    carregarRecebidos,
    adicionarRecebido,
    atualizarRecebido,
    deletarRecebido,
    carregarEstatisticas,
  };

  return (
    <RecebidosContext.Provider value={value}>
      {children}
    </RecebidosContext.Provider>
  );
};

export const useRecebidos = (): RecebidosContextType => {
  const context = useContext(RecebidosContext);
  if (context === undefined) {
    throw new Error('useRecebidos deve ser usado dentro de um RecebidosProvider');
  }
  return context;
}; 