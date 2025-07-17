import React from 'react';
import { useContas } from '../contexts/ContasContext';
import { useRecebidos } from '../contexts/RecebidosContext';

interface ConnectionStatusProps {
  className?: string;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ className = '' }) => {
  const { loading: loadingContas, error: errorContas, lastSync: lastSyncContas } = useContas();
  const { loading: loadingRecebidos, error: errorRecebidos, lastSync: lastSyncRecebidos } = useRecebidos();

  const isLoading = loadingContas || loadingRecebidos;
  const hasError = !!errorContas || !!errorRecebidos;
  const lastSync = lastSyncContas && lastSyncRecebidos
    ? new Date(Math.max(lastSyncContas.getTime(), lastSyncRecebidos.getTime()))
    : lastSyncContas || lastSyncRecebidos;

  let status = 'online';
  let color = 'bg-green-500';
  let text = 'Online';

  if (isLoading) {
    status = 'sync';
    color = 'bg-yellow-400';
    text = 'Sincronizando...';
  } else if (hasError) {
    status = 'offline';
    color = 'bg-red-500';
    text = 'Offline';
  }

  // Se nunca sincronizou, mostrar como offline
  if (!lastSync) {
    status = 'offline';
    color = 'bg-gray-400';
    text = 'Offline';
  }

  return (
    <div className={`flex items-center gap-2 text-sm font-medium ${className}`} title={text}>
      <span className={`w-2 h-2 rounded-full ${color} inline-block`}></span>
      <span>{text}</span>
    </div>
  );
};

export default ConnectionStatus; 