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
      className="w-full flex items-center gap-3 px-5 py-3 active:bg-bg/60 transition-colors text-left"
    >
      <JerseyIcon number={player.number} size={38} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-text text-[15px]">{player.name}</span>
          <span
            className="w-[7px] h-[7px] rounded-full shrink-0 inline-block"
            style={{ backgroundColor: player.status === 'fit' ? 'var(--color-fit)' : 'var(--color-injured)' }}
          />
        </div>
        <div className="text-[12px] text-text-secondary leading-snug mt-0.5">
          {player.position} · {player.age} Jahre · {player.games} Spiele
          {player.status === 'verletzt' && player.injury && (
            <span className="text-injured"> · {player.injury}</span>
          )}
        </div>
      </div>

      <div className="text-right shrink-0 mr-0.5">
        <div className="text-[20px] font-bold text-text leading-none">{player.goals}</div>
        <div className="text-[9px] text-text-secondary uppercase tracking-[0.08em] mt-1">Tore</div>
      </div>

      <ChevronRight size={15} className="text-text-secondary/30 shrink-0" />
    </button>
  );
}
