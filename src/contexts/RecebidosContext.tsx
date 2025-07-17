import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Recebido, EstatisticasRecebidos } from '../types/recebidos';
import { apiService, ApiResponse } from '../services/api';

interface RecebidosContextType {
  recebidos: Recebido[];
  estatisticas: EstatisticasRecebidos | null;
  loading: boolean;
  error: string | null;
  lastSync: Date | null;
  carregarRecebidos: () => Promise<void>;
  adicionarRecebido: (recebido: Omit<Recebido, 'id' | 'data_criacao' | 'data_atualizacao'>) => Promise<boolean>;
  atualizarRecebido: (id: number, recebido: Partial<Omit<Recebido, 'id' | 'data_criacao'>>) => Promise<boolean>;
  deletarRecebido: (id: number) => Promise<boolean>;
  carregarEstatisticas: () => Promise<void>;
  sincronizarDados: () => Promise<void>;
  limparErro: () => void;
}

const RecebidosContext = createContext<RecebidosContextType | undefined>(undefined);

export const useRecebidos = (): RecebidosContextType => {
  const context = useContext(RecebidosContext);
  if (!context) {
    throw new Error('useRecebidos deve ser usado dentro de um RecebidosProvider');
  }
  return context;
};

interface RecebidosProviderProps {
  children: ReactNode;
}

