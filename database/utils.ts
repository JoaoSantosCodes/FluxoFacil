import { Conta } from './database';

// Formatar valor monetário
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Formatar data
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

// Formatar data completa
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR');
};

// Validar data de vencimento
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

// Calcular dias até o vencimento
export const getDiasAteVencimento = (dataVencimento: string): number => {
  const hoje = new Date();
  const vencimento = new Date(dataVencimento);
  const diffTime = vencimento.getTime() - hoje.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Verificar se conta está vencida
export const isContaVencida = (dataVencimento: string): boolean => {
  return getDiasAteVencimento(dataVencimento) < 0;
};

// Verificar se conta vence hoje
export const isContaVenceHoje = (dataVencimento: string): boolean => {
  return getDiasAteVencimento(dataVencimento) === 0;
};

// Verificar se conta vence em breve (próximos 7 dias)
export const isContaVenceEmBreve = (dataVencimento: string): boolean => {
  const dias = getDiasAteVencimento(dataVencimento);
  return dias >= 0 && dias <= 7;
};

// Obter status da conta baseado na data de vencimento
export const getStatusConta = (conta: Conta): Conta['status'] => {
  if (conta.status === 'PAGO') return 'PAGO';
  if (isContaVencida(conta.data_vencimento)) return 'VENCIDO';
  return 'PENDENTE';
};

// Calcular valor total por status
export const calcularValorPorStatus = (contas: Conta[]) => {
  return contas.reduce((acc, conta) => {
    const status = getStatusConta(conta);
    acc[status] = (acc[status] || 0) + conta.valor;
    return acc;
  }, {} as Record<Conta['status'], number>);
};

// Agrupar contas por mês
export const agruparContasPorMes = (contas: Conta[]) => {
  return contas.reduce((acc, conta) => {
    const mes = conta.data_vencimento.substring(0, 7); // YYYY-MM
    if (!acc[mes]) {
      acc[mes] = [];
    }
    acc[mes].push(conta);
    return acc;
  }, {} as Record<string, Conta[]>);
};

// Agrupar contas por fornecedor
export const agruparContasPorFornecedor = (contas: Conta[]) => {
  return contas.reduce((acc, conta) => {
    if (!acc[conta.fornecedor]) {
      acc[conta.fornecedor] = [];
    }
    acc[conta.fornecedor].push(conta);
    return acc;
  }, {} as Record<string, Conta[]>);
};

// Ordenar contas por prioridade (vencidas primeiro, depois por data)
export const ordenarContasPorPrioridade = (contas: Conta[]): Conta[] => {
  return contas.sort((a, b) => {
    const statusA = getStatusConta(a);
    const statusB = getStatusConta(b);
    
    // Vencidas primeiro
    if (statusA === 'VENCIDO' && statusB !== 'VENCIDO') return -1;
    if (statusB === 'VENCIDO' && statusA !== 'VENCIDO') return 1;
    
    // Depois por data de vencimento
    return new Date(a.data_vencimento).getTime() - new Date(b.data_vencimento).getTime();
  });
};

// Validar dados da conta
export const validarConta = (conta: Partial<Conta>): string[] => {
  const erros: string[] = [];
  
  if (!conta.fornecedor || conta.fornecedor.trim() === '') {
    erros.push('Fornecedor é obrigatório');
  }
  
  if (!conta.valor || conta.valor <= 0) {
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

// Gerar relatório de contas
export const gerarRelatorio = (contas: Conta[]) => {
  const estatisticas = {
    total: contas.length,
    pendentes: contas.filter(c => getStatusConta(c) === 'PENDENTE').length,
    pagas: contas.filter(c => getStatusConta(c) === 'PAGO').length,
    vencidas: contas.filter(c => getStatusConta(c) === 'VENCIDO').length,
    valorTotal: contas.reduce((sum, c) => sum + c.valor, 0),
    valorPendente: contas
      .filter(c => getStatusConta(c) !== 'PAGO')
      .reduce((sum, c) => sum + c.valor, 0),
    valorPago: contas
      .filter(c => getStatusConta(c) === 'PAGO')
      .reduce((sum, c) => sum + c.valor, 0)
  };
  
  return estatisticas;
}; 