const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'contas.db');
const db = new Database(dbPath);

console.log('🔍 Testando banco de dados...');

// Verificar se a tabela existe
const tableExists = db.prepare(`
  SELECT name FROM sqlite_master 
  WHERE type='table' AND name='contas'
`).get();

if (tableExists) {
  console.log('✅ Tabela contas existe');
  
  // Contar registros
  const count = db.prepare('SELECT COUNT(*) as total FROM contas').get();
  console.log(`📊 Total de registros: ${count.total}`);
  
  // Listar algumas contas
  const contas = db.prepare('SELECT * FROM contas LIMIT 5').all();
  console.log('📋 Primeiras 5 contas:');
  contas.forEach(conta => {
    console.log(`  - ${conta.fornecedor}: R$ ${conta.valor} (${conta.status})`);
  });
} else {
  console.log('❌ Tabela contas não existe');
}

db.close(); 