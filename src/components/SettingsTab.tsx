import React from 'react';
import { Settings } from 'lucide-react';

const SettingsTab: React.FC = () => (
  <div className="dashboard-content">
    <div className="financial-summary">
      <div className="summary-header">
        <div className="summary-title">
          <Settings className="summary-icon" size={32} />
          <h2>Configurações</h2>
        </div>
        <div className="summary-subtitle">
          Gerencie as preferências do sistema
        </div>
      </div>
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon card-icon--paid"><Settings size={28} /></div>
          <div className="card-content">
            <h3>Em breve</h3>
            <span className="card-value">Configurações avançadas do app</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
export default SettingsTab; 