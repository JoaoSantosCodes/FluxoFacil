const Database = require('better-sqlite3');
const path = require('path');

// Conectar ao banco de dados
const dbPath = path.join(__dirname, 'contas.db');
const db = new Database(dbPath);

console.log('🌱 Iniciando seed dos recebidos...');

// Dados de exemplo para recebidos
const recebidosExemplo = [
  {
    descricao: 'Salário Janeiro 2024',
    valor: 3500.00,
    data_recebimento: '2024-01-05',
    categoria: 'Salário',
    fonte: 'Empresa ABC',
    status: 'RECEBIDO',
    observacoes: 'Salário mensal'
  },
  {
    descricao: 'Freelance Website',
    valor: 800.00,
    data_recebimento: '2024-01-15',
    categoria: 'Freelance',
    fonte: 'Cliente XYZ',
    status: 'RECEBIDO',
    observacoes: 'Desenvolvimento de website'
  },
  {
    descricao: 'Dividendos Investimentos',
    valor: 150.00,
    data_recebimento: '2024-01-20',
    categoria: 'Investimentos',
    fonte: 'Corretora',
    status: 'RECEBIDO',
    observacoes: 'Dividendos mensais'
  },
  {
    descricao: 'Aluguel Sala Comercial',
    valor: 1200.00,
    data_recebimento: '2024-01-03',
    categoria: 'Aluguel',
    fonte: 'Inquilino',
    status: 'RECEBIDO',
    observacoes: 'Aluguel da sala comercial'
  },
  {
    descricao: 'Consultoria Marketing',
    valor: 500.00,
    data_recebimento: '2024-01-25',
    categoria: 'Consultoria',
    fonte: 'Empresa DEF',
    status: 'PENDENTE',
    observacoes: 'Serviços de consultoria'
  },
  {
    descricao: 'Venda Produtos Online',
    valor: 300.00,
    data_recebimento: '2024-01-10',
    categoria: 'Vendas',
    fonte: 'E-commerce',
    status: 'RECEBIDO',
    observacoes: 'Vendas do mês'
  },
  {
    descricao: 'Reembolso Despesas',
    valor: 250.00,
    data_recebimento: '2024-01-18',
    categoria: 'Reembolso',
    fonte: 'Empresa ABC',
    status: 'RECEBIDO',
    observacoes: 'Reembolso de despesas de trabalho'
  },
  {
    descricao: 'Aulas Particulares',
    valor: 400.00,
    data_recebimento: '2024-01-30',
    categoria: 'Educação',
    fonte: 'Alunos',
    status: 'PENDENTE',
    observacoes: 'Aulas de programação'
  }
];

try {
  // Inserir recebidos de exemplo
  const insertStmt = db.prepare(`
    INSERT INTO recebidos (descricao, valor, data_recebimento, categoria, fonte, status, observacoes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  let inseridos = 0;
  recebidosExemplo.forEach(recebido => {
    try {
      insertStmt.run(
        recebido.descricao,
        recebido.valor,
        recebido.data_recebimento,
        recebido.categoria,
        recebido.fonte,
        recebido.status,
        recebido.observacoes
      );
      inseridos++;
      console.log(`✅ Recebido inserido: ${recebido.descricao} - R$ ${recebido.valor.toFixed(2)}`);
    } catch (error) {
      console.error(`❌ Erro ao inserir recebido ${recebido.descricao}:`, error.message);
    }
  });

  console.log(`\n🎉 Seed concluído! ${inseridos} recebidos inseridos com sucesso.`);

  // Verificar dados inseridos
  const recebidos = db.prepare('SELECT * FROM recebidos ORDER BY data_recebimento DESC').all();
  console.log(`\n📊 Total de recebidos no banco: ${recebidos.length}`);

  // Estatísticas
  const stats = db.prepare(`
    SELECT 
      COUNT(*) as total,
      COUNT(CASE WHEN status = 'RECEBIDO' THEN 1 END) as recebidos,
      COUNT(CASE WHEN status = 'PENDENTE' THEN 1 END) as pendentes,
      COUNT(CASE WHEN status = 'ATRASADO' THEN 1 END) as atrasados,
      SUM(valor) as valor_total,
      SUM(CASE WHEN status = 'RECEBIDO' THEN valor ELSE 0 END) as valor_recebido,
      SUM(CASE WHEN status = 'PENDENTE' THEN valor ELSE 0 END) as valor_pendente
    FROM recebidos
  `).get();

  console.log('\n📈 Estatísticas dos Recebidos:');
  console.log(`   Total: ${stats.total}`);
  console.log(`   Recebidos: ${stats.recebidos}`);
  console.log(`   Pendentes: ${stats.pendentes}`);
  console.log(`   Atrasados: ${stats.atrasados}`);
  console.log(`   Valor Total: R$ ${stats.valor_total?.toFixed(2) || '0.00'}`);
  console.log(`   Valor Recebido: R$ ${stats.valor_recebido?.toFixed(2) || '0.00'}`);
  console.log(`   Valor Pendente: R$ ${stats.valor_pendente?.toFixed(2) || '0.00'}`);

} catch (error) {
  console.error('❌ Erro durante o seed:', error);
} finally {
  db.close();
  console.log('\n🔒 Conexão com o banco fechada.');
} 