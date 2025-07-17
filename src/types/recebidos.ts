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