import { ChevronRight } from 'lucide-react';
import type { Player } from '../types';
import JerseyIcon from './JerseyIcon';

interface PlayerCardProps {
  player: Player;
  onClick: () => void;
}

export default function PlayerCard({ player, onClick }: PlayerCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 pl-4 pr-3 py-[10px] active:bg-[#f2f2f7] transition-colors text-left"
    >
      <JerseyIcon number={player.number} size={36} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-text text-[15px] leading-snug">{player.name}</span>
          <span
            className="w-[6px] h-[6px] rounded-full shrink-0 inline-block"
            style={{ backgroundColor: player.status === 'fit' ? 'var(--color-fit)' : 'var(--color-injured)' }}
          />
        </div>
        <div className="text-[12px] text-text-secondary leading-snug mt-[2px]">
          {player.position} · {player.age} Jahre · {player.games} Spiele
          {player.status === 'verletzt' && player.injury && (
            <span className="text-injured"> · {player.injury}</span>
          )}
        </div>
      </div>

      <div className="text-right shrink-0 min-w-[32px]">
        <div className="text-[18px] font-bold text-text leading-none">{player.goals}</div>
        <div className="text-[9px] text-text-secondary uppercase tracking-[0.06em] mt-[3px]">Tore</div>
      </div>

      <ChevronRight size={14} className="text-[#c7c7cc] shrink-0" />
    </button>
  );
}