export const RecebidosProvider: React.FC<RecebidosProviderProps> = ({ children }) => {
  const [recebidos, setRecebidos] = useState<Recebido[]>([]);
  const [estatisticas, setEstatisticas] = useState<EstatisticasRecebidos | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Carregar dados do localStorage como cache inicial
  useEffect(() => {
    try {
      const cachedRecebidos = localStorage.getItem('fluxofacil_recebidos');
      const cachedStats = localStorage.getItem('fluxofacil_estatisticas_recebidos');
      const cachedSync = localStorage.getItem('fluxofacil_last_sync_recebidos');
      
      if (cachedRecebidos) {
        setRecebidos(JSON.parse(cachedRecebidos));
      }
      if (cachedStats) {
        setEstatisticas(JSON.parse(cachedStats));
      }
      if (cachedSync) {
        setLastSync(new Date(cachedSync));
      }
    } catch (err) {
      console.warn('Erro ao carregar cache local:', err);
    }
  }, []);

  // Salvar dados no localStorage
  const salvarCache = useCallback((novosRecebidos: Recebido[], novasStats: EstatisticasRecebidos | null) => {
    try {
      localStorage.setItem('fluxofacil_recebidos', JSON.stringify(novosRecebidos));
      if (novasStats) {
        localStorage.setItem('fluxofacil_estatisticas_recebidos', JSON.stringify(novasStats));
      }
      localStorage.setItem('fluxofacil_last_sync_recebidos', new Date().toISOString());
    } catch (err) {
      console.warn('Erro ao salvar cache local:', err);
    }
  }, []);

  const carregarRecebidos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Carregando recebidos do servidor...');
      const response = await apiService.getRecebidos();
      
      if (response.error) {
        console.error('❌ Erro da API:', response.error);
        setError(response.error);
        // Se houver erro, manter dados do cache se disponível
        if (recebidos.length === 0) {
          setError('Erro ao carregar dados. Verifique a conexão com o servidor.');
        }
      } else if (response.data) {
        console.log('✅ Recebidos carregados do servidor:', response.data);
        setRecebidos(response.data);
        setLastSync(new Date());
        salvarCache(response.data, estatisticas);
      }
    } catch (err) {
      console.error('❌ Erro ao carregar recebidos:', err);
      setError('Erro de conexão. Verifique se o servidor está rodando.');
      // Manter dados do cache se disponível
      if (recebidos.length === 0) {
        setError('Não foi possível conectar ao servidor. Dados podem estar desatualizados.');
      }
    } finally {
      setLoading(false);
    }
  };

  const carregarEstatisticas = async () => {
    try {
      console.log('📊 Carregando estatísticas dos recebidos...');
      const response = await apiService.getEstatisticasRecebidos();
      if (response.data) {
        console.log('✅ Estatísticas dos recebidos carregadas:', response.data);
        setEstatisticas(response.data);
        salvarCache(recebidos, response.data);
      }
    } catch (err) {
      console.error('❌ Erro ao carregar estatísticas dos recebidos:', err);
    }
  };

  const sincronizarDados = async () => {
    console.log('🔄 Sincronizando dados dos recebidos...');
    await Promise.all([
      carregarRecebidos(),
      carregarEstatisticas()
    ]);
  };

  const adicionarRecebido = async (recebido: Omit<Recebido, 'id' | 'data_criacao' | 'data_atualizacao'>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('➕ Adicionando novo recebido:', recebido);
      const response = await apiService.createRecebido(recebido);
      
      if (response.error) {
        console.error('❌ Erro ao adicionar recebido:', response.error);
        setError(response.error);
        return false;
      } else if (response.data) {
        console.log('✅ Recebido adicionado com sucesso:', response.data);
        const novosRecebidos = [...recebidos, response.data];
        setRecebidos(novosRecebidos);
        setLastSync(new Date());
        salvarCache(novosRecebidos, estatisticas);
        await carregarEstatisticas();
        return true;
      }
      return false;
    } catch (err) {
      console.error('❌ Erro ao adicionar recebido:', err);
      setError('Erro ao adicionar recebido. Tente novamente.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const atualizarRecebido = async (id: number, recebido: Partial<Omit<Recebido, 'id' | 'data_criacao'>>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('✏️ Atualizando recebido:', id, recebido);
      const response = await apiService.updateRecebido(id, recebido);
      
      if (response.error) {
        console.error('❌ Erro ao atualizar recebido:', response.error);
        setError(response.error);
        return false;
      } else if (response.data) {
        console.log('✅ Recebido atualizado com sucesso:', response.data);
        const novosRecebidos = recebidos.map(r => r.id === id ? response.data! : r);
        setRecebidos(novosRecebidos);
        setLastSync(new Date());
        salvarCache(novosRecebidos, estatisticas);
        await carregarEstatisticas();
        return true;
      }
      return false;
    } catch (err) {
      console.error('❌ Erro ao atualizar recebido:', err);
      setError('Erro ao atualizar recebido. Tente novamente.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deletarRecebido = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🗑️ Deletando recebido:', id);
      const response = await apiService.deleteRecebido(id);
      
      if (response.error) {
        console.error('❌ Erro ao deletar recebido:', response.error);
        setError(response.error);
        return false;
      } else {
        console.log('✅ Recebido deletado com sucesso');
        const novosRecebidos = recebidos.filter(r => r.id !== id);
        setRecebidos(novosRecebidos);
        setLastSync(new Date());
        salvarCache(novosRecebidos, estatisticas);
        await carregarEstatisticas();
        return true;
      }
    } catch (err) {
      console.error('❌ Erro ao deletar recebido:', err);
      setError('Erro ao deletar recebido. Tente novamente.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const limparErro = () => {
    setError(null);
  };

  // Carregar dados automaticamente na inicialização
  useEffect(() => {
    console.log('🚀 Inicializando RecebidosContext...');
    sincronizarDados();
  }, []);

  // Sincronização automática a cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Sincronização automática dos recebidos...');
      sincronizarDados();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, []);

  const value: RecebidosContextType = {
    recebidos,
    estatisticas,
    loading,
    error,
    lastSync,
    carregarRecebidos,
    adicionarRecebido,
    atualizarRecebido,
    deletarRecebido,
    carregarEstatisticas,
    sincronizarDados,
    limparErro,
  };

  return (
    <RecebidosContext.Provider value={value}>
      {children}
    </RecebidosContext.Provider>
  );
}; 