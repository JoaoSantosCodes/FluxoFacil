const Database = require('better-sqlite3');
const path = require('path');

// Conectar ao banco
const dbPath = path.join(__dirname, 'contas.db');
const db = new Database(dbPath);

// Garantir que a tabela existe
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS contas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status TEXT NOT NULL CHECK(status IN ('PENDENTE', 'PAGO', 'VENCIDO')) DEFAULT 'PENDENTE',
    fornecedor TEXT NOT NULL,
    valor REAL NOT NULL,
    data_vencimento TEXT NOT NULL,
    parcelas INTEGER NOT NULL DEFAULT 1,
    data_criacao TEXT DEFAULT (datetime('now', 'localtime')),
    data_atualizacao TEXT DEFAULT (datetime('now', 'localtime'))
  )
`;
db.exec(createTableSQL);

const dadosTeste = [
  {
    status: 'VENCIDO', // ATRASADO = VENCIDO no nosso sistema
    fornecedor: 'ENEL',
    valor: 186.40,
    data_vencimento: '2025-06-28',
    parcelas: 1
  },
  {
    status: 'PENDENTE',
    fornecedor: 'ENEL',
    valor: 162.02,
    data_vencimento: '2025-07-28',
    parcelas: 1
  },
  {
    status: 'PENDENTE',
    fornecedor: 'CONNECTVY',
    valor: 99.90,
    data_vencimento: '2025-07-20',
    parcelas: 1
  },
  {
    status: 'PENDENTE',
    fornecedor: 'CLARO',
    valor: 67.35,
    data_vencimento: '2025-07-20',
    parcelas: 1
  },
  {
    status: 'PENDENTE',
    fornecedor: 'INTEN',
    valor: 777.22,
    data_vencimento: '2025-07-12',
    parcelas: 1
  },
  {
    status: 'PENDENTE',
    fornecedor: 'NUBANK',
    valor: 154.06,
    data_vencimento: '2025-07-19',
    parcelas: 1
  },
  {
    status: 'PENDENTE',
    fornecedor: 'NUBANK',
    valor: 292.30,
    data_vencimento: '2025-07-16',
    parcelas: 3 // 3/12 parcelas
  },
  {
    status: 'PENDENTE',
    fornecedor: 'MERCADO PAGO',
    valor: 2179.41,
    data_vencimento: '2025-07-21',
    parcelas: 1
  },
  {
    status: 'PENDENTE',
    fornecedor: 'MERCADO PAGO',
    valor: 106.52,
    data_vencimento: '2025-07-21',
    parcelas: 2 // 2/6 parcelas
  },
  {
    status: 'PENDENTE',
    fornecedor: 'MERCADO PAGO',
    valor: 331.84,
    data_vencimento: '2025-07-14',
    parcelas: 1 // 1/6 parcelas
  },
  {
    status: 'PENDENTE',
    fornecedor: 'SANTANDER',
    valor: 20.33,
    data_vencimento: '2025-08-06',
    parcelas: 1
  }
];

function inserirDadosTeste() {
  console.log('🌱 Inserindo dados de teste...\n');

  try {
    // Limpar dados existentes
    console.log('🧹 Limpando dados existentes...');
    const contasExistentes = db.prepare('SELECT * FROM contas').all();
    contasExistentes.forEach(conta => {
      db.prepare('DELETE FROM contas WHERE id = ?').run(conta.id);
    });

    // Inserir novos dados
    console.log('📝 Inserindo contas de teste...\n');
    
    const insertStmt = db.prepare(`
      INSERT INTO contas (status, fornecedor, valor, data_vencimento, parcelas)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    for (const conta of dadosTeste) {
      const result = insertStmt.run(
        conta.status,
        conta.fornecedor,
        conta.valor,
        conta.data_vencimento,
        conta.parcelas
      );
      console.log(`✅ ${conta.fornecedor} - R$ ${conta.valor.toFixed(2)} - ${conta.data_vencimento} (ID: ${result.lastInsertRowid})`);
    }

    // Verificar dados inseridos
    console.log('\n📊 Verificando dados inseridos...');
    const todasContas = db.prepare('SELECT * FROM contas').all();
    console.log(`Total de contas: ${todasContas.length}`);

    // Estatísticas
    const totalContas = db.prepare('SELECT COUNT(*) as total FROM contas').get();
    const contasPendentes = db.prepare("SELECT COUNT(*) as total FROM contas WHERE status = 'PENDENTE'").get();
    const contasVencidas = db.prepare("SELECT COUNT(*) as total FROM contas WHERE status = 'VENCIDO'").get();
    const valorTotal = db.prepare("SELECT SUM(valor) as total FROM contas WHERE status != 'PAGO'").get();

    console.log('\n📈 Estatísticas:');
    console.log(`- Total de contas: ${totalContas.total}`);
    console.log(`- Pendentes: ${contasPendentes.total}`);
    console.log(`- Vencidas: ${contasVencidas.total}`);
    console.log(`- Valor total pendente: R$ ${(valorTotal.total || 0).toFixed(2)}`);

    console.log('\n🎉 Dados de teste inseridos com sucesso!');
    console.log('💡 Agora você pode testar o app com dados reais.');

  } catch (error) {
    console.error('❌ Erro ao inserir dados:', error);
  } finally {
    db.close();
  }
}

inserirDadosTeste(); 