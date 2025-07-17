const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

// Conectar ao banco de dados
const dbPath = path.join(__dirname, 'contas.db');
const db = new Database(dbPath);

// Criar tabela recebidos se não existir
const createRecebidosTableSQL = `
  CREATE TABLE IF NOT EXISTS recebidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descricao TEXT NOT NULL,
    valor REAL NOT NULL,
    data_recebimento TEXT NOT NULL,
    categoria TEXT,
    fonte TEXT,
    status TEXT NOT NULL CHECK(status IN ('RECEBIDO', 'PENDENTE', 'ATRASADO')) DEFAULT 'PENDENTE',
    observacoes TEXT,
    data_criacao TEXT DEFAULT (datetime('now', 'localtime')),
    data_atualizacao TEXT DEFAULT (datetime('now', 'localtime'))
  )
`;
db.exec(createRecebidosTableSQL);

// GET /contas - Listar todas as contas
app.get('/contas', (req, res) => {
  try {
    const contas = db.prepare('SELECT * FROM contas ORDER BY data_vencimento ASC').all();
    res.json(contas);
  } catch (error) {
    console.error('Erro ao buscar contas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /contas/:id - Buscar conta por ID
app.get('/contas/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const conta = db.prepare('SELECT * FROM contas WHERE id = ?').get(id);
    if (!conta) return res.status(404).json({ error: 'Conta não encontrada' });
    res.json(conta);
  } catch (error) {
    console.error('Erro ao buscar conta:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /contas - Criar nova conta
app.post('/contas', (req, res) => {
  try {
    const { status, fornecedor, valor, data_vencimento, parcelas } = req.body;
    if (!fornecedor || !valor || !data_vencimento || !parcelas) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    }
    
    const stmt = db.prepare(`
      INSERT INTO contas (status, fornecedor, valor, data_vencimento, parcelas)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(status || 'PENDENTE', fornecedor, valor, data_vencimento, parcelas);
    const conta = db.prepare('SELECT * FROM contas WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(conta);
  } catch (error) {
    console.error('Erro ao criar conta:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /contas/:id - Atualizar conta
app.put('/contas/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const conta = db.prepare('SELECT * FROM contas WHERE id = ?').get(id);
    if (!conta) return res.status(404).json({ error: 'Conta não encontrada' });
    
    const { status, fornecedor, valor, data_vencimento, parcelas } = req.body;
    const fields = [];
    const values = [];
    
    if (status !== undefined) {
      fields.push('status = ?');
      values.push(status);
    }
    if (fornecedor !== undefined) {
      fields.push('fornecedor = ?');
      values.push(fornecedor);
    }
    if (valor !== undefined) {
      fields.push('valor = ?');
      values.push(valor);
    }
    if (data_vencimento !== undefined) {
      fields.push('data_vencimento = ?');
      values.push(data_vencimento);
    }
    if (parcelas !== undefined) {
      fields.push('parcelas = ?');
      values.push(parcelas);
    }
    
    const stmt = db.prepare(`
      UPDATE contas 
      SET ${fields.join(', ')}, data_atualizacao = datetime('now', 'localtime')
      WHERE id = ?
    `);
    
    const result = stmt.run(...values, id);
    if (result.changes === 0) {
      return res.status(400).json({ error: 'Falha ao atualizar' });
    }
    
    const updatedConta = db.prepare('SELECT * FROM contas WHERE id = ?').get(id);
    res.json(updatedConta);
  } catch (error) {
    console.error('Erro ao atualizar conta:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /contas/:id - Deletar conta
app.delete('/contas/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const conta = db.prepare('SELECT * FROM contas WHERE id = ?').get(id);
    if (!conta) return res.status(404).json({ error: 'Conta não encontrada' });
    
    const stmt = db.prepare('DELETE FROM contas WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
      return res.status(400).json({ error: 'Falha ao deletar' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar conta:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /estatisticas - Estatísticas gerais
app.get('/estatisticas', (req, res) => {
  try {
    const totalContas = db.prepare('SELECT COUNT(*) as total FROM contas').get();
    const contasPendentes = db.prepare('SELECT COUNT(*) as total FROM contas WHERE status = ?').get('PENDENTE');
    const contasPagas = db.prepare('SELECT COUNT(*) as total FROM contas WHERE status = ?').get('PAGO');
    const contasVencidas = db.prepare('SELECT COUNT(*) as total FROM contas WHERE status = ?').get('VENCIDO');
    const valorTotal = db.prepare('SELECT COALESCE(SUM(valor), 0) as total FROM contas WHERE status != ?').get('PAGO');
    const valorPago = db.prepare('SELECT COALESCE(SUM(valor), 0) as total FROM contas WHERE status = ?').get('PAGO');

    const stats = {
      totalContas: totalContas.total,
      contasPendentes: contasPendentes.total,
      contasPagas: contasPagas.total,
      contasVencidas: contasVencidas.total,
      valorTotal: valorTotal.total,
      valorPago: valorPago.total
    };
    
    console.log('📊 Estatísticas:', stats);
    res.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ROTAS RECEBIDOS
// GET /recebidos - Listar todos
app.get('/recebidos', (req, res) => {
  try {
    const recebidos = db.prepare('SELECT * FROM recebidos ORDER BY data_recebimento DESC').all();
    res.json(recebidos);
  } catch (error) {
    console.error('Erro ao buscar recebidos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});
// GET /recebidos/:id
app.get('/recebidos/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const recebido = db.prepare('SELECT * FROM recebidos WHERE id = ?').get(id);
    if (!recebido) return res.status(404).json({ error: 'Recebido não encontrado' });
    res.json(recebido);
  } catch (error) {
    console.error('Erro ao buscar recebido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});
// POST /recebidos
app.post('/recebidos', (req, res) => {
  try {
    const { descricao, valor, data_recebimento, categoria, fonte, status, observacoes } = req.body;
    if (!descricao || !valor || !data_recebimento) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    }
    const stmt = db.prepare(`
      INSERT INTO recebidos (descricao, valor, data_recebimento, categoria, fonte, status, observacoes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(descricao, valor, data_recebimento, categoria, fonte, status || 'PENDENTE', observacoes);
    const recebido = db.prepare('SELECT * FROM recebidos WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(recebido);
  } catch (error) {
    console.error('Erro ao criar recebido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});
// PUT /recebidos/:id
app.put('/recebidos/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const recebido = db.prepare('SELECT * FROM recebidos WHERE id = ?').get(id);
    if (!recebido) return res.status(404).json({ error: 'Recebido não encontrado' });
    const { descricao, valor, data_recebimento, categoria, fonte, status, observacoes } = req.body;
    const fields = [];
    const values = [];
    if (descricao !== undefined) { fields.push('descricao = ?'); values.push(descricao); }
    if (valor !== undefined) { fields.push('valor = ?'); values.push(valor); }
    if (data_recebimento !== undefined) { fields.push('data_recebimento = ?'); values.push(data_recebimento); }
    if (categoria !== undefined) { fields.push('categoria = ?'); values.push(categoria); }
    if (fonte !== undefined) { fields.push('fonte = ?'); values.push(fonte); }
    if (status !== undefined) { fields.push('status = ?'); values.push(status); }
    if (observacoes !== undefined) { fields.push('observacoes = ?'); values.push(observacoes); }
    const stmt = db.prepare(`
      UPDATE recebidos
      SET ${fields.join(', ')}, data_atualizacao = datetime('now', 'localtime')
      WHERE id = ?
    `);
    const result = stmt.run(...values, id);
    if (result.changes === 0) {
      return res.status(400).json({ error: 'Falha ao atualizar' });
    }
    const atualizado = db.prepare('SELECT * FROM recebidos WHERE id = ?').get(id);
    res.json(atualizado);
  } catch (error) {
    console.error('Erro ao atualizar recebido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});
// DELETE /recebidos/:id
app.delete('/recebidos/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const recebido = db.prepare('SELECT * FROM recebidos WHERE id = ?').get(id);
    if (!recebido) return res.status(404).json({ error: 'Recebido não encontrado' });
    const stmt = db.prepare('DELETE FROM recebidos WHERE id = ?');
    const result = stmt.run(id);
    if (result.changes === 0) {
      return res.status(400).json({ error: 'Falha ao deletar' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar recebido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
  console.log(`📊 Banco de dados: ${dbPath}`);
  
  // Testar conexão com banco
  try {
    const test = db.prepare('SELECT COUNT(*) as total FROM contas').get();
    console.log(`✅ Banco conectado - ${test.total} contas encontradas`);
  } catch (error) {
    console.error('❌ Erro ao conectar com banco:', error);
  }
});

// Fechar conexão quando o processo terminar
process.on('SIGINT', () => {
  console.log('\n🛑 Fechando servidor...');
  db.close();
  process.exit(0);
}); 