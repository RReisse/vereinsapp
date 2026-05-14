import { useState } from 'react';
import { X } from 'lucide-react';
import { motion } from 'motion/react';
import type { Player, Position } from '../types';
import { allPositions } from '../types';
import { fadeBackdrop, slideUp, springSnappy } from '../lib/motion';

interface AddPlayerModalProps {
  onClose: () => void;
  onSave: (player: Omit<Player, 'id'> & { id?: string }) => void;
  existingPlayer?: Player;
}

export default function AddPlayerModal({ onClose, onSave, existingPlayer }: AddPlayerModalProps) {
  const [name, setName] = useState(existingPlayer?.name ?? '');
  const [number, setNumber] = useState(existingPlayer?.number?.toString() ?? '');
  const [position, setPosition] = useState<Position>(existingPlayer?.position ?? 'ST');
  const [age, setAge] = useState(existingPlayer?.age?.toString() ?? '');
  const [games, setGames] = useState(existingPlayer?.games?.toString() ?? '0');
  const [goals, setGoals] = useState(existingPlayer?.goals?.toString() ?? '0');
  const [status, setStatus] = useState<'fit' | 'verletzt'>(existingPlayer?.status ?? 'fit');
  const [injury, setInjury] = useState(existingPlayer?.injury ?? '');
  const [saving, setSaving] = useState(false);

  const isValid = name.trim() && number && age;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || saving) return;
    setSaving(true);

    onSave({
      ...(existingPlayer ? { id: existingPlayer.id } : {}),
      name: name.trim(),
      number: parseInt(number),
      position,
      age: parseInt(age),
      games: parseInt(games) || 0,
      goals: parseInt(goals) || 0,
      status,
      injury: status === 'verletzt' ? injury : undefined,
    });
  }

  const inputClass = "w-full bg-surface-2 border border-border-strong rounded-xl px-3.5 py-3 text-[14px] text-white placeholder:text-white-muted focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber-glow transition-all";

  return (
    <motion.div
      variants={fadeBackdrop}
      initial="hidden"
      animate="show"
      exit="exit"
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        variants={slideUp}
        initial="hidden"
        animate="show"
        exit="exit"
        drag="y"
        dragConstraints={{ top: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => { if (info.offset.y > 100) onClose(); }}
        className="bg-surface-1 w-full max-w-lg rounded-t-[20px] max-h-[90vh] overflow-y-auto border-t border-border-strong"
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-4 pb-3 border-b border-border sticky top-0 bg-surface-1/95 backdrop-blur-sm z-10">
          <h2 className="text-[17px] font-bold text-white">
            {existingPlayer ? 'Spieler bearbeiten' : 'Neuer Spieler'}
          </h2>
          <motion.button
            onClick={onClose}
            whileTap={{ scale: 0.9 }}
            transition={springSnappy}
            className="p-1.5 hover:bg-surface-3 rounded-full transition-colors"
          >
            <X size={20} className="text-white-muted" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-white-muted mb-1.5 tracking-[0.04em] uppercase">Name *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Vor- und Nachname" className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-white-muted mb-1.5 tracking-[0.04em] uppercase">Nummer *</label>
              <input type="number" value={number} onChange={e => setNumber(e.target.value)} placeholder="1-99" min="1" max="99" className={inputClass} />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-white-muted mb-1.5 tracking-[0.04em] uppercase">Position *</label>
              <select value={position} onChange={e => setPosition(e.target.value as Position)} className={inputClass + " appearance-none"}>
                {allPositions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-white-muted mb-1.5 tracking-[0.04em] uppercase">Alter *</label>
            <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="Alter" min="14" max="50" className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-white-muted mb-1.5 tracking-[0.04em] uppercase">Spiele</label>
              <input type="number" value={games} onChange={e => setGames(e.target.value)} min="0" className={inputClass} />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-white-muted mb-1.5 tracking-[0.04em] uppercase">Tore</label>
              <input type="number" value={goals} onChange={e => setGoals(e.target.value)} min="0" className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-white-muted mb-1.5 tracking-[0.04em] uppercase">Status</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setStatus('fit')}
                className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${status === 'fit' ? 'bg-fit/15 text-fit border border-fit/40' : 'bg-surface-2 border border-border-strong text-white-muted'}`}>
                Fit
              </button>
              <button type="button" onClick={() => setStatus('verletzt')}
                className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${status === 'verletzt' ? 'bg-injured/15 text-injured border border-injured/40' : 'bg-surface-2 border border-border-strong text-white-muted'}`}>
                Verletzt
              </button>
            </div>
          </div>

          {status === 'verletzt' && (
            <div>
              <label className="block text-[12px] font-semibold text-white-muted mb-1.5 tracking-[0.04em] uppercase">Verletzung</label>
              <input type="text" value={injury} onChange={e => setInjury(e.target.value)} placeholder="z.B. Muskelfaserriss · 2 Wochen" className={inputClass} />
            </div>
          )}

          <motion.button
            type="submit"
            disabled={!isValid || saving}
            whileTap={{ scale: 0.97 }}
            className="relative w-full overflow-hidden bg-gradient-to-r from-amber to-amber-deep text-surface-0 font-bold py-3.5 rounded-xl text-[14px] tracking-[0.02em] transition-all hover:shadow-[0_4px_16px_rgba(245,197,24,0.3)] active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 shimmer-overlay" />
            <span className="relative">{saving ? 'Speichern…' : existingPlayer ? 'Speichern' : 'Spieler hinzufügen'}</span>
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}
