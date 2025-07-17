import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX, IconHome, IconCreditCard, IconChartPie, IconSettings, IconPlus } from '@tabler/icons-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onAddTransaction: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  activeTab,
  onNavigate,
  onAddTransaction
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.3 }}
          className="mobile-menu-overlay"
        >
          <div className="mobile-menu-content">
            <div className="mobile-menu-header">
              <h3 className="mobile-menu-title">Menu</h3>
              <button 
                className="mobile-menu-close"
                onClick={onClose}
              >
                <IconX size={24} />
              </button>
            </div>
            <nav className="mobile-menu-nav">
              <button
                onClick={() => {
                  onNavigate('dashboard');
                  onClose();
                }}
                className={`mobile-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              >
                <div className="mobile-menu-icon">
                  <IconHome size={24} />
                </div>
                <span className="mobile-menu-label">Dashboard</span>
              </button>
              
              <button
                onClick={() => {
                  onNavigate('transactions');
                  onClose();
                }}
                className={`mobile-menu-item ${activeTab === 'transactions' ? 'active' : ''}`}
              >
                <div className="mobile-menu-icon">
                  <IconCreditCard size={24} />
                </div>
                <span className="mobile-menu-label">Transações</span>
              </button>
              
              <button
                onClick={() => {
                  onNavigate('analytics');
                  onClose();
                }}
                className={`mobile-menu-item ${activeTab === 'analytics' ? 'active' : ''}`}
              >
                <div className="mobile-menu-icon">
                  <IconChartPie size={24} />
                </div>
                <span className="mobile-menu-label">Análises</span>
              </button>
              
              <button
                onClick={() => {
                  onNavigate('settings');
                  onClose();
                }}
                className={`mobile-menu-item ${activeTab === 'settings' ? 'active' : ''}`}
              >
                <div className="mobile-menu-icon">
                  <IconSettings size={24} />
                </div>
                <span className="mobile-menu-label">Configurações</span>
              </button>
              
              <button
                onClick={() => {
                  onAddTransaction();
                  onClose();
                }}
                className="mobile-menu-item"
              >
                <div className="mobile-menu-icon">
                  <IconPlus size={24} />
                </div>
                <span className="mobile-menu-label">Nova Transação</span>
              </button>
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu; 