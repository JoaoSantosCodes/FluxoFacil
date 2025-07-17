import { Conta } from '../types/contas';
import { Recebido } from '../types/recebidos';

const API_BASE_URL = 'http://localhost:3333';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      if (response.status === 204) {
        return { data: undefined as T };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API Error:', error);
      return { error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  }

  // Buscar todas as contas
  async getContas(): Promise<ApiResponse<Conta[]>> {
    return this.request<Conta[]>('/contas');
  }

  // Buscar conta por ID
  async getConta(id: number): Promise<ApiResponse<Conta>> {
    return this.request<Conta>(`/contas/${id}`);
  }

  // Criar nova conta
  async createConta(conta: Omit<Conta, 'id' | 'data_criacao' | 'data_atualizacao'>): Promise<ApiResponse<Conta>> {
    return this.request<Conta>('/contas', {
      method: 'POST',
      body: JSON.stringify(conta),
    });
  }

  // Atualizar conta
  async updateConta(id: number, conta: Partial<Omit<Conta, 'id' | 'data_criacao'>>): Promise<ApiResponse<Conta>> {
    return this.request<Conta>(`/contas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(conta),
    });
  }

  // Deletar conta
  async deleteConta(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/contas/${id}`, {
      method: 'DELETE',
    });
  }

  // Buscar estatísticas
  async getEstatisticas(): Promise<ApiResponse<any>> {
    return this.request<any>('/estatisticas');
  }

  // ===== MÉTODOS PARA RECEBIDOS =====

  // Buscar todos os recebidos
  async getRecebidos(): Promise<ApiResponse<Recebido[]>> {
    return this.request<Recebido[]>('/recebidos');
  }

  // Buscar recebido por ID
  async getRecebido(id: number): Promise<ApiResponse<Recebido>> {
    return this.request<Recebido>(`/recebidos/${id}`);
  }

  // Criar novo recebido
  async createRecebido(recebido: Omit<Recebido, 'id' | 'data_criacao' | 'data_atualizacao'>): Promise<ApiResponse<Recebido>> {
    return this.request<Recebido>('/recebidos', {
      method: 'POST',
      body: JSON.stringify(recebido),
    });
  }

  // Atualizar recebido
  async updateRecebido(id: number, recebido: Partial<Omit<Recebido, 'id' | 'data_criacao'>>): Promise<ApiResponse<Recebido>> {
    return this.request<Recebido>(`/recebidos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(recebido),
    });
  }

  // Deletar recebido
  async deleteRecebido(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/recebidos/${id}`, {
      method: 'DELETE',
    });
  }

  // Buscar estatísticas dos recebidos
  async getEstatisticasRecebidos(): Promise<ApiResponse<any>> {
    return this.request<any>('/estatisticas-recebidos');
  }
}

export const apiService = new ApiService(); 