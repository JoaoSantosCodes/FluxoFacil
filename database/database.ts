import Database from 'better-sqlite3';
import path from 'path';

// Interface para a tabela de contas
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

// Interface para a tabela de recebidos
export interface Recebido {
  id?: number;
  descricao: string;
  valor: number;
  data_recebimento: string; // formato: YYYY-MM-DD
  categoria: string;
  fonte: string; // Ex: Salário, Freelance, Investimentos, etc.
  status: 'RECEBIDO' | 'PENDENTE' | 'ATRASADO';
  observacoes?: string;
  data_criacao?: string;
  data_atualizacao?: string;
}

class DatabaseManager {
  private db: Database.Database;

  constructor() {
    const dbPath = path.join(__dirname, 'contas.db');
    this.db = new Database(dbPath);
    this.initDatabase();
  }

  private initDatabase() {
    // Criar tabela de contas
    this.db.exec(`
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
    `);

    // Criar tabela de recebidos
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS recebidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        descricao TEXT NOT NULL,
        valor REAL NOT NULL,
        data_recebimento TEXT NOT NULL,
        categoria TEXT NOT NULL,
        fonte TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('RECEBIDO', 'PENDENTE', 'ATRASADO')) DEFAULT 'PENDENTE',
        observacoes TEXT,
        data_criacao TEXT DEFAULT (datetime('now', 'localtime')),
        data_atualizacao TEXT DEFAULT (datetime('now', 'localtime'))
      )
    `);

    // Criar índices para melhor performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_contas_status ON contas(status);
      CREATE INDEX IF NOT EXISTS idx_contas_fornecedor ON contas(fornecedor);
      CREATE INDEX IF NOT EXISTS idx_contas_data_vencimento ON contas(data_vencimento);
      CREATE INDEX IF NOT EXISTS idx_contas_data_criacao ON contas(data_criacao);
      
      CREATE INDEX IF NOT EXISTS idx_recebidos_status ON recebidos(status);
      CREATE INDEX IF NOT EXISTS idx_recebidos_fonte ON recebidos(fonte);
      CREATE INDEX IF NOT EXISTS idx_recebidos_categoria ON recebidos(categoria);
      CREATE INDEX IF NOT EXISTS idx_recebidos_data_recebimento ON recebidos(data_recebimento);
      CREATE INDEX IF NOT EXISTS idx_recebidos_data_criacao ON recebidos(data_criacao);
    `);

    console.log('✅ Banco de dados inicializado com sucesso!');
  }

  // Inserir nova conta
  insertConta(conta: Omit<Conta, 'id' | 'data_criacao' | 'data_atualizacao'>): number {
    const stmt = this.db.prepare(`
      INSERT INTO contas (status, fornecedor, valor, data_vencimento, parcelas)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      conta.status,
      conta.fornecedor,
      conta.valor,
      conta.data_vencimento,
      conta.parcelas
    );
    
    return result.lastInsertRowid as number;
  }

  // Buscar todas as contas
  getAllContas(): Conta[] {
    const stmt = this.db.prepare(`
      SELECT * FROM contas 
      ORDER BY data_vencimento ASC
    `);
    
    return stmt.all() as Conta[];
  }

  // Buscar contas por status
  getContasByStatus(status: Conta['status']): Conta[] {
    const stmt = this.db.prepare(`
      SELECT * FROM contas 
      WHERE status = ? 
      ORDER BY data_vencimento ASC
    `);
    
    return stmt.all(status) as Conta[];
  }

  // Buscar contas por fornecedor
  getContasByFornecedor(fornecedor: string): Conta[] {
    const stmt = this.db.prepare(`
      SELECT * FROM contas 
      WHERE fornecedor LIKE ? 
      ORDER BY data_vencimento ASC
    `);
    
    return stmt.all(`%${fornecedor}%`) as Conta[];
  }

  // Buscar contas vencidas
  getContasVencidas(): Conta[] {
    const stmt = this.db.prepare(`
      SELECT * FROM contas 
      WHERE data_vencimento < date('now') AND status != 'PAGO'
      ORDER BY data_vencimento ASC
    `);
    
    return stmt.all() as Conta[];
  }

  // Buscar contas do mês atual
  getContasMesAtual(): Conta[] {
    const stmt = this.db.prepare(`
      SELECT * FROM contas 
      WHERE strftime('%Y-%m', data_vencimento) = strftime('%Y-%m', 'now')
      ORDER BY data_vencimento ASC
    `);
    
    return stmt.all() as Conta[];
  }

  // Atualizar conta
  updateConta(id: number, conta: Partial<Omit<Conta, 'id' | 'data_criacao'>>): boolean {
    const fields = [];
    const values = [];
    
    if (conta.status !== undefined) {
      fields.push('status = ?');
      values.push(conta.status);
    }
    if (conta.fornecedor !== undefined) {
      fields.push('fornecedor = ?');
      values.push(conta.fornecedor);
    }
    if (conta.valor !== undefined) {
      fields.push('valor = ?');
      values.push(conta.valor);
    }
    if (conta.data_vencimento !== undefined) {
      fields.push('data_vencimento = ?');
      values.push(conta.data_vencimento);
    }
    if (conta.parcelas !== undefined) {
      fields.push('parcelas = ?');
      values.push(conta.parcelas);
    }
    
    fields.push('data_atualizacao = datetime("now", "localtime")');
    values.push(id);
    
    const stmt = this.db.prepare(`
      UPDATE contas 
      SET ${fields.join(', ')}
      WHERE id = ?
    `);
    
    const result = stmt.run(...values);
    return result.changes > 0;
  }

  // Deletar conta
  deleteConta(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM contas WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Buscar conta por ID
  getContaById(id: number): Conta | null {
    const stmt = this.db.prepare('SELECT * FROM contas WHERE id = ?');
    const conta = stmt.get(id) as Conta | undefined;
    return conta || null;
  }

  // Estatísticas gerais
  getEstatisticas() {
    const totalContas = this.db.prepare('SELECT COUNT(*) as total FROM contas').get() as { total: number };
    const contasPendentes = this.db.prepare('SELECT COUNT(*) as total FROM contas WHERE status = "PENDENTE"').get() as { total: number };
    const contasPagas = this.db.prepare('SELECT COUNT(*) as total FROM contas WHERE status = "PAGO"').get() as { total: number };
    const contasVencidas = this.db.prepare('SELECT COUNT(*) as total FROM contas WHERE status = "VENCIDO"').get() as { total: number };
    const valorTotal = this.db.prepare('SELECT SUM(valor) as total FROM contas WHERE status != "PAGO"').get() as { total: number };
    const valorPago = this.db.prepare('SELECT SUM(valor) as total FROM contas WHERE status = "PAGO"').get() as { total: number };

    return {
      totalContas: totalContas.total,
      contasPendentes: contasPendentes.total,
      contasPagas: contasPagas.total,
      contasVencidas: contasVencidas.total,
      valorTotal: valorTotal.total || 0,
      valorPago: valorPago.total || 0
    };
  }

  // ===== MÉTODOS PARA RECEBIDOS =====

  // Inserir novo recebido
  insertRecebido(recebido: Omit<Recebido, 'id' | 'data_criacao' | 'data_atualizacao'>): number {
    const stmt = this.db.prepare(`
      INSERT INTO recebidos (descricao, valor, data_recebimento, categoria, fonte, status, observacoes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      recebido.descricao,
      recebido.valor,
      recebido.data_recebimento,
      recebido.categoria,
      recebido.fonte,
      recebido.status,
      recebido.observacoes || null
    );
    
    return result.lastInsertRowid as number;
  }

  // Buscar todos os recebidos
  getAllRecebidos(): Recebido[] {
    const stmt = this.db.prepare(`
      SELECT * FROM recebidos 
      ORDER BY data_recebimento DESC
    `);
    
    return stmt.all() as Recebido[];
  }

  // Buscar recebidos por status
  getRecebidosByStatus(status: Recebido['status']): Recebido[] {
    const stmt = this.db.prepare(`
      SELECT * FROM recebidos 
      WHERE status = ? 
      ORDER BY data_recebimento DESC
    `);
    
    return stmt.all(status) as Recebido[];
  }

  // Buscar recebidos por fonte
  getRecebidosByFonte(fonte: string): Recebido[] {
    const stmt = this.db.prepare(`
      SELECT * FROM recebidos 
      WHERE fonte LIKE ? 
      ORDER BY data_recebimento DESC
    `);
    
    return stmt.all(`%${fonte}%`) as Recebido[];
  }

  // Buscar recebidos por categoria
  getRecebidosByCategoria(categoria: string): Recebido[] {
    const stmt = this.db.prepare(`
      SELECT * FROM recebidos 
      WHERE categoria LIKE ? 
      ORDER BY data_recebimento DESC
    `);
    
    return stmt.all(`%${categoria}%`) as Recebido[];
  }

  // Buscar recebidos do mês atual
  getRecebidosMesAtual(): Recebido[] {
    const stmt = this.db.prepare(`
      SELECT * FROM recebidos 
      WHERE strftime('%Y-%m', data_recebimento) = strftime('%Y-%m', 'now')
      ORDER BY data_recebimento DESC
    `);
    
    return stmt.all() as Recebido[];
  }

  // Atualizar recebido
  updateRecebido(id: number, recebido: Partial<Omit<Recebido, 'id' | 'data_criacao'>>): boolean {
    const fields = [];
    const values = [];
    
    if (recebido.descricao !== undefined) {
      fields.push('descricao = ?');
      values.push(recebido.descricao);
    }
    if (recebido.valor !== undefined) {
      fields.push('valor = ?');
      values.push(recebido.valor);
    }
    if (recebido.data_recebimento !== undefined) {
      fields.push('data_recebimento = ?');
      values.push(recebido.data_recebimento);
    }
    if (recebido.categoria !== undefined) {
      fields.push('categoria = ?');
      values.push(recebido.categoria);
    }
    if (recebido.fonte !== undefined) {
      fields.push('fonte = ?');
      values.push(recebido.fonte);
    }
    if (recebido.status !== undefined) {
      fields.push('status = ?');
      values.push(recebido.status);
    }
    if (recebido.observacoes !== undefined) {
      fields.push('observacoes = ?');
      values.push(recebido.observacoes);
    }
    
    fields.push('data_atualizacao = datetime("now", "localtime")');
    values.push(id);
    
    const stmt = this.db.prepare(`
      UPDATE recebidos 
      SET ${fields.join(', ')}
      WHERE id = ?
    `);
    
    const result = stmt.run(...values);
    return result.changes > 0;
  }

  // Deletar recebido
  deleteRecebido(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM recebidos WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Buscar recebido por ID
  getRecebidoById(id: number): Recebido | null {
    const stmt = this.db.prepare('SELECT * FROM recebidos WHERE id = ?');
    const recebido = stmt.get(id) as Recebido | undefined;
    return recebido || null;
  }

  // Estatísticas dos recebidos
  getEstatisticasRecebidos() {
    const totalRecebidos = this.db.prepare('SELECT COUNT(*) as total FROM recebidos').get() as { total: number };
    const recebidosRecebidos = this.db.prepare('SELECT COUNT(*) as total FROM recebidos WHERE status = "RECEBIDO"').get() as { total: number };
    const recebidosPendentes = this.db.prepare('SELECT COUNT(*) as total FROM recebidos WHERE status = "PENDENTE"').get() as { total: number };
    const recebidosAtrasados = this.db.prepare('SELECT COUNT(*) as total FROM recebidos WHERE status = "ATRASADO"').get() as { total: number };
    const valorTotal = this.db.prepare('SELECT SUM(valor) as total FROM recebidos').get() as { total: number };
    const valorRecebido = this.db.prepare('SELECT SUM(valor) as total FROM recebidos WHERE status = "RECEBIDO"').get() as { total: number };
    const valorPendente = this.db.prepare('SELECT SUM(valor) as total FROM recebidos WHERE status = "PENDENTE"').get() as { total: number };

    return {
      totalRecebidos: totalRecebidos.total,
      recebidosRecebidos: recebidosRecebidos.total,
      recebidosPendentes: recebidosPendentes.total,
      recebidosAtrasados: recebidosAtrasados.total,
      valorTotal: valorTotal.total || 0,
      valorRecebido: valorRecebido.total || 0,
      valorPendente: valorPendente.total || 0
    };
  }

  // Fechar conexão
  close() {
    this.db.close();
  }
}

// Instância singleton
const database = new DatabaseManager();

export default database; 