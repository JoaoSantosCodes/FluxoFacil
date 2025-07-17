import express from 'express';
import cors from 'cors';
import database from './database';

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

// GET /contas - Listar todas as contas
app.get('/contas', (_req, res) => {
  const contas = database.getAllContas();
  res.json(contas);
});

// GET /contas/:id - Buscar conta por ID
app.get('/contas/:id', (req, res) => {
  const id = Number(req.params.id);
  const conta = database.getContaById(id);
  if (!conta) return res.status(404).json({ error: 'Conta não encontrada' });
  res.json(conta);
});

// POST /contas - Criar nova conta
app.post('/contas', (req, res) => {
  const { status, fornecedor, valor, data_vencimento, parcelas } = req.body;
  if (!fornecedor || !valor || !data_vencimento || !parcelas) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }
  const id = database.insertConta({ status, fornecedor, valor, data_vencimento, parcelas });
  const conta = database.getContaById(id);
  res.status(201).json(conta);
});

// PUT /contas/:id - Atualizar conta
app.put('/contas/:id', (req, res) => {
  const id = Number(req.params.id);
  const conta = database.getContaById(id);
  if (!conta) return res.status(404).json({ error: 'Conta não encontrada' });
  const sucesso = database.updateConta(id, req.body);
  if (!sucesso) return res.status(400).json({ error: 'Falha ao atualizar' });
  res.json(database.getContaById(id));
});

// DELETE /contas/:id - Deletar conta
app.delete('/contas/:id', (req, res) => {
  const id = Number(req.params.id);
  const conta = database.getContaById(id);
  if (!conta) return res.status(404).json({ error: 'Conta não encontrada' });
  database.deleteConta(id);
  res.status(204).send();
});

// GET /estatisticas - Estatísticas gerais
app.get('/estatisticas', (_req, res) => {
  const stats = database.getEstatisticas();
  res.json(stats);
});

// ===== ENDPOINTS DE RECEBIDOS =====

// GET /recebidos - Listar todos os recebidos
app.get('/recebidos', (_req, res) => {
  const recebidos = database.getAllRecebidos();
  res.json(recebidos);
});

// GET /recebidos/:id - Buscar recebido por ID
app.get('/recebidos/:id', (req, res) => {
  const id = Number(req.params.id);
  const recebido = database.getRecebidoById(id);
  if (!recebido) return res.status(404).json({ error: 'Recebido não encontrado' });
  res.json(recebido);
});

// POST /recebidos - Criar novo recebido
app.post('/recebidos', (req, res) => {
  const { descricao, valor, data_recebimento, categoria, fonte, status, observacoes } = req.body;
  if (!descricao || !valor || !data_recebimento || !categoria || !fonte) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }
  const id = database.insertRecebido({ descricao, valor, data_recebimento, categoria, fonte, status, observacoes });
  const recebido = database.getRecebidoById(id);
  res.status(201).json(recebido);
});

// PUT /recebidos/:id - Atualizar recebido
app.put('/recebidos/:id', (req, res) => {
  const id = Number(req.params.id);
  const recebido = database.getRecebidoById(id);
  if (!recebido) return res.status(404).json({ error: 'Recebido não encontrado' });
  const sucesso = database.updateRecebido(id, req.body);
  if (!sucesso) return res.status(400).json({ error: 'Falha ao atualizar' });
  res.json(database.getRecebidoById(id));
});

// DELETE /recebidos/:id - Deletar recebido
app.delete('/recebidos/:id', (req, res) => {
  const id = Number(req.params.id);
  const recebido = database.getRecebidoById(id);
  if (!recebido) return res.status(404).json({ error: 'Recebido não encontrado' });
  database.deleteRecebido(id);
  res.status(204).send();
});

// GET /estatisticas-recebidos - Estatísticas dos recebidos
app.get('/estatisticas-recebidos', (_req, res) => {
  const stats = database.getEstatisticasRecebidos();
  res.json(stats);
});

app.listen(PORT, () => {
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
}); 