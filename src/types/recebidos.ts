export interface Recebido {
  id?: number;
  descricao: string;
  valor: number;
  data_recebimento: string;
  categoria: string;
  fonte: string; // Ex: Salário, Freelance, Investimentos, etc.
  status: 'RECEBIDO' | 'PENDENTE' | 'ATRASADO';
  observacoes?: string;
  data_criacao?: string;
  data_atualizacao?: string;
}

export interface EstatisticasRecebidos {
  totalRecebidos: number;
  recebidosConfirmados: number;
  recebidosPendentes: number;
  recebidosAtrasados: number;
  valorTotal: number;
  valorRecebido: number;
  valorPendente: number;
  valorAtrasado: number;
} 