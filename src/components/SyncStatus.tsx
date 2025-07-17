import React fromreact';
import { useContas } from../contexts/ContasContext';
import { useRecebidos } from ../contexts/RecebidosContext;

interface SyncStatusProps {
  className?: string;
}

const SyncStatus: React.FC<SyncStatusProps> = ({ className =  }) => {
  const { lastSync: lastSyncContas, loading: loadingContas, error: errorContas } = useContas();
  const { lastSync: lastSyncRecebidos, loading: loadingRecebidos, error: errorRecebidos } = useRecebidos();

  const isLoading = loadingContas || loadingRecebidos;
  const hasError = errorContas || errorRecebidos;
  const lastSync = lastSyncContas && lastSyncRecebidos 
    ? new Date(Math.max(lastSyncContas.getTime(), lastSyncRecebidos.getTime()))
    : lastSyncContas || lastSyncRecebidos;

  const formatLastSync = (date: Date) =>[object Object]   const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (100060
    
    if (diffInMinutes < 1) return Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
    
    const diffInHours = Math.floor(diffInMinutes /60   if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24    return `${diffInDays}d atrás`;
  };

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 text-sm text-gray-500ssName}`}>
        <div className="w-2g-blue-500 rounded-full animate-pulse"></div>
        <span>Sincronizando...</span>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`flex items-center gap-2 text-sm text-red-500ssName}`}>
        <div className="w-2 h-2 bg-red-500ounded-full></div>
        <span>Erro de sincronização</span>
      </div>
    );
  }

  if (!lastSync) {
    return (
      <div className={`flex items-center gap-2 text-sm text-gray-400ssName}`}>
        <div className="w-2g-gray-400ounded-full></div>
        <span>Nunca sincronizado</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 text-sm text-gray-500lassName}`}>
      <div className=w-2-green-500ounded-full"></div>
      <span>Atualizado {formatLastSync(lastSync)}</span>
    </div>
  );
};

export default SyncStatus; 