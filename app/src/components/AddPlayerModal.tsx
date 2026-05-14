import { useState } from 'react';
import { X } from 'lucide-react';
import type { Player, Position } from '../types';
import { allPositions } from '../types';

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

  const inputClass = "w-full bg-bg border border-border rounded-xl px-3.5 py-2.5 text-[15px] text-text placeholder:text-text-secondary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-center" onClick={onClose}>
      <div
        className="bg-surface w-full max-w-lg rounded-t-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-surface rounded-t-2xl z-10">
          <h2 className="text-[17px] font-bold text-text">
            {existingPlayer ? 'Spieler bearbeiten' : 'Neuer Spieler'}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-bg rounded-full transition-colors">
            <X size={20} className="text-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1.5">Name *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Vor- und Nachname" className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">Nummer *</label>
              <input type="number" value={number} onChange={e => setNumber(e.target.value)} placeholder="1-99" min="1" max="99" className={inputClass} />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">Position *</label>
              <select value={position} onChange={e => setPosition(e.target.value as Position)} className={inputClass + " appearance-none"}>
                {allPositions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1.5">Alter *</label>
            <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="Alter" min="14" max="50" className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">Spiele</label>
              <input type="number" value={games} onChange={e => setGames(e.target.value)} min="0" className={inputClass} />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">Tore</label>
              <input type="number" value={goals} onChange={e => setGoals(e.target.value)} min="0" className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1.5">Status</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setStatus('fit')}
                className={`flex-1 py-2.5 rounded-xl text-[14px] font-semibold transition-all ${status === 'fit' ? 'bg-fit/10 text-fit border-2 border-fit' : 'bg-bg border border-border text-text-secondary'}`}>
                Fit
              </button>
              <button type="button" onClick={() => setStatus('verletzt')}
                className={`flex-1 py-2.5 rounded-xl text-[14px] font-semibold transition-all ${status === 'verletzt' ? 'bg-injured/10 text-injured border-2 border-injured' : 'bg-bg border border-border text-text-secondary'}`}>
                Verletzt
              </button>
            </div>
          </div>

          {status === 'verletzt' && (
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">Verletzung</label>
              <input type="text" value={injury} onChange={e => setInjury(e.target.value)} placeholder="z.B. Muskelfaserriss · 2 Wochen" className={inputClass} />
            </div>
          )}

          <button type="submit" disabled={!isValid || saving}
            className="w-full bg-primary text-white font-bold py-3 rounded-xl text-[15px] transition-colors hover:bg-primary-dark active:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
            {saving ? 'Speichern...' : existingPlayer ? 'Speichern' : 'Spieler hinzufügen'}
          </button>
        </form>
      </div>
    </div>
  );
}
