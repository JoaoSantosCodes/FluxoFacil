import { Conta } from '../types/contas';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

export const getDiasAteVencimento = (dataVencimento: string): number => {
  const hoje = new Date();
  const vencimento = new Date(dataVencimento);
  const diffTime = vencimento.getTime() - hoje.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const isContaVencida = (dataVencimento: string): boolean => {
  return getDiasAteVencimento(dataVencimento) < 0;
};

export const isContaVenceHoje = (dataVencimento: string): boolean => {
  return getDiasAteVencimento(dataVencimento) === 0;
};

export const isContaVenceEmBreve = (dataVencimento: string): boolean => {
  const dias = getDiasAteVencimento(dataVencimento);
  return dias >= 0 && dias <= 7;
};

export const getStatusConta = (conta: Conta): Conta['status'] => {
  if (conta.status === 'PAGO') return 'PAGO';
  if (isContaVencida(conta.data_vencimento)) return 'VENCIDO';
  return 'PENDENTE';
};

export const validarConta = (conta: any): string[] => {
  const erros: string[] = [];
  if (!conta.fornecedor || conta.fornecedor.trim() === '') {
    erros.push('Fornecedor é obrigatório');
  }
  if (!conta.valor || Number(conta.valor) <= 0) {
    erros.push('Valor deve ser maior que zero');
  }
  if (!conta.data_vencimento || !isValidDate(conta.data_vencimento)) {
    erros.push('Data de vencimento inválida');
  }
  if (!conta.parcelas || conta.parcelas < 1) {
    erros.push('Número de parcelas deve ser pelo menos 1');
  }
  return erros;
}; 