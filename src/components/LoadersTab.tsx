import React from 'react';
import { Loader } from 'lucide-react';

const LoadersTab: React.FC = () => (
  <div className="dashboard-content">
    <div className="financial-summary">
      <div className="summary-header">
        <div className="summary-title">
          <Loader className="summary-icon" size={32} />
          <h2>Loaders</h2>
        </div>
        <div className="summary-subtitle">
          Indicadores de carregamento e progresso
        </div>
      </div>
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon card-icon--pending"><Loader size={28} /></div>
          <div className="card-content">
            <h3>Em breve</h3>
            <span className="card-value">Indicadores visuais de loading</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
export default LoadersTab; 