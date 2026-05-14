import { useState, useEffect, useCallback } from 'react';
import type { Player } from './types';
import { loadPlayers } from './store';
import KaderPage from './pages/KaderPage';
import BottomNav from './components/BottomNav';
import './index.css';

export default function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('kader');

  const refresh = useCallback(async () => {
    const data = await loadPlayers();
    setPlayers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="max-w-lg mx-auto bg-surface min-h-screen relative">
      {activeTab === 'kader' && (
        <KaderPage players={players} loading={loading} onRefresh={refresh} />
      )}
      {activeTab !== 'kader' && (
        <div className="flex items-center justify-center h-screen text-text-secondary">
          <p className="text-lg">Kommt bald...</p>
        </div>
      )}
      <BottomNav active={activeTab} onNavigate={setActiveTab} />
    </div>
  );
}
