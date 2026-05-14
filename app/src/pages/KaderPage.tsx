import { useState, useMemo } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import type { Player, PositionGroup } from '../types';
import { positionToGroup, positionGroupOrder } from '../types';
import { addPlayer, updatePlayer, deletePlayer } from '../store';
import PlayerCard from '../components/PlayerCard';
import AddPlayerModal from '../components/AddPlayerModal';
import PlayerDetail from '../components/PlayerDetail';

type Filter = 'alle' | 'fit' | 'raus';

interface KaderPageProps {
  players: Player[];
  loading: boolean;
  onRefresh: () => Promise<void>;
}

export default function KaderPage({ players, loading, onRefresh }: KaderPageProps) {
  const [filter, setFilter] = useState<Filter>('alle');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editPlayer, setEditPlayer] = useState<Player | null>(null);
  const [detailPlayer, setDetailPlayer] = useState<Player | null>(null);

  const fitCount = players.filter(p => p.status === 'fit').length;
  const injuredCount = players.filter(p => p.status === 'verletzt').length;

  const filtered = useMemo(() => {
    let list = players;
    if (filter === 'fit') list = list.filter(p => p.status === 'fit');
    if (filter === 'raus') list = list.filter(p => p.status === 'verletzt');
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.position.toLowerCase().includes(q) ||
        p.number.toString() === q
      );
    }
    return list;
  }, [players, filter, search]);

  const grouped = useMemo(() => {
    const groups: Record<PositionGroup, Player[]> = {
      TOR: [], ABWEHR: [], MITTELFELD: [], STURM: [],
    };
    for (const p of filtered) {
      groups[positionToGroup[p.position]].push(p);
    }
    return groups;
  }, [filtered]);

  async function handleAddPlayer(player: Omit<Player, 'id'>) {
    await addPlayer(player);
    setShowAdd(false);
    await onRefresh();
  }

  async function handleEditPlayer(player: Omit<Player, 'id'> & { id?: string }) {
    if (player.id) {
      await updatePlayer(player as Player);
    }
    setEditPlayer(null);
    await onRefresh();
    if (player.id) {
      setDetailPlayer(players.find(p => p.id === player.id) ?? null);
    }
  }

  async function handleDeletePlayer(id: string) {
    await deletePlayer(id);
    setDetailPlayer(null);
    await onRefresh();
  }

  // Detail view
  if (detailPlayer) {
    const current = players.find(p => p.id === detailPlayer.id);
    if (!current) {
      setDetailPlayer(null);
      return null;
    }
    return (
      <>
        <PlayerDetail
          player={current}
          onBack={() => setDetailPlayer(null)}
          onEdit={() => setEditPlayer(current)}
          onDelete={() => handleDeletePlayer(current.id)}
        />
        {editPlayer && (
          <AddPlayerModal
            existingPlayer={editPlayer}
            onSave={handleEditPlayer}
            onClose={() => setEditPlayer(null)}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* Yellow header */}
      <div className="bg-primary safe-top">
        <div className="px-5 pt-3 pb-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] font-semibold text-white/80 tracking-[0.06em] uppercase leading-relaxed">
                {players.length} Spieler · Saison 25/26
              </div>
              <h1 className="text-[24px] font-black text-white leading-tight">
                KADER
              </h1>
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="w-9 h-9 bg-[#4cd964] hover:bg-[#3cbf54] active:bg-[#34a84a] rounded-full flex items-center justify-center transition-colors mt-1 shadow-sm"
            >
              <Plus size={20} className="text-white" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-surface px-4 pt-5 pb-3">
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/50" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Spieler suchen"
            className="w-full bg-[#f2f2f7] rounded-lg pl-[38px] pr-4 py-[10px] text-[15px] text-text placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/30 border border-[#e5e5ea]"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center px-4 pt-1 pb-3 gap-3 bg-surface">
        {([
          { key: 'alle' as Filter, label: 'Alle', count: players.length },
          { key: 'fit' as Filter, label: 'Fit', count: fitCount },
          { key: 'raus' as Filter, label: 'Raus', count: injuredCount },
        ]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`py-[6px] px-4 rounded-full text-[13px] font-semibold transition-all ${
              filter === tab.key
                ? 'bg-surface text-text border border-[#d1d1d6] shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                : 'text-text-secondary border border-transparent'
            }`}
          >
            {tab.label} · {tab.count}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 size={28} className="animate-spin text-primary" />
        </div>
      )}

      {/* Player list grouped by position */}
      {!loading && (
        <div className="mt-2">
          {positionGroupOrder.map(group => {
            const groupPlayers = grouped[group];
            if (groupPlayers.length === 0) return null;
            return (
              <div key={group}>
                {/* Section header */}
                <div className="px-5 pt-4 pb-2 text-[11px] font-bold text-text-secondary/60 tracking-[0.1em] uppercase">
                  {group} · {groupPlayers.length}
                </div>
                {/* Player rows with dividers */}
                <div>
                  {groupPlayers.map((player, i) => (
                    <div key={player.id}>
                      {i > 0 && <div className="h-px bg-[#e5e5ea] ml-[68px]" />}
                      <PlayerCard
                        player={player}
                        onClick={() => setDetailPlayer(player)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add modal */}
      {showAdd && (
        <AddPlayerModal
          onSave={handleAddPlayer}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}
