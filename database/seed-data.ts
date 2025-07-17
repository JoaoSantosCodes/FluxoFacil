import database from './database';

const dadosTeste = [
  {
    status: 'VENCIDO' as const, // ATRASADO = VENCIDO no nosso sistema
    fornecedor: 'ENEL',
    valor: 186.40,
    data_vencimento: '2025-06-28',
    parcelas: 1
  },
  {
    status: 'PENDENTE' as const,
    fornecedor: 'ENEL',
    valor: 162.02,
    data_vencimento: '2025-07-28',
    parcelas: 1
  },
  {
    status: 'PENDENTE' as const,
    fornecedor: 'CONNECTVY',
    valor: 99.90,
    data_vencimento: '2025-07-20',
    parcelas: 1
  },
  {
    status: 'PENDENTE' as const,
    fornecedor: 'CLARO',
    valor: 67.35,
    data_vencimento: '2025-07-20',
    parcelas: 1
  },
  {
    status: 'PENDENTE' as const,
    fornecedor: 'INTEN',
    valor: 777.22,
    data_vencimento: '2025-07-12',
    parcelas: 1
  },
  {
    status: 'PENDENTE' as const,
    fornecedor: 'NUBANK',
    valor: 154.06,
    data_vencimento: '2025-07-19',
    parcelas: 1
  },
  {
    status: 'PENDENTE' as const,
    fornecedor: 'NUBANK',
    valor: 292.30,
    data_vencimento: '2025-07-16',
    parcelas: 3 // 3/12 parcelas
  },
  {
    status: 'PENDENTE' as const,
    fornecedor: 'MERCADO PAGO',
    valor: 2179.41,
    data_vencimento: '2025-07-21',
    parcelas: 1
  },
  {
    status: 'PENDENTE' as const,
    fornecedor: 'MERCADO PAGO',
    valor: 106.52,
    data_vencimento: '2025-07-21',
    parcelas: 2 // 2/6 parcelas
  },
  {
    status: 'PENDENTE' as const,
    fornecedor: 'MERCADO PAGO',
    valor: 331.84,
    data_vencimento: '2025-07-14',
    parcelas: 1 // 1/6 parcelas
  },
  {
    status: 'PENDENTE' as const,
    fornecedor: 'SANTANDER',
    valor: 20.33,
    data_vencimento: '2025-08-06',
    parcelas: 1
  }
];

async function inserirDadosTeste() {
  console.log('🌱 Inserindo dados de teste...\n');

  try {
    // Limpar dados existentes (opcional)
    console.log('🧹 Limpando dados existentes...');
    const contasExistentes = database.getAllContas();
    contasExistentes.forEach(conta => {
      if (conta.id) {
        database.deleteConta(conta.id);
      }
    });

    // Inserir novos dados
    console.log('📝 Inserindo contas de teste...\n');
    
    for (const conta of dadosTeste) {
      const id = database.insertConta(conta);
      console.log(`✅ ${conta.fornecedor} - R$ ${conta.valor.toFixed(2)} - ${conta.data_vencimento} (ID: ${id})`);
    }

    // Verificar dados inseridos
    console.log('\n📊 Verificando dados inseridos...');
    const todasContas = database.getAllContas();
    console.log(`Total de contas: ${todasContas.length}`);

    // Estatísticas
    const stats = database.getEstatisticas();
    console.log('\n📈 Estatísticas:');
    console.log(`- Total de contas: ${stats.totalContas}`);
    console.log(`- Pendentes: ${stats.contasPendentes}`);
    console.log(`- Pagas: ${stats.contasPagas}`);
    console.log(`- Vencidas: ${stats.contasVencidas}`);
    console.log(`- Valor total pendente: R$ ${stats.valorTotal.toFixed(2)}`);
    console.log(`- Valor total pago: R$ ${stats.valorPago.toFixed(2)}`);

    console.log('\n🎉 Dados de teste inseridos com sucesso!');
    console.log('💡 Agora você pode testar o app com dados reais.');

  } catch (error) {
    console.error('❌ Erro ao inserir dados:', error);
  } finally {
    database.close();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  inserirDadosTeste();
}

export { inserirDadosTeste }; 