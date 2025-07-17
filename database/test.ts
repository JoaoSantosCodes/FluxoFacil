import database, { Conta } from './database';
import { formatCurrency, formatDate, getStatusConta, gerarRelatorio } from './utils';

// Função para testar o banco de dados
async function testarBancoDeDados() {
  console.log('🧪 Iniciando testes do banco de dados...\n');

  try {
    // 1. Inserir contas de exemplo
    console.log('1️⃣ Inserindo contas de exemplo...');
    
    const contasExemplo: Omit<Conta, 'id' | 'data_criacao' | 'data_atualizacao'>[] = [
      {
        status: 'PENDENTE',
        fornecedor: 'Energia Elétrica',
        valor: 150.00,
        data_vencimento: '2024-01-15',
        parcelas: 1
      },
      {
        status: 'PENDENTE',
        fornecedor: 'Água e Esgoto',
        valor: 85.50,
        data_vencimento: '2024-01-20',
        parcelas: 1
      },
      {
        status: 'PAGO',
        fornecedor: 'Internet',
        valor: 99.90,
        data_vencimento: '2024-01-10',
        parcelas: 1
      },
      {
        status: 'PENDENTE',
        fornecedor: 'Cartão de Crédito',
        valor: 1200.00,
        data_vencimento: '2024-01-25',
        parcelas: 3
      },
      {
        status: 'VENCIDO',
        fornecedor: 'Aluguel',
        valor: 800.00,
        data_vencimento: '2024-01-05',
        parcelas: 1
      }
    ];

    for (const conta of contasExemplo) {
      const id = database.insertConta(conta);
      console.log(`   ✅ Conta inserida com ID: ${id}`);
    }

    // 2. Buscar todas as contas
    console.log('\n2️⃣ Buscando todas as contas...');
    const todasContas = database.getAllContas();
    console.log(`   📊 Total de contas: ${todasContas.length}`);
    
    todasContas.forEach(conta => {
      const status = getStatusConta(conta);
      console.log(`   📋 ID: ${conta.id} | ${conta.fornecedor} | ${formatCurrency(conta.valor)} | ${formatDate(conta.data_vencimento)} | Status: ${status}`);
    });

    // 3. Buscar contas por status
    console.log('\n3️⃣ Buscando contas por status...');
    const contasPendentes = database.getContasByStatus('PENDENTE');
    const contasPagas = database.getContasByStatus('PAGO');
    const contasVencidas = database.getContasByStatus('VENCIDO');
    
    console.log(`   ⏳ Pendentes: ${contasPendentes.length}`);
    console.log(`   ✅ Pagas: ${contasPagas.length}`);
    console.log(`   ❌ Vencidas: ${contasVencidas.length}`);

    // 4. Buscar contas vencidas
    console.log('\n4️⃣ Buscando contas vencidas...');
    const contasVencidasDB = database.getContasVencidas();
    console.log(`   🚨 Contas vencidas: ${contasVencidasDB.length}`);
    contasVencidasDB.forEach(conta => {
      console.log(`   ⚠️  ${conta.fornecedor} - ${formatCurrency(conta.valor)} - Venceu em ${formatDate(conta.data_vencimento)}`);
    });

    // 5. Buscar contas por fornecedor
    console.log('\n5️⃣ Buscando contas por fornecedor...');
    const contasEnergia = database.getContasByFornecedor('Energia');
    console.log(`   ⚡ Contas de energia: ${contasEnergia.length}`);
    contasEnergia.forEach(conta => {
      console.log(`   💡 ${conta.fornecedor} - ${formatCurrency(conta.valor)}`);
    });

    // 6. Atualizar uma conta
    console.log('\n6️⃣ Atualizando uma conta...');
    const contaParaAtualizar = todasContas[0];
    if (contaParaAtualizar) {
      const sucesso = database.updateConta(contaParaAtualizar.id!, { status: 'PAGO' });
      console.log(`   ${sucesso ? '✅' : '❌'} Conta atualizada com sucesso`);
      
      const contaAtualizada = database.getContaById(contaParaAtualizar.id!);
      console.log(`   📝 Nova status: ${contaAtualizada?.status}`);
    }

    // 7. Gerar estatísticas
    console.log('\n7️⃣ Gerando estatísticas...');
    const estatisticas = database.getEstatisticas();
    console.log(`   📈 Total de contas: ${estatisticas.totalContas}`);
    console.log(`   ⏳ Pendentes: ${estatisticas.contasPendentes}`);
    console.log(`   ✅ Pagas: ${estatisticas.contasPagas}`);
    console.log(`   ❌ Vencidas: ${estatisticas.contasVencidas}`);
    console.log(`   💰 Valor total pendente: ${formatCurrency(estatisticas.valorTotal)}`);
    console.log(`   💰 Valor total pago: ${formatCurrency(estatisticas.valorPago)}`);

    // 8. Gerar relatório usando utilitários
    console.log('\n8️⃣ Gerando relatório detalhado...');
    const todasContasAtualizadas = database.getAllContas();
    const relatorio = gerarRelatorio(todasContasAtualizadas);
    console.log(`   📊 Relatório:`);
    console.log(`      Total: ${relatorio.total} contas`);
    console.log(`      Pendentes: ${relatorio.pendentes}`);
    console.log(`      Pagas: ${relatorio.pagas}`);
    console.log(`      Vencidas: ${relatorio.vencidas}`);
    console.log(`      Valor total: ${formatCurrency(relatorio.valorTotal)}`);
    console.log(`      Valor pendente: ${formatCurrency(relatorio.valorPendente)}`);
    console.log(`      Valor pago: ${formatCurrency(relatorio.valorPago)}`);

    console.log('\n🎉 Todos os testes concluídos com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
  } finally {
    // Fechar conexão com o banco
    database.close();
  }
}

// Executar testes se o arquivo for executado diretamente
if (require.main === module) {
  testarBancoDeDados();
}

export { testarBancoDeDados }; 