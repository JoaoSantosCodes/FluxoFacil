import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white border-t border-slate-700">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Section - Main Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text text-transparent">
                Fluxo Fácil
              </h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Simplificando a gestão financeira com tecnologia moderna e interface intuitiva.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>Versão 1.0.0</span>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">
              Recursos
            </h4>
            <ul className="space-y-2">
              {['Dashboard', 'Contas a Pagar', 'Recebimentos', 'Transações', 'Relatórios'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-slate-300 hover:text-green-400 transition-colors duration-200 text-sm flex items-center group"
                  >
                    <span className="w-1 h-1 bg-slate-500 rounded-full mr-2 group-hover:bg-green-400 transition-colors"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">
              Suporte
            </h4>
            <ul className="space-y-2">
              {['Central de Ajuda', 'Tutoriais', 'FAQ', 'Contato', 'Feedback'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-slate-300 hover:text-blue-400 transition-colors duration-200 text-sm flex items-center group"
                  >
                    <span className="w-1 h-1 bg-slate-500 rounded-full mr-2 group-hover:bg-blue-400 transition-colors"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">
              Informações
            </h4>
            <ul className="space-y-2">
              {['Sobre Nós', 'Política de Privacidade', 'Termos de Uso', 'Segurança', 'Atualizações'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-slate-300 hover:text-purple-400 transition-colors duration-200 text-sm flex items-center group"
                  >
                    <span className="w-1 h-1 bg-slate-500 rounded-full mr-2 group-hover:bg-purple-400 transition-colors"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Middle Section - Status and Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Status Indicators */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">
              Status do Sistema
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Dados Criptografados</p>
                  <p className="text-xs text-green-400">Ativo</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Backup Automático</p>
                  <p className="text-xs text-blue-400">Ativo</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Sincronização</p>
                  <p className="text-xs text-purple-400">Em tempo real</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">
              Contato
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="w-8 h-8 bg-slate-600/50 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-slate-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Email</p>
                  <p className="text-xs text-slate-300">suporte@fluxofacil.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="w-8 h-8 bg-slate-600/50 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-slate-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Telefone</p>
                  <p className="text-xs text-slate-300">(11) 99999-9999</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="w-8 h-8 bg-slate-600/50 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-slate-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Localização</p>
                  <p className="text-xs text-slate-300">São Paulo, SP - Brasil</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright and Social */}
        <div className="border-t border-slate-700 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <span>© {currentYear} FluxoFácil</span>
              <span className="text-red-400">❤</span>
              <span>no Brasil</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-slate-800/50"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="text-sm font-medium">GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 