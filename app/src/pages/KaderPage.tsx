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
        <div className="px-5 pt-10 pb-12">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] font-semibold text-white/75 tracking-[0.08em] uppercase">
                {players.length} Spieler · Saison 25/26
              </div>
              <h1 className="text-[26px] font-black text-white leading-tight mt-0.5">
                KADER
              </h1>
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-full flex items-center justify-center transition-colors mt-1"
            >
              <Plus size={22} className="text-white" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Content area overlapping header */}
      <div className="bg-surface -mt-5 rounded-t-[20px] relative z-10">
        {/* Search */}
        <div className="px-5 pt-5 pb-3">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/50" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Spieler suchen"
              className="w-full bg-bg rounded-xl pl-10 pr-4 py-2.5 text-[15px] text-text placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/40 border-none"
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex px-5 gap-1 mb-4">
          {([
            { key: 'alle' as Filter, label: 'Alle', count: players.length },
            { key: 'fit' as Filter, label: 'Fit', count: fitCount },
            { key: 'raus' as Filter, label: 'Raus', count: injuredCount },
          ]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 py-2 rounded-full text-[13px] font-semibold transition-all ${
                filter === tab.key
                  ? 'bg-bg text-text shadow-sm'
                  : 'text-text-secondary'
              }`}
            >
              {tab.label} · {tab.count}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 size={28} className="animate-spin text-primary" />
          </div>
        )}

        {/* Player list grouped by position */}
        {!loading && (
          <div>
            {positionGroupOrder.map(group => {
              const groupPlayers = grouped[group];
              if (groupPlayers.length === 0) return null;
              return (
                <div key={group} className="mb-2">
                  <div className="px-5 py-2 text-[11px] font-bold text-text-secondary/70 tracking-[0.1em] uppercase">
                    {group} · {groupPlayers.length}
                  </div>
                  <div>
                    {groupPlayers.map((player, i) => (
                      <div key={player.id}>
                        {i > 0 && <div className="h-px bg-border ml-[72px] mr-5" />}
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
      </div>

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
