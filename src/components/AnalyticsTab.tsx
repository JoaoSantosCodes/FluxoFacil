import React from 'react';
import { PieChart } from 'lucide-react';

const AnalyticsTab: React.FC = () => (
  <div className="dashboard-content">
    <div className="financial-summary">
      <div className="summary-header">
        <div className="summary-title">
          <PieChart className="summary-icon" size={32} />
          <h2>Análises</h2>
        </div>
        <div className="summary-subtitle">
          Painel de análises e gráficos financeiros
        </div>
      </div>
      <div className="summary-cards">
        <div className="summary-card balance">
          <div className="card-icon card-icon--balance"><PieChart size={28} /></div>
          <div className="card-content">
            <h3>Em breve</h3>
            <span className="card-value">Gráficos e insights financeiros</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
export default AnalyticsTab; 