import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import type { Player } from '../types';
import JerseyIcon from './JerseyIcon';

interface PlayerDetailProps {
  player: Player;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function PlayerDetail({ player, onBack, onEdit, onDelete }: PlayerDetailProps) {
  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="bg-primary safe-top">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={onBack} className="p-1 text-white">
            <ArrowLeft size={24} />
          </button>
          <div className="flex gap-1">
            <button onClick={onEdit} className="p-2 text-white hover:bg-white/20 rounded-full transition-colors">
              <Pencil size={18} />
            </button>
            <button onClick={onDelete} className="p-2 text-white hover:bg-white/20 rounded-full transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center pb-8">
          <JerseyIcon number={player.number} size={72} />
          <h1 className="text-[24px] font-bold text-white mt-2">{player.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-white/70 font-medium text-[15px]">{player.position}</span>
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: player.status === 'fit' ? 'var(--color-fit)' : 'var(--color-injured)' }}
            />
            <span className="text-white/70 text-[14px]">
              {player.status === 'fit' ? 'Fit' : 'Verletzt'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats card overlapping header */}
      <div className="bg-bg -mt-4 rounded-t-2xl relative z-10 pt-4 px-4">
        <div className="grid grid-cols-3 rounded-xl overflow-hidden border border-border bg-surface">
          {[
            { label: 'Alter', value: player.age },
            { label: 'Spiele', value: player.games },
            { label: 'Tore', value: player.goals },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`py-4 text-center ${i < 2 ? 'border-r border-border' : ''}`}
            >
              <div className="text-[24px] font-bold text-text">{stat.value}</div>
              <div className="text-[10px] text-text-secondary uppercase tracking-wider mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Injury info */}
        {player.status === 'verletzt' && player.injury && (
          <div className="mt-4 p-3.5 bg-injured/8 border border-injured/20 rounded-xl">
            <div className="text-[12px] text-injured font-semibold uppercase tracking-wider">Verletzung</div>
            <div className="text-[15px] text-text mt-1">{player.injury}</div>
          </div>
        )}
      </div>
    </div>
  );
}
