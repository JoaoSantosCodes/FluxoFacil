import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, CheckCircle, AlertTriangle, Clock, Calendar, Users, Target, BarChart3, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Conta {
  id: number;
  status: 'PENDENTE' | 'PAGO' | 'VENCIDO';
  fornecedor: string;
  valor: number;
  data_vencimento: string;
  parcelas: number;
}

interface Recebido {
  id: number;
  descricao: string;
  valor: number;
  data_recebimento: string;
  categoria: string;
  fonte: string;
  status: 'RECEBIDO' | 'PENDENTE' | 'ATRASADO';
}

const DashboardTab: React.FC = () => {
  const [contas, setContas] = useState<Conta[]>([]);
  const [recebidos, setRecebidos] = useState<Recebido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showAlertDetails, setShowAlertDetails] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetch('/contas').then(res => {
        if (!res.ok) throw new Error('Erro ao buscar contas');
        return res.json();
      }),
      fetch('/recebidos').then(res => {
        if (!res.ok) throw new Error('Erro ao buscar recebidos');
        return res.json();
      })
    ])
      .then(([contasData, recebidosData]) => {
        setContas(contasData);
        setRecebidos(recebidosData);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Carregando dashboard...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="dashboard-error">
        <AlertTriangle size={48} />
        <h3>Erro ao carregar dados</h3>
        <p>{error}</p>
      </div>
    );
  }

  // Cálculos para contas
  const totalContas = contas.length;
  const valorTotalContas = contas.reduce((sum, c) => sum + c.valor, 0);
  
  const contasPendentes = contas.filter(c => c.status === 'PENDENTE');
  const contasPagas = contas.filter(c => c.status === 'PAGO');
  const contasVencidas = contas.filter(c => c.status === 'VENCIDO');
  
  const valorContasPendentes = contasPendentes.reduce((sum, c) => sum + c.valor, 0);
  const valorContasPagas = contasPagas.reduce((sum, c) => sum + c.valor, 0);
  const valorContasVencidas = contasVencidas.reduce((sum, c) => sum + c.valor, 0);

  // Cálculos para recebidos
  const totalRecebidos = recebidos.length;
  const valorTotalRecebidos = recebidos.reduce((sum, r) => sum + r.valor, 0);
  
  const recebidosPendentes = recebidos.filter(r => r.status === 'PENDENTE');
  const recebidosRecebidos = recebidos.filter(r => r.status === 'RECEBIDO');
  const recebidosAtrasados = recebidos.filter(r => r.status === 'ATRASADO');
  
  const valorRecebidosPendentes = recebidosPendentes.reduce((sum, r) => sum + r.valor, 0);
  const valorRecebidosRecebidos = recebidosRecebidos.reduce((sum, r) => sum + r.valor, 0);
  const valorRecebidosAtrasados = recebidosAtrasados.reduce((sum, r) => sum + r.valor, 0);

  // Saldo geral
  const saldoGeral = valorTotalRecebidos - valorTotalContas;

  // Contas que vencem em breve (próximos 7 dias)
  const contasVencemBreve = contas.filter(conta => {
    const dataVencimento = new Date(conta.data_vencimento);
    const hoje = new Date();
    const diffTime = dataVencimento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7 && conta.status !== 'PAGO';
  });

  // Calcular percentuais para gráficos
  const percentualRecebidos = totalRecebidos > 0 ? (recebidosRecebidos.length / totalRecebidos) * 100 : 0;
  const percentualContasPagas = totalContas > 0 ? (contasPagas.length / totalContas) * 100 : 0;

  return (
    <div className="dashboard-container">
      {/* Header do Dashboard */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-title-section">
            <h1 className="dashboard-title">Dashboard Financeiro</h1>
            <p className="dashboard-subtitle">Visão geral completa das suas finanças</p>
          </div>
          <div className="dashboard-controls">
            <div className="period-selector">
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="period-select"
              >
                <option value="week">Esta Semana</option>
                <option value="month">Este Mês</option>
                <option value="quarter">Este Trimestre</option>
                <option value="year">Este Ano</option>
              </select>
            </div>
            <div className="dashboard-stats-overview">
              <div className="overview-item">
                <Calendar size={20} />
                <span>Atualizado hoje</span>
              </div>
              <div className="overview-item">
                <Users size={20} />
                <span>{totalContas + totalRecebidos} registros</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Principais - Visão Geral */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Visão Geral</h2>
          <p className="section-description">Resumo financeiro do período</p>
        </div>
        
        <div className="main-cards-grid">
          {/* Card de Receitas */}
          <div className="main-card income-card">
            <div className="card-header">
              <div className="card-icon-wrapper income">
                <TrendingUp size={24} />
              </div>
              <div className="card-badge success">+{recebidosRecebidos.length}</div>
            </div>
            <div className="card-body">
              <h3 className="card-title">Receitas Totais</h3>
              <div className="card-value income">{valorTotalRecebidos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
              <div className="card-meta">
                <span className="meta-item">
                  <CheckCircle size={14} />
                  {recebidosRecebidos.length} recebidos
                </span>
                <span className="meta-item">
                  <Clock size={14} />
                  {recebidosPendentes.length} pendentes
                </span>
              </div>
              <div className="card-trend positive">
                <ArrowUpRight size={16} />
                <span>+12.5% vs mês anterior</span>
              </div>
            </div>
          </div>

          {/* Card de Despesas */}
          <div className="main-card expense-card">
            <div className="card-header">
              <div className="card-icon-wrapper expense">
                <TrendingDown size={24} />
              </div>
              <div className="card-badge warning">{contasPendentes.length + contasVencidas.length}</div>
            </div>
            <div className="card-body">
              <h3 className="card-title">Despesas Totais</h3>
              <div className="card-value expense">{valorTotalContas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
              <div className="card-meta">
                <span className="meta-item">
                  <Clock size={14} />
                  {contasPendentes.length} pendentes
                </span>
                <span className="meta-item">
                  <AlertTriangle size={14} />
                  {contasVencidas.length} vencidas
                </span>
              </div>
              <div className="card-trend negative">
                <ArrowDownRight size={16} />
                <span>-8.2% vs mês anterior</span>
              </div>
            </div>
          </div>

          {/* Card de Saldo */}
          <div className="main-card balance-card">
            <div className="card-header">
              <div className="card-icon-wrapper balance">
                <DollarSign size={24} />
              </div>
              <div className={`card-badge ${saldoGeral >= 0 ? 'success' : 'danger'}`}>
                {saldoGeral >= 0 ? '+' : ''}
              </div>
            </div>
            <div className="card-body">
              <h3 className="card-title">Saldo Geral</h3>
              <div className={`card-value ${saldoGeral >= 0 ? 'positive' : 'negative'}`}>
                {saldoGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
              <div className="card-meta">
                <span className="meta-item">
                  <Target size={14} />
                  Receitas - Despesas
                </span>
              </div>
              <div className="card-trend positive">
                <ArrowUpRight size={16} />
                <span>+15.3% vs mês anterior</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Contas */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Contas a Pagar</h2>
          <p className="section-description">Status das suas contas e obrigações</p>
        </div>
        
        <div className="secondary-cards-grid">
          <div className="secondary-card pending-card">
            <div className="card-icon-wrapper pending">
              <Clock size={20} />
            </div>
            <div className="card-content">
              <h4 className="card-title">Pendentes</h4>
              <div className="card-value">{valorContasPendentes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
              <div className="card-count">{contasPendentes.length} contas</div>
            </div>
            <div className="card-progress">
              <div className="progress-bar">
                <div className="progress-fill pending" style={{ width: `${(contasPendentes.length / totalContas) * 100}%` }}></div>
              </div>
            </div>
          </div>

          <div className="secondary-card paid-card">
            <div className="card-icon-wrapper paid">
              <CheckCircle size={20} />
            </div>
            <div className="card-content">
              <h4 className="card-title">Pagas</h4>
              <div className="card-value">{valorContasPagas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
              <div className="card-count">{contasPagas.length} contas</div>
            </div>
            <div className="card-progress">
              <div className="progress-bar">
                <div className="progress-fill paid" style={{ width: `${(contasPagas.length / totalContas) * 100}%` }}></div>
              </div>
            </div>
          </div>

          <div className="secondary-card overdue-card">
            <div className="card-icon-wrapper overdue">
              <AlertTriangle size={20} />
            </div>
            <div className="card-content">
              <h4 className="card-title">Vencidas</h4>
              <div className="card-value">{valorContasVencidas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
              <div className="card-count">{contasVencidas.length} contas</div>
            </div>
            <div className="card-progress">
              <div className="progress-bar">
                <div className="progress-fill overdue" style={{ width: `${(contasVencidas.length / totalContas) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Alertas de Contas */}
        {contasVencemBreve.length > 0 && (
          <div className="alert-section">
            <div className="alert-card warning">
              <div className="alert-icon">
                <Clock size={20} />
              </div>
              <div className="alert-content">
                <h4>Contas vencem em breve</h4>
                <p>{contasVencemBreve.length} conta(s) vence(m) nos próximos 7 dias</p>
                
                {showAlertDetails && (
                  <div className="alert-details">
                    <div className="details-list">
                      {contasVencemBreve.slice(0, 5).map((conta, index) => {
                        const dataVencimento = new Date(conta.data_vencimento);
                        const hoje = new Date();
                        const diffTime = dataVencimento.getTime() - hoje.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        
                        return (
                          <div key={conta.id} className="detail-item">
                            <div className="detail-info">
                              <span className="detail-fornecedor">{conta.fornecedor}</span>
                              <span className="detail-value">
                                {conta.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </span>
                            </div>
                            <div className="detail-meta">
                              <span className="detail-days">
                                {diffDays === 0 ? 'Vence hoje' : `Vence em ${diffDays} dia${diffDays > 1 ? 's' : ''}`}
                              </span>
                              {conta.parcelas > 1 && (
                                <span className="detail-parcelas">Parcela {conta.parcelas}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {contasVencemBreve.length > 5 && (
                        <div className="detail-more">
                          <span>... e mais {contasVencemBreve.length - 5} conta(s)</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <button 
                className="alert-action"
                onClick={() => setShowAlertDetails(!showAlertDetails)}
              >
                <Eye size={16} />
                {showAlertDetails ? 'Mostrar menos' : 'Ver detalhes'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Seção de Recebidos */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Recebimentos</h2>
          <p className="section-description">Status dos seus recebimentos</p>
        </div>
        
        <div className="secondary-cards-grid">
          <div className="secondary-card pending-card">
            <div className="card-icon-wrapper pending">
              <Clock size={20} />
            </div>
            <div className="card-content">
              <h4 className="card-title">Pendentes</h4>
              <div className="card-value">{valorRecebidosPendentes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
              <div className="card-count">{recebidosPendentes.length} recebimentos</div>
            </div>
            <div className="card-progress">
              <div className="progress-bar">
                <div className="progress-fill pending" style={{ width: `${(recebidosPendentes.length / totalRecebidos) * 100}%` }}></div>
              </div>
            </div>
          </div>

          <div className="secondary-card received-card">
            <div className="card-icon-wrapper received">
              <DollarSign size={20} />
            </div>
            <div className="card-content">
              <h4 className="card-title">Recebidos</h4>
              <div className="card-value">{valorRecebidosRecebidos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
              <div className="card-count">{recebidosRecebidos.length} recebimentos</div>
            </div>
            <div className="card-progress">
              <div className="progress-bar">
                <div className="progress-fill received" style={{ width: `${(recebidosRecebidos.length / totalRecebidos) * 100}%` }}></div>
              </div>
            </div>
          </div>

          <div className="secondary-card overdue-card">
            <div className="card-icon-wrapper overdue">
              <AlertTriangle size={20} />
            </div>
            <div className="card-content">
              <h4 className="card-title">Atrasados</h4>
              <div className="card-value">{valorRecebidosAtrasados.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
              <div className="card-count">{recebidosAtrasados.length} recebimentos</div>
            </div>
            <div className="card-progress">
              <div className="progress-bar">
                <div className="progress-fill overdue" style={{ width: `${(recebidosAtrasados.length / totalRecebidos) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Estatísticas Rápidas */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Estatísticas Rápidas</h2>
          <p className="section-description">Métricas importantes do seu fluxo financeiro</p>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <BarChart3 size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{totalContas + totalRecebidos}</div>
              <div className="stat-label">Total de Registros</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Target size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{percentualRecebidos.toFixed(1)}%</div>
              <div className="stat-label">Taxa de Recebimento</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <CheckCircle size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{percentualContasPagas.toFixed(1)}%</div>
              <div className="stat-label">Taxa de Pagamento</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Calendar size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{contasVencemBreve.length}</div>
              <div className="stat-label">Vencem em 7 dias</div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Gráficos Visuais */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Análise Visual</h2>
          <p className="section-description">Gráficos e métricas visuais</p>
        </div>
        
        <div className="charts-grid">
          <div className="chart-card">
            <h4 className="chart-title">Distribuição de Contas</h4>
            <div className="chart-container">
              <div className="pie-chart">
                {/* Removendo os labels sobrepostos para melhorar legibilidade */}
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color paid"></div>
                  <span>Pagas ({contasPagas.length})</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color pending"></div>
                  <span>Pendentes ({contasPendentes.length})</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color overdue"></div>
                  <span>Vencidas ({contasVencidas.length})</span>
                </div>
              </div>
            </div>
          </div>

          <div className="chart-card">
            <h4 className="chart-title">Fluxo de Caixa</h4>
            <div className="flow-chart">
              <div className="flow-item income">
                <div className="flow-icon">
                  <TrendingUp size={16} />
                </div>
                <div className="flow-content">
                  <div className="flow-value">{valorTotalRecebidos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                  <div className="flow-label">Receitas</div>
                </div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-item balance">
                <div className="flow-icon">
                  <DollarSign size={16} />
                </div>
                <div className="flow-content">
                  <div className="flow-value">{saldoGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                  <div className="flow-label">Saldo</div>
                </div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-item expense">
                <div className="flow-icon">
                  <TrendingDown size={16} />
                </div>
                <div className="flow-content">
                  <div className="flow-value">{valorTotalContas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                  <div className="flow-label">Despesas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab; 