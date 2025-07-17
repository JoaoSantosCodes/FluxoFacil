export interface Conta {
  id?: number;
  status: 'PENDENTE' | 'PAGO' | 'VENCIDO';
  fornecedor: string;
  valor: number;
  data_vencimento: string; // formato: YYYY-MM-DD
  parcelas: number;
  data_criacao?: string;
  data_atualizacao?: string;
}

export interface Estatisticas {
  totalContas: number;
  contasPendentes: number;
  contasPagas: number;
  contasVencidas: number;
  valorTotal: number;
  valorPago: number;
} 