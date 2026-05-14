import { useState, useMemo } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Player, PositionGroup } from '../types';
import { positionToGroup, positionGroupOrder } from '../types';
import { addPlayer, updatePlayer, deletePlayer } from '../store';
import PlayerCard from '../components/PlayerCard';
import AddPlayerModal from '../components/AddPlayerModal';
import PlayerDetail from '../components/PlayerDetail';
import {
  springSnappy,
  staggerContainer,
  staggerItem,
  sectionHeader,
  fadeUp,
  pageSlideRight,
} from '../lib/motion';

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

  const filterTabs: { key: Filter; label: string; count: number }[] = [
    { key: 'alle', label: 'Alle', count: players.length },
    { key: 'fit', label: 'Fit', count: fitCount },
    { key: 'raus', label: 'Raus', count: injuredCount },
  ];

  // Detail view with iOS-style push transition
  if (detailPlayer) {
    const current = players.find(p => p.id === detailPlayer.id);
    if (!current) {
      setDetailPlayer(null);
      return null;
    }
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="detail"
          variants={pageSlideRight}
          initial="hidden"
          animate="show"
          exit="exit"
        >
          <PlayerDetail
            player={current}
            onBack={() => setDetailPlayer(null)}
            onEdit={() => setEditPlayer(current)}
            onDelete={() => handleDeletePlayer(current.id)}
          />
          <AnimatePresence>
            {editPlayer && (
              <AddPlayerModal
                existingPlayer={editPlayer}
                onSave={handleEditPlayer}
                onClose={() => setEditPlayer(null)}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-surface-0 pb-24 scroll-container">
      {/* ── Header ── */}
      <div className="relative overflow-hidden safe-top">
        {/* Animated amber gradient */}
        <div className="absolute inset-0 animated-header-gradient" />
        {/* Shimmer overlay */}
        <div className="absolute inset-0 shimmer-overlay" />
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }}
        />

        <div className="relative px-5 pt-12 pb-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="flex items-start justify-between"
          >
            <div>
              <div className="text-[10.5px] font-semibold text-white/70 tracking-[0.14em] uppercase">
                {players.length} Spieler · Saison 25/26
              </div>
              <h1
                className="text-[34px] font-[800] text-white leading-none mt-1.5 tracking-[0.04em]"
                style={{ textShadow: '0 2px 12px rgba(0,0,0,0.15)' }}
              >
                KADER
              </h1>
            </div>
            <motion.button
              onClick={() => setShowAdd(true)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={springSnappy}
              className="w-12 h-12 bg-white/15 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
            >
              <Plus size={22} className="text-white" strokeWidth={2.5} />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* ── Search ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.1 }}
        className="px-4 pt-5 pb-2"
      >
        <div className="relative glass rounded-2xl transition-shadow focus-within:shadow-[0_0_0_3px_rgba(245,197,24,0.12)]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Spieler suchen"
            className="w-full bg-transparent rounded-2xl pl-10 pr-4 py-[11px] text-[14px] text-white placeholder:text-white-muted focus:outline-none transition-all"
          />
        </div>
      </motion.div>

      {/* ── Filter Pills ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.15 }}
        className="flex items-center px-4 pt-2 pb-1 gap-2"
      >
        {filterTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className="relative z-10 py-[8px] px-5 rounded-full text-[12.5px] font-semibold tracking-[0.02em] transition-colors duration-200"
          >
            {filter === tab.key && (
              <motion.div
                layoutId="filter-pill"
                className="absolute inset-0 bg-surface-3 border border-border-strong rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                transition={springSnappy}
                style={{ zIndex: -1 }}
              />
            )}
            <span className={filter === tab.key ? 'text-white' : 'text-white-muted'}>
              {tab.label} · {tab.count}
            </span>
          </button>
        ))}
      </motion.div>

      {/* ── Loading ── */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={24} className="animate-spin text-amber" />
          <span className="text-[12px] text-white-muted tracking-wide">Lade Kader…</span>
        </div>
      )}

      {/* ── Player List ── */}
      {!loading && (
        <div className="mt-3">
          {positionGroupOrder.map(group => {
            const groupPlayers = grouped[group];
            if (groupPlayers.length === 0) return null;
            return (
              <motion.div
                key={group}
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="mb-1"
              >
                {/* Section header */}
                <motion.div variants={sectionHeader} className="flex items-center gap-2 px-5 pt-5 pb-2">
                  <span className="text-[10.5px] font-bold text-white-muted tracking-[0.16em] uppercase">
                    {group}
                  </span>
                  <span className="text-[10.5px] font-bold text-white-faint tracking-[0.16em]">
                    · {groupPlayers.length}
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent ml-1" />
                </motion.div>

                {/* Player rows */}
                <div>
                  {groupPlayers.map((player, i) => (
                    <motion.div key={player.id} variants={staggerItem}>
                      {i > 0 && <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent ml-[72px] mr-5" />}
                      <PlayerCard
                        player={player}
                        onClick={() => setDetailPlayer(player)}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add modal */}
      <AnimatePresence>
        {showAdd && (
          <AddPlayerModal
            onSave={handleAddPlayer}
            onClose={() => setShowAdd(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
