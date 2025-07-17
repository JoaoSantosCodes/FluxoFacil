import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Conta, Estatisticas } from '../types/contas';
import { apiService, ApiResponse } from '../services/api';

interface ContasContextType {
  contas: Conta[];
  estatisticas: Estatisticas | null;
  loading: boolean;
  error: string | null;
  lastSync: Date | null;
  carregarContas: () => Promise<void>;
  adicionarConta: (conta: Omit<Conta, 'id' | 'data_criacao' | 'data_atualizacao'>) => Promise<boolean>;
  atualizarConta: (id: number, conta: Partial<Omit<Conta, 'id' | 'data_criacao'>>) => Promise<boolean>;
  deletarConta: (id: number) => Promise<boolean>;
  carregarEstatisticas: () => Promise<void>;
  sincronizarDados: () => Promise<void>;
  limparErro: () => void;
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
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Carregar dados do localStorage como cache inicial
  useEffect(() => {
    try {
      const cachedContas = localStorage.getItem('fluxofacil_contas');
      const cachedStats = localStorage.getItem('fluxofacil_estatisticas');
      const cachedSync = localStorage.getItem('fluxofacil_last_sync');
      
      if (cachedContas) {
        setContas(JSON.parse(cachedContas));
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
  const salvarCache = useCallback((novasContas: Conta[], novasStats: Estatisticas | null) => {
    try {
      localStorage.setItem('fluxofacil_contas', JSON.stringify(novasContas));
      if (novasStats) {
        localStorage.setItem('fluxofacil_estatisticas', JSON.stringify(novasStats));
      }
      localStorage.setItem('fluxofacil_last_sync', new Date().toISOString());
    } catch (err) {
      console.warn('Erro ao salvar cache local:', err);
    }
  }, []);

  const carregarContas = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Carregando contas do servidor...');
      const response = await apiService.getContas();
      
      if (response.error) {
        console.error('❌ Erro da API:', response.error);
        setError(response.error);
        // Se houver erro, manter dados do cache se disponível
        if (contas.length === 0) {
          setError('Erro ao carregar dados. Verifique a conexão com o servidor.');
        }
      } else if (response.data) {
        console.log('✅ Contas carregadas do servidor:', response.data);
        setContas(response.data);
        setLastSync(new Date());
        salvarCache(response.data, estatisticas);
      }
    } catch (err) {
      console.error('❌ Erro ao carregar contas:', err);
      setError('Erro de conexão. Verifique se o servidor está rodando.');
      // Manter dados do cache se disponível
      if (contas.length === 0) {
        setError('Não foi possível conectar ao servidor. Dados podem estar desatualizados.');
      }
    } finally {
      setLoading(false);
    }
  };

  const carregarEstatisticas = async () => {
    try {
      console.log('📊 Carregando estatísticas...');
      const response = await apiService.getEstatisticas();
      if (response.data) {
        console.log('✅ Estatísticas carregadas:', response.data);
        setEstatisticas(response.data);
        salvarCache(contas, response.data);
      }
    } catch (err) {
      console.error('❌ Erro ao carregar estatísticas:', err);
    }
  };

  const sincronizarDados = async () => {
    console.log('🔄 Sincronizando dados...');
    await Promise.all([
      carregarContas(),
      carregarEstatisticas()
    ]);
  };

  const adicionarConta = async (conta: Omit<Conta, 'id' | 'data_criacao' | 'data_atualizacao'>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('➕ Adicionando nova conta:', conta);
      const response = await apiService.createConta(conta);
      
      if (response.error) {
        console.error('❌ Erro ao adicionar conta:', response.error);
        setError(response.error);
        return false;
      } else if (response.data) {
        console.log('✅ Conta adicionada com sucesso:', response.data);
        const novasContas = [...contas, response.data];
        setContas(novasContas);
        setLastSync(new Date());
        salvarCache(novasContas, estatisticas);
        await carregarEstatisticas();
        return true;
      }
      return false;
    } catch (err) {
      console.error('❌ Erro ao adicionar conta:', err);
      setError('Erro ao adicionar conta. Tente novamente.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const atualizarConta = async (id: number, conta: Partial<Omit<Conta, 'id' | 'data_criacao'>>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('✏️ Atualizando conta:', id, conta);
      const response = await apiService.updateConta(id, conta);
      
      if (response.error) {
        console.error('❌ Erro ao atualizar conta:', response.error);
        setError(response.error);
        return false;
      } else if (response.data) {
        console.log('✅ Conta atualizada com sucesso:', response.data);
        const novasContas = contas.map(c => c.id === id ? response.data! : c);
        setContas(novasContas);
        setLastSync(new Date());
        salvarCache(novasContas, estatisticas);
        await carregarEstatisticas();
        return true;
      }
      return false;
    } catch (err) {
      console.error('❌ Erro ao atualizar conta:', err);
      setError('Erro ao atualizar conta. Tente novamente.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deletarConta = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🗑️ Deletando conta:', id);
      const response = await apiService.deleteConta(id);
      
      if (response.error) {
        console.error('❌ Erro ao deletar conta:', response.error);
        setError(response.error);
        return false;
      } else {
        console.log('✅ Conta deletada com sucesso');
        const novasContas = contas.filter(c => c.id !== id);
        setContas(novasContas);
        setLastSync(new Date());
        salvarCache(novasContas, estatisticas);
        await carregarEstatisticas();
        return true;
      }
    } catch (err) {
      console.error('❌ Erro ao deletar conta:', err);
      setError('Erro ao deletar conta. Tente novamente.');
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
    console.log('🚀 Inicializando ContasContext...');
    sincronizarDados();
  }, []);

  // Sincronização automática a cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Sincronização automática...');
      sincronizarDados();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, []);

  const value: ContasContextType = {
    contas,
    estatisticas,
    loading,
    error,
    lastSync,
    carregarContas,
    adicionarConta,
    atualizarConta,
    deletarConta,
    carregarEstatisticas,
    sincronizarDados,
    limparErro,
  };

  return (
    <ContasContext.Provider value={value}>
      {children}
    </ContasContext.Provider>
  );
}; 