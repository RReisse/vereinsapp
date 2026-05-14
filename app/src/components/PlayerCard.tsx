import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import type { Player } from '../types';
import JerseyIcon from './JerseyIcon';
import { tapScale, tapTransition } from '../lib/motion';

interface PlayerCardProps {
  player: Player;
  onClick: () => void;
}

export default function PlayerCard({ player, onClick }: PlayerCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={tapScale}
      transition={tapTransition}
      className="w-full flex items-center gap-3 px-5 py-[14px] active:bg-white-faint transition-colors duration-150 text-left rounded-lg"
    >
      <JerseyIcon number={player.number} size={44} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white text-[15px] leading-snug tracking-[-0.01em]">
            {player.name}
          </span>
          <span
            className={`w-[7px] h-[7px] rounded-full shrink-0 ring-2 ${
              player.status === 'verletzt' ? 'status-dot-injured' : ''
            }`}
            style={{
              backgroundColor: player.status === 'fit' ? 'var(--color-fit)' : 'var(--color-injured)',
              ringColor: player.status === 'fit' ? '#32d74b33' : '#ff453a33',
            }}
          />
        </div>
        <div className="text-[12px] text-white-muted leading-relaxed mt-[2px] tracking-[0.01em]">
          {player.position} · {player.age} Jahre · {player.games} Spiele
          {player.status === 'verletzt' && player.injury && (
            <span className="text-injured"> · {player.injury}</span>
          )}
        </div>
      </div>

      <div className="text-right shrink-0 min-w-[36px]">
        <div className={`text-[20px] font-bold leading-none tabular-nums ${player.goals > 0 ? 'text-amber' : 'text-white'}`}>
          {player.goals}
        </div>
        <div className="text-[9px] text-white-muted uppercase tracking-[0.12em] mt-1 font-medium">
          Tore
        </div>
      </div>

      <motion.div
        whileHover={{ x: 3 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <ChevronRight size={14} className="text-white-faint shrink-0" />
      </motion.div>
    </motion.button>
  );
}
